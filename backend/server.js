const express = require('express');
const app = express();
const port = 3000;
const { appsApi, coreApi } = require('./k8ApiCnfig');
const { startAllWatchers, eventEmitter } = require('./EventWatcher');
const cors = require('cors');

app.use(cors());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/watch/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.flushHeaders();

  const send = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);

  const listener = (event) => send(event);
  eventEmitter.on('k8s-event', listener);
  const heartbeat = setInterval(() => res.write(':\n\n'), 15000);

  req.on('close', () => {
    eventEmitter.off('k8s-event', listener);
    clearInterval(heartbeat);
  });
});

app.get('/', (req, res) => {
  res.send('Hello World! changed');
});

app.get('/health', (req, res) => {
  res.send('Health check passed!');
});

app.get('/ready', (req, res) => {
  res.send('Container is ready!');
});

app.get('/autoscaled', (req, res) => {
  res.send('Autoscaling check passed!');
});

app.get('/k8s-apis', async (req, res) => {
  try {
    const response = await coreApi.listNamespacedPod({
      namespace: "self-healing-system-namespace",
    });
    console.log('Kubernetes APIs fetched successfully:', response);
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
});

app.get('/pods/summary', async (req, res) => {
  try {
    const response = await coreApi.listNamespacedPod({
      namespace: 'self-healing-system-namespace',
    });

    const pods = response.items;

    let runningPods = 0;
    let healthyPods = 0;
    let unhealthyPods = 0;
    let restartedPods = 0;

    pods.forEach((pod) => {
      // Running Pods
      if (pod.status.phase === 'Running') {
        runningPods++;
      }

      // Healthy / Unhealthy Pods
      const isReady = pod.status.conditions?.some(
        (condition) =>
          condition.type === 'Ready' &&
          condition.status === 'True'
      );

      if (isReady) {
        healthyPods++;
      } else {
        unhealthyPods++;
      }

      // Restarted Pods
      const hasRestarted = pod.status.containerStatuses?.some(
        (container) => container.restartCount > 0
      );

      if (hasRestarted) {
        restartedPods++;
      }
    });

    res.json({
      totalPods: pods.length,
      runningPods,
      healthyPods,
      unhealthyPods,
      restartedPods,
      destroyedPods: 0 // Will be implemented later using Events/Monitor Service
    });

  } catch (err) {
    console.error(err);
    // Cluster unreachable hai ya kuch aur issue — dono cases differentiate karo
    console.error('Error details:', err);
    const isClusterDown =
      err.code === 'ECONNREFUSED' ||
      err.code === 'ETIMEDOUT' ||
      err.message?.includes('ENOTFOUND');

    res.status(isClusterDown ? 503 : 500).json({
      status: 'error',
      message: isClusterDown
        ? 'Kubernetes cluster is not reachable right now'
        : 'Failed to fetch pod data',
    });

  }
});

app.get('/services/summary', async (req, res) => {
  try {
    const namespace = 'self-healing-system-namespace';

    const servicesResponse = await coreApi.listNamespacedService({
      namespace,
    });

    const deploymentsResponse = await appsApi.listNamespacedDeployment({
      namespace,
    });

    const services = servicesResponse.items;
    const deployments = deploymentsResponse.items;

    let runningServices = 0;
    let healthyServices = 0;
    let autoScaledServices = 0;

    const serviceDetails = [];

    services.forEach((service) => {
      const selector = service.spec.selector || {};

      const deployment = deployments.find((dep) => {
        const labels = dep.spec.template.metadata.labels || {};

        return Object.keys(selector).every(
          (key) => labels[key] === selector[key]
        );
      });

      if (!deployment) {
        serviceDetails.push({
          name: service.metadata.name,
          status: "Not Running",
          healthy: false,
          replicas: 0,
          readyReplicas: 0,
          autoScaled: false,
        });

        return;
      }

      const replicas = deployment.spec.replicas || 0;
      const readyReplicas = deployment.status.readyReplicas || 0;

      const isRunning = readyReplicas > 0;
      const isHealthy = replicas === readyReplicas;
      const isAutoScaled = replicas > 1; // Temporary until HPA

      if (isRunning) runningServices++;
      if (isHealthy) healthyServices++;
      if (isAutoScaled) autoScaledServices++;

      serviceDetails.push({
        name: service.metadata.name,
        status: isRunning ? "Running" : "Not Running",
        healthy: isHealthy,
        replicas,
        readyReplicas,
        autoScaled: isAutoScaled,
      });
    });

    res.json({
      totalServices: services.length,
      runningServices,
      healthyServices,
      autoScaledServices,
      services: serviceDetails,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
});

app.listen(port, () => {
  console.log(`yes: Example app listening at http://localhost:${port}`);
  startAllWatchers();
});
