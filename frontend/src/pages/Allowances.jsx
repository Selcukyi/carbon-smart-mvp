import NavSidebar from "../components/NavSidebar.jsx";
import { mockAllowances, mockBudgetScenarios } from "../lib/mock.js";
import { useAuth } from "../contexts/AuthContext";

export default function Allowances() {
  const { role, logout } = useAuth();
  
  return (
    <div className="flex min-h-screen">
      <NavSidebar role={role} isAuthenticated={true} onLogout={logout} />
      <main className="main-content">
        <div className="header">
          <h1>EU ETS Allowances</h1>
          <div className="header-actions">
            <button className="btn btn-primary">Transfer Allowances</button>
            <button className="btn">Purchase Credits</button>
          </div>
        </div>

        {/* Current Price */}
        <div className="price-card">
          <div className="price-info">
            <h3>Current EU ETS Price</h3>
            <div className="price-value">€85.50</div>
            <div className="price-change">+2.3% from last week</div>
          </div>
          <div className="price-chart">
            <div className="mini-chart">📈</div>
          </div>
        </div>

        {/* Allowances Overview */}
        <div className="allowances-overview">
          <div className="overview-card">
            <h3>Allowance Status</h3>
            <div className="overview-stats">
              <div className="overview-stat">
                <div className="stat-number">2,600</div>
                <div className="stat-label">Total Allocated (tCO₂e)</div>
              </div>
              <div className="overview-stat">
                <div className="stat-number">2,847</div>
                <div className="stat-label">Total Used (tCO₂e)</div>
              </div>
              <div className="overview-stat">
                <div className="stat-number">-247</div>
                <div className="stat-label">Deficit (tCO₂e)</div>
              </div>
              <div className="overview-stat">
                <div className="stat-number">€21,118</div>
                <div className="stat-label">Additional Cost</div>
              </div>
            </div>
          </div>
        </div>

        {/* Facility Allowances */}
        <div className="allowances-table">
          <h2>Facility Allowances</h2>
          <div className="table-card">
            <table className="table">
              <thead>
                <tr>
                  <th>Entity</th>
                  <th>Facility</th>
                  <th>Allocated</th>
                  <th>Used</th>
                  <th>Remaining</th>
                  <th>Price</th>
                  <th>Value</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockAllowances.map((allowance, index) => (
                  <tr key={index}>
                    <td>{allowance.entity}</td>
                    <td>{allowance.facility}</td>
                    <td>{allowance.allocated.toLocaleString()}</td>
                    <td>{allowance.used.toLocaleString()}</td>
                    <td className={allowance.remaining < 0 ? 'deficit' : 'surplus'}>
                      {allowance.remaining.toLocaleString()}
                    </td>
                    <td>€{allowance.price}</td>
                    <td>€{allowance.value.toLocaleString()}</td>
                    <td>
                      <button className="btn btn-sm">Transfer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Budget Scenarios */}
        <div className="budget-scenarios">
          <h2>Carbon Budget Scenarios</h2>
          <div className="scenarios-grid">
            {mockBudgetScenarios.map((scenario, index) => (
              <div key={index} className="scenario-card">
                <div className="scenario-header">
                  <h4>{scenario.scenario}</h4>
                  <div className="scenario-year">{scenario.year}</div>
                </div>
                <div className="scenario-metrics">
                  <div className="metric">
                    <span className="metric-label">Emissions:</span>
                    <span className="metric-value">{scenario.emissions.toLocaleString()} tCO₂e</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Cost:</span>
                    <span className="metric-value">€{scenario.cost.toLocaleString()}</span>
                  </div>
                </div>
                <div className="scenario-description">
                  {scenario.description}
                </div>
                <button className="btn btn-sm">View Details</button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

