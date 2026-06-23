import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-800 border border-dark-300 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-[10px] text-slate-400 font-mono mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-xs font-semibold" style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function IncidentsChart({ data }) {
  return (
    <div className="glass-card glow-border rounded-xl p-5 border border-dark-400">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white m-0">Incidents vs Auto-Recoveries</h3>
        <p className="text-[11px] text-slate-500 m-0">Cumulative over time</p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
            formatter={(value) => <span className="text-slate-400 text-[11px]">{value}</span>}
          />
          <Bar dataKey="incidents" name="Incidents" fill="#ef4444" radius={[3, 3, 0, 0]} barSize={12} />
          <Bar dataKey="healed" name="Healed" fill="#10b981" radius={[3, 3, 0, 0]} barSize={12} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
