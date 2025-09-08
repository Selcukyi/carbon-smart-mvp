import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function BarCard({ data = [] }) {
  // Ensure data is properly formatted
  const chartData = Array.isArray(data) ? data : [];
  
  
  return (
    <div className="chart-card">
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>Categories with Highest Emissions</h3>
        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>January 2025 - December 2025</div>
      </div>
      <div style={{ width: '100%', height: '16rem', position: 'relative' }}>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                type="number"
                domain={[0, 'dataMax + 100']}
                tickFormatter={(value) => `${value}`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                formatter={(value, name) => [`${value} tCO₂e`, 'Emissions']}
                labelFormatter={(label) => `Category: ${label}`}
              />
              <Bar 
                dataKey="value" 
                fill="#16a34a" 
                radius={[4, 4, 0, 0]}
                name="Emissions"
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            color: '#6b7280',
            fontSize: '0.875rem'
          }}>
            No data available
          </div>
        )}
        
      </div>
    </div>
  );
}

