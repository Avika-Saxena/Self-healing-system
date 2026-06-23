import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-800 border border-dark-300 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-[10px] text-slate-400 font-mono mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-xs font-semibold" style={{ color: p.color }}>
            {p.name}: {p.value}{p.name === 'Latency (ms)' ? 'ms' : ' rps'}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function LatencyChart({ data }) {
  return (
    <div className="glass-card glow-border rounded-xl p-5 border border-dark-400 h-full">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white m-0">Latency &amp; Throughput</h3>
        <p className="text-[11px] text-slate-500 m-0">Live response time vs request volume</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <defs>
            <linearGradient id="throughputGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
            formatter={(value) => <span className="text-slate-400 text-[11px]">{value}</span>}
          />
          <Area
            type="monotone"
            dataKey="throughput"
            name="Throughput (rps)"
            stroke="#06b6d4"
            fill="url(#throughputGrad)"
            strokeWidth={2}
            dot={false}
            animationDuration={800}
          />
          <Area
            type="monotone"
            dataKey="latency"
            name="Latency (ms)"
            stroke="#10b981"
            fill="url(#latencyGrad)"
            strokeWidth={2}
            dot={false}
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
