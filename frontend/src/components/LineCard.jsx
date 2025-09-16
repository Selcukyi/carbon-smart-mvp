import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function LineCard({ data }) {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Monthly Trend Analysis</h3>
          <p className="chart-subtitle">January 2025 - December 2025</p>
        </div>
        <div className="chart-actions">
          <button className="btn btn-ghost btn-sm">
            <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-sm"></div>
            </div>
            Export
          </button>
        </div>
      </div>
      
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary-500)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--primary-500)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
            <XAxis 
              dataKey="period" 
              tick={{ 
                fontSize: 12, 
                fill: 'var(--text-secondary)',
                fontFamily: 'var(--font-sans)'
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ 
                fontSize: 12, 
                fill: 'var(--text-secondary)',
                fontFamily: 'var(--font-sans)'
              }}
              axisLine={false}
              tickLine={false}
            />
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
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="var(--primary-500)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPrimary)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Chart Legend */}
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: 'var(--primary-500)' }}></div>
          <span>Monthly Emissions (tCO₂e)</span>
        </div>
      </div>
    </div>
  );
}

