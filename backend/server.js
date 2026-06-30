const express = require('express');
const app = express();
const port = 3000;
const { appsApi } = require('./k8ApiCnfig');

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!');
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

app.get('/deployment', async (req, res) => {
  try {
    console.log('Fetching deployments from Kubernetes...');
    const response = await appsApi.listNamespacedDeployment({
      namespace: "self-healing-system-namespace",
    });

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
