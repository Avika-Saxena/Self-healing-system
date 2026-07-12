const k8s = require('@kubernetes/client-node');

const kubeClient = new k8s.KubeConfig();
kubeClient.loadFromDefault();

const cluster = kubeClient.getCurrentCluster();
cluster.skipTLSVerify = true;

const appsApi = kubeClient.makeApiClient(k8s.AppsV1Api);
const coreApi = kubeClient.makeApiClient(k8s.CoreV1Api);

module.exports = { kubeClient, appsApi, coreApi };