import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#16a34a", "#22c55e", "#86efac"]; // greens

export default function DonutCard({ data }) {
  const chartData = data.data || [
    { name: "Scope 1", value: 1200 },
    { name: "Scope 2", value: 1200 },
    { name: "Scope 3", value: 447 },
  ];
  return (
    <div className="chart-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>Scope Analysis</h3>
        <select style={{ fontSize: '0.875rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', padding: '0.25rem 0.5rem', background: 'white', color: '#111827' }}>
          <option>Scope 1</option>
          <option>Scope 2</option>
          <option>Scope 3</option>
        </select>
      </div>
      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '1rem' }}>January 2025 - December 2025</div>
      <div style={{ width: '100%', height: '16rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={chartData} 
              dataKey="value" 
              nameKey="name" 
              cx="50%" 
              cy="50%" 
              innerRadius={60} 
              outerRadius={100}
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} tCO₂e`, '']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

