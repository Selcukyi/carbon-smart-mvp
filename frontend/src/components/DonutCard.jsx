import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["var(--primary-500)", "var(--accent-500)", "var(--secondary-400)"];

export default function DonutCard({ data }) {
  const chartData = data?.data || [
    { name: "Scope 1", value: 1200, color: "var(--primary-500)" },
    { name: "Scope 2", value: 1200, color: "var(--accent-500)" },
    { name: "Scope 3", value: 447, color: "var(--secondary-400)" },
  ];

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Scope Analysis</h3>
          <p className="chart-subtitle">January 2025 - December 2025</p>
        </div>
        <div className="chart-actions">
          <select className="form-select" style={{ width: 'auto', minWidth: '120px' }}>
            <option>Scope 1</option>
            <option>Scope 2</option>
            <option>Scope 3</option>
          </select>
        </div>
      </div>
      
      <div className="chart-container">
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
                <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value} tCO₂e`, '']}
              contentStyle={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                fontFamily: 'var(--font-sans)'
              }}
              labelStyle={{
                color: 'var(--text-primary)',
                fontWeight: 'var(--font-semibold)'
              }}
            />
            <Legend 
              wrapperStyle={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Chart Legend */}
      <div className="chart-legend">
        {chartData.map((item, index) => (
          <div key={item.name} className="legend-item">
            <div 
              className="legend-color" 
              style={{ backgroundColor: item.color || COLORS[index % COLORS.length] }}
            ></div>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

