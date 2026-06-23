import { Tag, Timeline } from 'antd';
import { RadarChartOutlined } from '@ant-design/icons';

function getTypeConfig(type) {
  switch (type) {
    case 'info':
      return { color: '#22d3ee', textClass: 'text-cyan-400', icon: 'ℹ️' };
    case 'warning':
      return { color: '#fbbf24', textClass: 'text-amber-400', icon: '⚠️' };
    case 'error':
      return { color: '#ef4444', textClass: 'text-red-400', icon: '🔴' };
    case 'success':
      return { color: '#10b981', textClass: 'text-emerald-400', icon: '✅' };
    default:
      return { color: '#64748b', textClass: 'text-slate-400', icon: '📋' };
  }
}

export default function EventStream({ events }) {
  return (
    <div className="glass-card glow-border rounded-xl p-5 border border-dark-400 h-full">
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 bg-cyan-500/10 rounded-lg">
          <RadarChartOutlined style={{ fontSize: 16, color: '#22d3ee' }} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white m-0">Event Stream</h3>
          <p className="text-[11px] text-slate-500 m-0">Healing agent live log</p>
        </div>
      </div>
      <div className="max-h-[360px] overflow-y-auto pr-1">
        <Timeline
          items={events.map((event, index) => {
            const config = getTypeConfig(event.type);
            return {
              color: config.color,
              children: (
                <div className={`${index === 0 ? 'animate-slide-in' : ''} -mt-0.5`}>
                  <div className="flex items-start gap-2">
                    <Tag
                      bordered={false}
                      className="!text-[10px] !font-mono !px-1.5 !py-0 !m-0 !leading-5"
                      style={{
                        background: 'rgba(30, 41, 59, 0.8)',
                        color: '#64748b',
                        borderRadius: 4,
                      }}
                    >
                      {event.timestamp}
                    </Tag>
                    <span className="text-xs">{config.icon}</span>
                  </div>
                  <p className={`text-xs font-mono leading-relaxed mt-1 mb-0 ${config.textClass}`}>
                    {event.message}
                  </p>
                </div>
              ),
            };
          })}
        />
      </div>
    </div>
  );
}
