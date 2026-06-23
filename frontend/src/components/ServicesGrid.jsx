import { Row, Col, Button, Progress, Tag, Badge } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';

function getStatusConfig(status) {
  switch (status) {
    case 'Healthy':
      return { color: 'success', dotClass: 'bg-emerald-400', textClass: 'text-emerald-400' };
    case 'Healing':
      return { color: 'warning', dotClass: 'bg-amber-400 animate-pulse', textClass: 'text-amber-400' };
    case 'Down':
      return { color: 'error', dotClass: 'bg-red-400', textClass: 'text-red-400' };
    case 'Degraded':
      return { color: 'warning', dotClass: 'bg-orange-400', textClass: 'text-orange-400' };
    default:
      return { color: 'default', dotClass: 'bg-slate-400', textClass: 'text-slate-400' };
  }
}

function getBarColor(value) {
  if (value > 80) return '#ef4444';
  if (value > 60) return '#fbbf24';
  return '#06b6d4';
}

function MetricBar({ label, value, defaultColor }) {
  const numVal = typeof value === 'string' ? parseInt(value) : value;
  const percentage = Math.min(100, isNaN(numVal) ? 0 : numVal);
  const barColor = isNaN(numVal) ? '#374151' : (defaultColor ? getBarColor(numVal) || defaultColor : getBarColor(numVal));

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-slate-500 w-12 font-semibold uppercase tracking-wider">{label}</span>
      <div className="flex-1">
        <Progress
          percent={percentage}
          showInfo={false}
          size="small"
          strokeColor={barColor}
          trailColor="#1a2332"
          style={{ marginBottom: 0 }}
        />
      </div>
      <span className="text-[11px] text-slate-400 w-12 text-right font-mono">
        {typeof value === 'string' ? value : `${value}%`}
      </span>
    </div>
  );
}

export default function ServicesGrid({ services, onCrash }) {
  return (
    <div className="glass-card glow-border rounded-xl p-5 border border-dark-400">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white m-0">Services</h3>
        <p className="text-[11px] text-slate-500 m-0">Click any service to simulate a crash</p>
      </div>
      <Row gutter={[12, 12]}>
        {services.map((service) => {
          const statusConfig = getStatusConfig(service.status);
          return (
            <Col xs={24} md={12} key={service.id}>
              <div
                className={`rounded-lg border transition-all duration-300 p-4 ${
                  service.status === 'Down'
                    ? 'border-red-500/30 bg-red-500/5'
                    : service.status === 'Healing'
                    ? 'border-amber-500/30 bg-amber-500/5'
                    : 'border-dark-300 bg-dark-700/50 hover:border-dark-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{service.icon}</span>
                    <div>
                      <span className="text-xs font-bold text-white block">{service.name}</span>
                      <Badge
                        status={statusConfig.color}
                        text={
                          <span className={`text-[10px] font-semibold ${statusConfig.textClass}`}>
                            {service.status}
                          </span>
                        }
                        className="mt-0.5"
                      />
                    </div>
                  </div>
                  <Button
                    size="small"
                    icon={<CloseCircleOutlined />}
                    onClick={() => onCrash(service.id)}
                    disabled={service.status !== 'Healthy'}
                    className={`!text-[10px] !font-bold !uppercase !tracking-wider !rounded-md ${
                      service.status === 'Healthy'
                        ? '!bg-red-500/10 !text-red-400 !border-red-500/20 hover:!bg-red-500/20 hover:!border-red-500/40'
                        : '!bg-dark-500 !text-slate-600 !border-dark-400 !cursor-not-allowed'
                    }`}
                    style={{ fontSize: 10 }}
                  >
                    Crash
                  </Button>
                </div>
                <div className="space-y-1.5">
                  <MetricBar label="CPU" value={service.cpu} defaultColor="#06b6d4" />
                  <MetricBar label="MEM" value={service.mem} defaultColor="#8b5cf6" />
                  <MetricBar label="Latency" value={service.latency} defaultColor="#10b981" />
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
