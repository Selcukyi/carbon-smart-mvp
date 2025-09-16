import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NavSidebar({ role = "ADMIN", isAuthenticated = true, onLogin, onLogout }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  const navigationItems = [
    { 
      to: "/", 
      label: "Home", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 1L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-6h4v6a1 1 0 001 1h3a1 1 0 001-1V7l-7-6z"/>
        </svg>
      ),
      color: "from-slate-500 to-slate-600"
    },
    { 
      to: "/dashboard", 
      label: "Dashboard", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm3 2v8h2V6H5zm4 0v8h2V6H9zm4 0v8h2V6h-2z"/>
        </svg>
      ),
      color: "from-blue-500 to-cyan-500"
    },
    { 
      to: "/emissions", 
      label: "Emissions", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3 10a7 7 0 0114 0 7 7 0 01-14 0zm7-8a8 8 0 100 16 8 8 0 000-16zm0 3a5 5 0 100 10 5 5 0 000-10z"/>
        </svg>
      ),
      color: "from-emerald-500 to-green-500"
    },
    { 
      to: "/compliance", 
      label: "Compliance", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5zm2 2v2h2V7H6zm4 0v2h2V7h-2zm-4 4v2h2v-2H6zm4 0v2h6v-2h-6z"/>
        </svg>
      ),
      color: "from-orange-500 to-red-500"
    },
    { 
      to: "/upload", 
      label: "Upload Data", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H6.5a.5.5 0 010-1h7a3.5 3.5 0 100-7 .5.5 0 01-.5-.5 3 3 0 10-5.905.5h-.595z"/>
          <path d="M9 11.5a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5z"/>
          <path d="M9.5 8a.5.5 0 01.5.5v3a.5.5 0 01-1 0v-3a.5.5 0 01.5-.5z"/>
        </svg>
      ),
      color: "from-purple-500 to-indigo-500"
    },
    { 
      to: "/entities", 
      label: "Entities", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6zm2 1v6h8V7H6z"/>
        </svg>
      ),
      color: "from-indigo-500 to-blue-500"
    },
    { 
      to: "/allowances", 
      label: "Allowances", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M4 4a2 2 0 100 4h12a2 2 0 100-4H4zM4 10a2 2 0 100 4h12a2 2 0 100-4H4zM2 16a2 2 0 012-2h12a2 2 0 110 4H4a2 2 0 01-2-2z"/>
        </svg>
      ),
      color: "from-amber-500 to-yellow-500"
    }
  ];

  const getUserDisplayName = () => {
    switch(role) {
      case "ADMIN": return "System Administrator";
      case "GROUP_MANAGER": return "Group Manager";  
      case "ENTITY_USER": return "Entity User";
      default: return role;
    }
  };

  const getRoleIcon = () => {
    switch(role) {
      case "ADMIN": 
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM6.5 4.5v3h3v-3h-3zM4 1v3h3V1H4zm6 0v3h3V1h-3zm-6 6v3h3V7H4zm6 0v3h3V7h-3z"/>
          </svg>
        );
      case "GROUP_MANAGER":
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
          </svg>
        );
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
          </svg>
        );
    }
  };

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
    <div className={`modern-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Background Pattern */}
      <div className="sidebar-background">
        <div className="sidebar-pattern"></div>
        <div className="sidebar-gradient"></div>
      </div>

      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-section">
          <div className="brand-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#sidebarLogoGradient)"/>
              <path d="M10 22L16 10L22 22H10Z" fill="white" opacity="0.9"/>
              <circle cx="16" cy="16" r="2.5" fill="white"/>
              <defs>
                <linearGradient id="sidebarLogoGradient" x1="0" y1="0" x2="32" y2="32">
                  <stop stopColor="#0EA5E9"/>
                  <stop offset="1" stopColor="#22C55E"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          {!isCollapsed && (
            <div className="brand-info">
              <h1 className="brand-name">CarbonSmart</h1>
              <p className="brand-tagline">Enterprise</p>
            </div>
          )}
        </div>
        
        <div className="header-controls">
          <button
            className="collapse-button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d={isCollapsed ? "M5.5 1a.5.5 0 000 1h5a.5.5 0 000-1h-5zM3 4.5a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zM3.5 7a.5.5 0 000 1h9a.5.5 0 000-1h-9zM3 10.5a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zM3.5 13a.5.5 0 000 1h9a.5.5 0 000-1h-9z" : "M3.5 1a.5.5 0 000 1h9a.5.5 0 000-1h-9zM3 4.5a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zM3.5 7a.5.5 0 000 1h9a.5.5 0 000-1h-9zM3 10.5a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zM3.5 13a.5.5 0 000 1h9a.5.5 0 000-1h-9z"}/>
            </svg>
          </button>
          
          {!isCollapsed && (
            <button
              className="theme-toggle"
              onClick={() => setDark((v) => !v)}
              aria-label="Toggle theme"
            >
              {dark ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
      
      {isAuthenticated ? (
        <>
          {/* User Profile Section */}
          <div className="user-profile">
            <div className="user-avatar">
              <div className="avatar-icon">
                {getRoleIcon()}
              </div>
            </div>
            {!isCollapsed && (
              <div className="user-info">
                <div className="user-name">Admin User</div>
                <div className="user-role">{getUserDisplayName()}</div>
              </div>
            )}
          </div>
          
          {/* Quick Stats */}
          {!isCollapsed && (
            <div className="quick-stats">
              <div className="stat-item">
                <div className="stat-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2z"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <div className="stat-value">4</div>
                  <div className="stat-label">Active Sites</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <div className="stat-value">12</div>
                  <div className="stat-label">Alerts</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation Menu */}
          <nav className="sidebar-nav">
            <div className="nav-section">
              {!isCollapsed && <div className="nav-section-title">Main Menu</div>}
              <div className="nav-items">
                {navigationItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`nav-item ${pathname === item.to ? 'active' : ''}`}
                    title={isCollapsed ? item.label : ''}
                  >
                    <div className="nav-icon">
                      {item.icon}
                    </div>
                    {!isCollapsed && (
                      <span className="nav-label">{item.label}</span>
                    )}
                    {pathname === item.to && <div className="active-indicator"></div>}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
          
          {/* Bottom Actions */}
          <div className="sidebar-footer">
            {!isCollapsed && (
              <div className="footer-section">
                <div className="help-card">
                  <div className="help-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                    </svg>
                  </div>
                  <div className="help-content">
                    <div className="help-title">Need Help?</div>
                    <div className="help-subtitle">Support & Docs</div>
                  </div>
                </div>
              </div>
            )}
            
            <button 
              className={`logout-button ${isCollapsed ? 'collapsed' : ''}`}
              onClick={handleLogout}
              title={isCollapsed ? 'Logout' : ''}
            >
              <div className="logout-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"/>
                  <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
                </svg>
              </div>
              {!isCollapsed && <span className="logout-text">Sign Out</span>}
            </button>
          </div>
        </>
      ) : (
        <div className="auth-section">
          <button 
            className="login-button"
            onClick={handleLogin}
          >
            <div className="login-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"/>
                <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
              </svg>
            </div>
            {!isCollapsed && <span>Sign In</span>}
          </button>
        </div>
      )}
    </div>
  );
}