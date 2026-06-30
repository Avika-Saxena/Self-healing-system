import { useState, useEffect, useCallback, useRef } from 'react';
import { ConfigProvider, theme, Row, Col } from 'antd';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import FailureSimulator from './components/FailureSimulator';
import LatencyChart from './components/LatencyChart';
import NodeStatusChart from './components/NodeStatusChart';
import IncidentsChart from './components/IncidentsChart';
import HealthyNodesChart from './components/HealthyNodesChart';
import ServicesGrid from './components/ServicesGrid';
import EventStream from './components/EventStream';
import {
  initialServices,
  initialEvents,
  generateLatencyData,
  generateNodeStatusData,
  generateIncidentsData,
  generateHealthyNodesData,
} from './data';
import axios from 'axios';

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

const darkTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#06b6d4',
    colorBgContainer: '#111827',
    colorBgElevated: '#0d1220',
    colorBorder: '#1e293b',
    colorBorderSecondary: '#1e293b',
    colorText: '#e2e8f0',
    colorTextSecondary: '#94a3b8',
    colorTextTertiary: '#64748b',
    fontFamily: "'Inter', system-ui, sans-serif",
    borderRadius: 10,
    fontSize: 13,
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#06b6d4',
  },
  components: {
    Card: {
      colorBgContainer: 'transparent',
    },
    Tag: {
      borderRadiusSM: 9999,
    },
    Progress: {
      remainingColor: '#1a2332',
    },
    Timeline: {
      dotBorderWidth: 2,
      tailColor: '#1e293b',
    },
    Button: {
      borderRadius: 8,
    },
    InputNumber: {
      colorBgContainer: '#0d1220',
      colorBorder: '#2a3548',
    },
    Statistic: {
      fontFamily: "'Inter', system-ui, sans-serif",
    },
  },
};

