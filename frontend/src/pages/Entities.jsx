import NavSidebar from "../components/NavSidebar.jsx";
import { mockEntities } from "../mockData.js";
import { useAuth } from "../contexts/AuthContext";

export default function Entities() {
  const { role, logout } = useAuth();
  const entities = mockEntities;

  const EntityCard = ({ entity, level = 0 }) => (
    <div className="entity-card" style={{ marginLeft: `${level * 1.5}rem` }}>
      <div className="entity-header">
        <div className="entity-info">
          <div className="entity-type-badge" data-type={entity.type.toLowerCase()}>
            {entity.type}
          </div>
          <h3 className="entity-name">{entity.name}</h3>
        </div>
        <div className="entity-actions">
          <button className="btn btn-sm">Edit</button>
          <button className="btn btn-sm">View Details</button>
        </div>
      </div>
      <div className="entity-stats">
        <div className="stat">
          <span className="stat-label">Facilities:</span>
          <span className="stat-value">{entity.children?.length || 0}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Total CO₂e:</span>
          <span className="stat-value">{entity.totalEmissions?.toLocaleString()} tCO₂e</span>
        </div>
        <div className="stat">
          <span className="stat-label">Budget:</span>
          <span className="stat-value">€{entity.budget?.toLocaleString()}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Target:</span>
          <span className="stat-value">{entity.target?.toLocaleString()} tCO₂e</span>
        </div>
      </div>
      {entity.children && entity.children.length > 0 && (
        <div className="entity-children">
          {entity.children.map(child => (
            <EntityCard key={child.id} entity={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <NavSidebar role={role} isAuthenticated={true} onLogout={logout} />
      <main className="main-content">
        <div className="header">
          <h1>Organizational Entities</h1>
          <div className="header-actions">
            <button className="btn btn-primary">Add Entity</button>
            <button className="btn">Import</button>
          </div>
        </div>

        <div className="entities-overview">
          <div className="overview-card">
            <h3>Overview</h3>
            <div className="overview-stats">
              <div className="overview-stat">
                <div className="stat-number">1</div>
                <div className="stat-label">Groups</div>
              </div>
              <div className="overview-stat">
                <div className="stat-number">2</div>
                <div className="stat-label">Entities</div>
              </div>
              <div className="overview-stat">
                <div className="stat-number">2</div>
                <div className="stat-label">Facilities</div>
              </div>
              <div className="overview-stat">
                <div className="stat-number">2,847</div>
                <div className="stat-label">Total CO₂e (t)</div>
              </div>
            </div>
          </div>
        </div>

        <div className="entities-hierarchy">
          <h2>Organizational Hierarchy</h2>
          <div className="hierarchy-container">
            {entities.map(entity => (
              <EntityCard key={entity.id} entity={entity} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

