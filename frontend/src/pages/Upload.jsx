import NavSidebar from "../components/NavSidebar.jsx";
import UploadForm from "../components/UploadForm.jsx";
import { mockEmissionFactors } from "../lib/mock.js";
import { useAuth } from "../contexts/AuthContext";

export default function Upload() {
  const { role, logout } = useAuth();
  
  return (
    <div className="flex min-h-screen">
      <NavSidebar role={role} isAuthenticated={true} onLogout={logout} />
      <main className="main-content">
        <div className="header">
          <h1>Upload Activity Data</h1>
          <div className="header-actions">
            <button className="btn btn-primary">Download Template</button>
            <button className="btn">View Examples</button>
          </div>
        </div>

        {/* Upload Section */}
        <div className="upload-section">
          <UploadForm />
        </div>

        {/* Data Examples */}
        <div className="data-examples">
          <h2>Data Format Examples</h2>
          <div className="examples-grid">
            <div className="example-card">
              <h3>Electricity Consumption</h3>
              <div className="example-table">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Facility</th>
                      <th>Activity</th>
                      <th>Amount</th>
                      <th>Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2024-01-15</td>
                      <td>Izmir Plant</td>
                      <td>Electricity</td>
                      <td>1250</td>
                      <td>kWh</td>
                    </tr>
                    <tr>
                      <td>2024-01-16</td>
                      <td>Izmir Plant</td>
                      <td>Electricity</td>
                      <td>1180</td>
                      <td>kWh</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="example-card">
              <h3>Natural Gas Usage</h3>
              <div className="example-table">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Facility</th>
                      <th>Activity</th>
                      <th>Amount</th>
                      <th>Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2024-01-15</td>
                      <td>Izmir Plant</td>
                      <td>Natural Gas</td>
                      <td>450</td>
                      <td>m³</td>
                    </tr>
                    <tr>
                      <td>2024-01-16</td>
                      <td>Izmir Plant</td>
                      <td>Natural Gas</td>
                      <td>420</td>
                      <td>m³</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="example-card">
              <h3>Fleet Operations</h3>
              <div className="example-table">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Facility</th>
                      <th>Activity</th>
                      <th>Amount</th>
                      <th>Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2024-01-15</td>
                      <td>Ankara Hub</td>
                      <td>Diesel</td>
                      <td>85</td>
                      <td>liters</td>
                    </tr>
                    <tr>
                      <td>2024-01-16</td>
                      <td>Ankara Hub</td>
                      <td>Diesel</td>
                      <td>92</td>
                      <td>liters</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Emission Factors Reference */}
        <div className="emission-factors">
          <h2>Emission Factors Reference</h2>
          <div className="factors-table">
            <table className="table">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Emission Factor</th>
                  <th>Unit</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {mockEmissionFactors.map((factor, index) => (
                  <tr key={index}>
                    <td>{factor.activity}</td>
                    <td>{factor.factor}</td>
                    <td>{factor.unit}</td>
                    <td>{factor.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* LLM Data Validation */}
        <div className="llm-validation">
          <div className="insight-card">
            <div className="insight-header">
              <h3>AI Data Validation</h3>
              <div className="ai-badge">🤖 LLM Analysis</div>
            </div>
            <div className="insight-content">
              <p>Our AI system automatically validates your uploaded data and provides insights:</p>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
                <li>✅ <strong>Data Quality Check:</strong> Identifies missing values, outliers, and inconsistencies</li>
                <li>✅ <strong>Emission Factor Matching:</strong> Automatically maps activities to correct emission factors</li>
                <li>✅ <strong>Scope Classification:</strong> Categorizes emissions into Scope 1, 2, and 3</li>
                <li>✅ <strong>Trend Analysis:</strong> Detects patterns and anomalies in your data</li>
                <li>✅ <strong>Compliance Check:</strong> Ensures data meets EU ETS and GHG Protocol requirements</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

