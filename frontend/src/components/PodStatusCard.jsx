import { Row, Col, Statistic } from 'antd';
import {
  SafetyCertificateOutlined,
  WarningOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

export default function PodStatusCard({ data }) {
  if (!data) {
    return <p>Loading pod summary data...</p>;
  }
  console.log(data);
  const { totalPods, runningPods, healthyPods, unhealthyPods, restartedPods, destroyedPods } = data;

  const cards = [
    {
      label: 'TOTAL PODS',
      value: totalPods.toString(),
      sub: 'Total pods in the cluster',
      icon: <SafetyCertificateOutlined />,
      color: '#34d399',
      borderColor: 'border-emerald-500/20',
      iconBg: 'bg-emerald-500/10',
    },
    {
      label: 'RUNNING PODS',
      value: runningPods.toString(),
      sub: 'Currently running',
      icon: <ThunderboltOutlined />,
      color: '#22d3ee',
      borderColor: 'border-cyan-500/20',
      iconBg: 'bg-cyan-500/10',
    },
    {
      label: 'HEALTHY PODS',
      value: healthyPods.toString(),
      sub: 'Operational status',
      icon: <SafetyCertificateOutlined />,
      color: '#34d399',
      borderColor: 'border-emerald-500/20',
      iconBg: 'bg-emerald-500/10',
    },
    {
      label: 'UNHEALTHY PODS',
      value: unhealthyPods.toString(),
      sub: 'Non-operational status',
      icon: <WarningOutlined />,
      color: '#fbbf24',
      borderColor: 'border-amber-500/20',
      iconBg: 'bg-amber-500/10',
    },
    {
      label: 'RESTARTED PODS',
      value: restartedPods.toString(),
      sub: 'Recently restarted',
      icon: <ThunderboltOutlined />,
      color: '#f59e0b',
      borderColor: 'border-amber-500/20',
      iconBg: 'bg-amber-500/10',
    },
    {
      label: 'DESTROYED PODS',
      value: destroyedPods.toString(),
      sub: 'Removed from cluster',
      icon: <ClockCircleOutlined />,
      color: '#ef4444',
      borderColor: 'border-red-500/20',
      iconBg: 'bg-red-500/10',
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {cards.map((card) => (
        <Col xs={24} sm={12} lg={6} key={card.label}>
          <div className={`glass-card glow-border rounded-xl p-5 border ${card.borderColor} transition-all duration-300 h-full`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-2">{card.label}</p>
                <Statistic
                  value={card.value}
                  valueStyle={{
                    color: card.color,
                    fontSize: 30,
                    fontWeight: 800,
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                />
                <p className="text-[11px] text-slate-500 mt-1">{card.sub}</p>
              </div>
              <div className={`${card.iconBg} p-2.5 rounded-lg text-lg`} style={{ color: card.color }}>
                {card.icon}
              </div>
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );
};