export default function App() {
  const [services, setServices] = useState(initialServices);
  const [events, setEvents] = useState(initialEvents);
  const [syntheticLoad, setSyntheticLoad] = useState(1000);
  const [incidents, setIncidents] = useState(0);
  const [autoHealed, setAutoHealed] = useState(0);
  const [latencyData, setLatencyData] = useState(generateLatencyData);
  const [incidentsData, setIncidentsData] = useState(generateIncidentsData);
  const [lastSync, setLastSync] = useState(getCurrentTime());
  const eventIdRef = useRef(initialEvents.length + 1);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchDeploymentData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/deployment');
        console.log
        setResult(response.data);
      } catch (error) {
        console.error('Error fetching deployment data:', error);
      }
    };

    fetchDeploymentData();
  }, []);

  console.log('Deployment Data:', result);

  const addEvent = useCallback((message, type) => {
    const newEvent = {
      id: eventIdRef.current++,
      timestamp: getCurrentTime(),
      message,
      type,
    };
    setEvents((prev) => [newEvent, ...prev].slice(0, 50));
  }, []);

  // Heal services after delay
  useEffect(() => {
    const healingServices = services.filter((s) => s.status === 'Healing');
    if (healingServices.length === 0) return;

    const timers = healingServices.map((service) => {
      return setTimeout(() => {
        setServices((prev) =>
          prev.map((s) =>
            s.id === service.id
              ? {
                  ...s,
                  status: 'Healthy',
                  cpu: Math.floor(Math.random() * 30) + 10,
                  mem: Math.floor(Math.random() * 40) + 15,
                  latency: `${Math.floor(Math.random() * 40) + 5}ms`,
                }
              : s
          )
        );
        setAutoHealed((prev) => prev + 1);
        addEvent(`✨ ${service.name} successfully recovered — service restored.`, 'success');
      }, 4000 + Math.random() * 3000);
    });

    return () => timers.forEach(clearTimeout);
  }, [services, addEvent]);

  // Transition Down → Healing after delay
  useEffect(() => {
    const downServices = services.filter((s) => s.status === 'Down');
    if (downServices.length === 0) return;

    const timers = downServices.map((service) => {
      return setTimeout(() => {
        setServices((prev) =>
          prev.map((s) =>
            s.id === service.id ? { ...s, status: 'Healing' } : s
          )
        );
        addEvent(`🔄 Healing agent triggered for ${service.name} — recovery in progress...`, 'warning');
      }, 2000 + Math.random() * 1500);
    });

    return () => timers.forEach(clearTimeout);
  }, [services, addEvent]);

  // Refresh chart data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setLatencyData((prev) => {
        const next = [...prev.slice(1)];
        const lastTime = parseInt(prev[prev.length - 1].time) + 1;
        next.push({
          time: `${lastTime}s`,
          throughput: Math.floor(Math.random() * 400) + 600,
          latency: Math.floor(Math.random() * 30) + 10,
        });
        return next;
      });
      setLastSync(getCurrentTime());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleCrashService = useCallback(
    (serviceId) => {
      setServices((prev) =>
        prev.map((s) =>
          s.id === serviceId
            ? { ...s, status: 'Down', cpu: 0, mem: 0, latency: '—' }
            : s
        )
      );
      const service = services.find((s) => s.id === serviceId);
      if (service) {
        setIncidents((prev) => prev + 1);
        addEvent(`💥 ${service.name} crashed! Failure injected manually.`, 'error');
        setIncidentsData((prev) => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          updated[lastIdx] = {
            ...updated[lastIdx],
            incidents: updated[lastIdx].incidents + 1,
          };
          return updated;
        });
      }
    },
    [services, addEvent]
  );

  const handleInjectFailure = useCallback(
    (type) => {
      const healthyServices = services.filter((s) => s.status === 'Healthy');
      if (healthyServices.length === 0) {
        addEvent('⚠️ No healthy services available to crash.', 'warning');
        return;
      }
      const target = healthyServices[Math.floor(Math.random() * healthyServices.length)];
      addEvent(`🎯 Injecting ${type} failure into ${target.name}...`, 'warning');
      setTimeout(() => handleCrashService(target.id), 500);
    },
    [services, handleCrashService, addEvent]
  );

  const healthyCount = services.filter((s) => s.status === 'Healthy').length;
  const totalCount = services.length;
  const sla = (healthyCount / totalCount) * 100;
  const nodeStatusData = generateNodeStatusData(services);
  const healthyNodesData = generateHealthyNodesData(healthyCount);

  const avgMttr = autoHealed > 0 ? `${(Math.random() * 3 + 4).toFixed(1)}s` : '—';

  return (
    <ConfigProvider theme={darkTheme}>
      <div className="min-h-screen bg-dark-900 text-slate-200 font-sans">
        <Header agentOnline={true} lastSync={lastSync} />

        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* Stats Cards */}
          <StatsCards sla={sla} incidents={incidents} autoHealed={autoHealed} avgMttr={avgMttr} />

          {/* Failure Simulator */}
          <FailureSimulator
            onInjectFailure={handleInjectFailure}
            syntheticLoad={syntheticLoad}
            onLoadChange={setSyntheticLoad}
          />

          {/* Charts Row 1 */}
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={15}>
              <LatencyChart data={latencyData} />
            </Col>
            <Col xs={24} lg={9}>
              <NodeStatusChart data={nodeStatusData} />
            </Col>
          </Row>

          {/* Charts Row 2 */}
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <IncidentsChart data={incidentsData} />
            </Col>
            <Col xs={24} lg={12}>
              <HealthyNodesChart data={healthyNodesData} totalNodes={totalCount} />
            </Col>
          </Row>

          {/* Services + Event Stream */}
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={15}>
              <ServicesGrid services={services} onCrash={handleCrashService} />
            </Col>
            <Col xs={24} lg={9}>
              <EventStream events={events} />
            </Col>
          </Row>
        </main>

        {/* Footer */}
        <footer className="border-t border-dark-400/50 py-4 mt-6">
          <p className="text-center text-[11px] text-slate-600 font-mono">
            Aegis Self-Healing Platform v1.0 — monitoring
          </p>
        </footer>
      </div>
    </ConfigProvider>
  );
}
