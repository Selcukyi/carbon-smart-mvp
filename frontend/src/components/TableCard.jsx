export default function TableCard({ rows }) {
  const getScopeBadge = (scope) => {
    const scopeMap = {
      'Scope 1': 'badge-error',
      'Scope 2': 'badge-warning', 
      'Scope 3': 'badge-info'
    };
    return scopeMap[scope] || 'badge-secondary';
  };

  return (
    <div className="table-card">
      <div className="table-header">
        <div>
          <h3 className="table-title">Top Activities by CO₂e</h3>
          <p className="table-subtitle">Highest emission activities across all facilities</p>
        </div>
        <div className="table-actions">
          <button className="btn btn-ghost btn-sm">
            <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-sm"></div>
            </div>
            Export
          </button>
          <button className="btn btn-ghost btn-sm">
            <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-sm"></div>
            </div>
            Filter
          </button>
        </div>
      </div>
      
      <div style={{ overflow: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Activity</th>
              <th>Entity</th>
              <th>Facility</th>
              <th>Scope</th>
              <th>CO₂e (t)</th>
              <th>Period</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="table-cell-primary">{r.activity}</td>
                <td className="table-cell-secondary">{r.entity}</td>
                <td className="table-cell-secondary">{r.facility}</td>
                <td>
                  <span className={`table-badge ${getScopeBadge(r.scope)}`}>
                    {r.scope}
                  </span>
                </td>
                <td className="table-cell-primary font-semibold">{r.co2e}</td>
                <td className="table-cell-secondary">{r.period}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

