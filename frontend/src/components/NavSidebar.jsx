import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NavSidebar({ role = "ADMIN", isAuthenticated = true, onLogin, onLogout }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  const link = (to, label) => (
    <Link
      to={to}
      className={`nav-link ${pathname === to ? 'active' : ''}`}
    >
      {label}
    </Link>
  );

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    }
  };
  
  return (
    <div className="sidebar">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ fontWeight: '700', fontSize: '1.125rem', color: dark ? '#f9fafb' : '#000000' }}>Carbon MVP</div>
        <button
          aria-label="Toggle theme"
          className="theme-toggle"
          onClick={() => setDark((v) => !v)}
        >
          {dark ? "Dark" : "Light"}
        </button>
      </div>
      
      {isAuthenticated ? (
        <>
          <div style={{ marginBottom: '1rem', fontSize: '0.75rem', color: dark ? '#9ca3af' : '#374151', fontWeight: '600' }}>Role: {role}</div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {link("/", "Home")}
            {link("/dashboard", "Dashboard")}
            {link("/emissions", "Emissions")}
            {link("/compliance", "Compliance")}
            {link("/intensity", "Intensity")}
            {link("/upload", "Upload")}
            {link("/entities", "Entities")}
            {link("/allowances", "Allowances")}
          </nav>
          <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
            <button 
              className="nav-link logout-btn"
              onClick={handleLogout}
              style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              Logout
            </button>
          </div>
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            className="nav-link login-btn"
            onClick={handleLogin}
            style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
}

