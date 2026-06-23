import { Row, Col, Statistic } from 'antd';
import {
  SafetyCertificateOutlined,
  WarningOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

export default function StatsCards({ sla, incidents, autoHealed, avgMttr }) {
  const cards = [
    {
      label: 'SYSTEM SLA',
      value: `${sla.toFixed(1)}%`,
      sub: 'All nodes healthy',
      icon: <SafetyCertificateOutlined />,
      color: '#34d399',
      borderColor: 'border-emerald-500/20',
      iconBg: 'bg-emerald-500/10',
    },
    {
      label: 'INCIDENTS',
      value: incidents.toString(),
      sub: 'Total detected',
      icon: <WarningOutlined />,
      color: incidents > 0 ? '#fbbf24' : '#94a3b8',
      borderColor: incidents > 0 ? 'border-amber-500/20' : 'border-dark-400',
      iconBg: incidents > 0 ? 'bg-amber-500/10' : 'bg-dark-500',
    },
    {
      label: 'AUTO-HEALED',
      value: autoHealed.toString(),
      sub: 'Without human intervention',
      icon: <ThunderboltOutlined />,
      color: autoHealed > 0 ? '#22d3ee' : '#94a3b8',
      borderColor: autoHealed > 0 ? 'border-cyan-500/20' : 'border-dark-400',
      iconBg: autoHealed > 0 ? 'bg-cyan-500/10' : 'bg-dark-500',
    },
    {
      label: 'AVG MTTR',
      value: avgMttr,
      sub: 'Mean time to recovery',
      icon: <ClockCircleOutlined />,
      color: '#c084fc',
      borderColor: 'border-dark-400',
      iconBg: 'bg-purple-500/10',
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
}
