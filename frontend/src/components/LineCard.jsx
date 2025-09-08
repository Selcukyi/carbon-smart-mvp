import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function LineCard({ data }) {
  return (
    <div className="chart-card">
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>Monthly Trend Analysis</h3>
        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>January 2025 - December 2025</div>
      </div>
      <div style={{ width: '100%', height: '16rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} tCO₂e`, '']} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#16a34a" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorGreen)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

