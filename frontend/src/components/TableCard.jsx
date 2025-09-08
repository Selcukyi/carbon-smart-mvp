export default function TableCard({ rows }) {
  return (
    <div className="table-card">
      <div style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>Top Activities by CO₂e</div>
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
                <td>{r.activity}</td>
                <td>{r.entity}</td>
                <td>{r.facility}</td>
                <td>{r.scope}</td>
                <td>{r.co2e}</td>
                <td>{r.period}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

