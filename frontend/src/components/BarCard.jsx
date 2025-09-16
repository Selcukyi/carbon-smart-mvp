import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function BarCard({ data = [] }) {
  // Ensure data is properly formatted
  const chartData = Array.isArray(data) ? data : [];
  
  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Categories with Highest Emissions</h3>
          <p className="chart-subtitle">January 2025 - December 2025</p>
        </div>
        <div className="chart-actions">
          <button className="btn btn-ghost btn-sm">
            <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-sm"></div>
            </div>
            Export
          </button>
        </div>
      </div>
      
      <div className="chart-container">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis 
                dataKey="name" 
                tick={{ 
                  fontSize: 12, 
                  fill: 'var(--text-secondary)',
                  fontFamily: 'var(--font-sans)'
                }}
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
                tick={{ 
                  fontSize: 12, 
                  fill: 'var(--text-secondary)',
                  fontFamily: 'var(--font-sans)'
                }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                formatter={(value, name) => [`${value} tCO₂e`, 'Emissions']}
                labelFormatter={(label) => `Category: ${label}`}
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
              <Bar 
                dataKey="value" 
                fill="url(#gradientBar)" 
                radius={[6, 6, 0, 0]}
                name="Emissions"
                maxBarSize={60}
              />
              <defs>
                <linearGradient id="gradientBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary-500)" />
                  <stop offset="100%" stopColor="var(--primary-700)" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-secondary">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-gray-600 rounded-sm"></div>
                </div>
              </div>
              <div className="text-sm font-medium">No data available</div>
            </div>
          </div>
        )}
      </div>
      
      {/* Chart Legend */}
      {chartData.length > 0 && (
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: 'var(--primary-500)' }}></div>
            <span>Emissions (tCO₂e)</span>
          </div>
        </div>
      )}
    </div>
  );
}

