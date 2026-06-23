import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Badge, Space } from 'antd';

export default function NodeStatusChart({ data }) {
  const total = data.reduce((acc, d) => acc + d.value, 0);

  const legends = [
    { name: 'Healthy', color: '#10b981' },
    { name: 'Healing', color: '#fbbf24' },
    { name: 'Down', color: '#ef4444' },
    { name: 'Degraded', color: '#f97316' },
  ];

  return (
    <div className="glass-card glow-border rounded-xl p-5 border border-dark-400 h-full">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white m-0">Node Status</h3>
        <p className="text-[11px] text-slate-500 m-0">Live cluster distribution</p>
      </div>
      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: 190, height: 190 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                animationDuration={800}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-white">{total}</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Nodes</span>
          </div>
        </div>
        <Space size="large" className="mt-3" wrap>
          {legends.map((item) => (
            <Badge
              key={item.name}
              color={item.color}
              text={<span className="text-[11px] text-slate-400">{item.name}</span>}
            />
          ))}
        </Space>
      </div>
    </div>
  );
}
