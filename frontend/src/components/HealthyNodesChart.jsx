import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-800 border border-dark-300 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-[10px] text-slate-400 font-mono mb-1">{label}</p>
        <p className="text-xs font-semibold text-cyan-400">
          Healthy: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function HealthyNodesChart({ data, totalNodes }) {
  return (
    <div className="glass-card glow-border rounded-xl p-5 border border-dark-400">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white m-0">Healthy Nodes</h3>
        <p className="text-[11px] text-slate-500 m-0">Cluster availability trend</p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
          <YAxis
            domain={[0, totalNodes + 1]}
            tick={{ fontSize: 10, fill: '#64748b' }}
            axisLine={{ stroke: '#1e293b' }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="nodes"
            stroke="#22d3ee"
            strokeWidth={2}
            dot={{ r: 3, fill: '#22d3ee', stroke: '#0a0e17', strokeWidth: 2 }}
            activeDot={{ r: 5, fill: '#22d3ee', stroke: '#0a0e17', strokeWidth: 2 }}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
