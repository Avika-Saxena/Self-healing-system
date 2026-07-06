const k8s = require('@kubernetes/client-node');
const EventEmitter = require('events');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const watch = new k8s.Watch(kc);
const eventEmitter = new EventEmitter();

function startWatch(path, resourceType) {
  watch.watch(
    path,
    {},
    (type, obj) => {
      eventEmitter.emit('k8s-event', {
        resourceType,
        type,
        name: obj.metadata?.name,
        namespace: obj.metadata?.namespace,
        reason: obj.reason,          // only present on core Events
        message: obj.message,
        eventType: obj.type,         // Normal | Warning (for Events)
        status: obj.status,          // for Pods/Deployments
        timestamp: new Date().toISOString(),
      });
    },
    (err) => {
      console.warn(`Watch closed for ${resourceType}, reconnecting...`, err?.message);
      setTimeout(() => startWatch(path, resourceType), 2000); // backoff
    }
  ).catch((err) => {
    console.error(`Failed to start watch for ${resourceType}:`, err.message);
    setTimeout(() => startWatch(path, resourceType), 5000);
  });
}

function startAllWatchers() {
  console.log('Starting all Kubernetes watchers...');
  startWatch('/api/v1/events', 'Event');
  startWatch('/api/v1/pods', 'Pod');
  startWatch('/apis/apps/v1/deployments', 'Deployment');
}

module.exports = { startAllWatchers, eventEmitter };
