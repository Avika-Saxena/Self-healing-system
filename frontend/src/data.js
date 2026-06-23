export const initialServices = [
  { id: 'api-gw', name: 'API Gateway', icon: '🌐', status: 'Healthy', cpu: 23, mem: 45, latency: '12ms' },
  { id: 'auth', name: 'Auth Service', icon: '🔐', status: 'Healthy', cpu: 18, mem: 32, latency: '34ms' },
  { id: 'primary-db', name: 'Primary DB', icon: '🗄️', status: 'Healthy', cpu: 52, mem: 67, latency: '8ms' },
  { id: 'cache', name: 'Cache Layer', icon: '⚡', status: 'Healthy', cpu: 8, mem: 14, latency: '2ms' },
  { id: 'worker', name: 'Worker Pool', icon: '⚙️', status: 'Healthy', cpu: 35, mem: 48, latency: '72ms' },
  { id: 'storage', name: 'Object Storage', icon: '💾', status: 'Healthy', cpu: 12, mem: 22, latency: '45ms' },
];

export const generateLatencyData = () => {
  const data = [];
  for (let i = 0; i < 20; i++) {
    data.push({
      time: `${i}s`,
      throughput: Math.floor(Math.random() * 400) + 600,
      latency: Math.floor(Math.random() * 30) + 10,
    });
  }
  return data;
};

export const generateNodeStatusData = (services) => {
  const healthy = services.filter(s => s.status === 'Healthy').length;
  const healing = services.filter(s => s.status === 'Healing').length;
  const down = services.filter(s => s.status === 'Down').length;
  const degraded = services.filter(s => s.status === 'Degraded').length;
  return [
    { name: 'Healthy', value: healthy, color: '#10b981' },
    { name: 'Healing', value: healing, color: '#fbbf24' },
    { name: 'Down', value: down, color: '#ef4444' },
    { name: 'Degraded', value: degraded, color: '#f97316' },
  ].filter(d => d.value > 0);
};

export const generateIncidentsData = () => {
  const data = [];
  for (let i = 0; i < 10; i++) {
    const incidents = Math.floor(Math.random() * 3);
    data.push({
      time: `${i * 3}m`,
      incidents,
      healed: Math.min(incidents, Math.floor(Math.random() * 3)),
    });
  }
  return data;
};

export const generateHealthyNodesData = (count) => {
  const data = [];
  for (let i = 0; i < 15; i++) {
    data.push({
      time: `${i}m`,
      nodes: Math.min(count, Math.max(count - 2, Math.floor(Math.random() * 2) + count - 1)),
    });
  }
  return data;
};

export const initialEvents = [
  { id: 1, timestamp: '14:08:12', message: 'All systems nominal. Self-healing agent armed.', type: 'success' },
  { id: 2, timestamp: '14:07:45', message: 'Health check completed — 6/6 services online.', type: 'info' },
  { id: 3, timestamp: '14:06:30', message: 'Synthetic load test passed — latency within SLA.', type: 'info' },
];
