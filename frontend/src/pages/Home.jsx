import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const [currentFeature, setCurrentFeature] = useState(0);
  const features = [
    { icon: "📊", title: "Real-time Analytics", desc: "Monitor carbon emissions with live dashboards" },
    { icon: "🤖", title: "AI-Powered Insights", desc: "Get intelligent recommendations and risk analysis" },
    { icon: "⚖️", title: "EU ETS Compliance", desc: "Stay compliant with automated allowance tracking" },
    { icon: "🌱", title: "Sustainability Goals", desc: "Track progress towards net-zero targets" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <span className="brand-icon">🌍</span>
            <span className="brand-text">CarbonSmart</span>
          </div>
          <div className="nav-links">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/upload" className="nav-link">Upload</Link>
                <Link to="/entities" className="nav-link">Entities</Link>
                <Link to="/allowances" className="nav-link">Allowances</Link>
                <span className="nav-user">Welcome, {user?.name || 'User'}</span>
              </>
            ) : (
              <Link to="/login" className="nav-link nav-login">Login</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-particles"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🚀</span>
            <span>Next-Gen Carbon Management</span>
          </div>
          <h1 className="hero-title">
            Transform Your
            <span className="gradient-text"> Carbon Footprint</span>
            <br />Into Competitive Advantage
          </h1>
          <p className="hero-description">
            The most advanced AI-powered carbon emission management platform. 
            Monitor, analyze, and optimize your environmental impact with real-time insights, 
            EU ETS compliance, and intelligent recommendations.
          </p>
          <div className="hero-actions">
            <Link to="/dashboard" className="btn-primary">
              <span>Explore Dashboard</span>
              <span className="btn-icon">→</span>
            </Link>
            <button className="btn-secondary">
              <span>Watch Demo</span>
              <span className="btn-icon">▶</span>
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">2,847</div>
              <div className="stat-label">tCO₂e Tracked</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">€4,015</div>
              <div className="stat-label">Cost Savings</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">51.1%</div>
              <div className="stat-label">Efficiency Gain</div>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-container">
            <div className="floating-card main-card">
              <div className="card-header">
                <span className="card-icon">📊</span>
                <span>Live Dashboard</span>
              </div>
              <div className="card-content">
                <div className="metric">
                  <span className="metric-label">Total Emissions</span>
                  <span className="metric-value">2,847 tCO₂e</span>
                </div>
                <div className="metric">
                  <span className="metric-label">EU ETS Status</span>
                  <span className="metric-value warning">47 tCO₂e Over</span>
                </div>
                <div className="metric">
                  <span className="metric-label">AI Recommendations</span>
                  <span className="metric-value">3 Active</span>
                </div>
              </div>
            </div>
            
            <div className="floating-card secondary-card">
              <div className="card-header">
                <span className="card-icon">🤖</span>
                <span>AI Insights</span>
              </div>
              <div className="card-content">
                <div className="insight-item">
                  <span className="insight-icon">⚡</span>
                  <span className="insight-text">Energy efficiency opportunities detected</span>
                </div>
                <div className="insight-item">
                  <span className="insight-icon">🌱</span>
                  <span className="insight-text">Renewable energy transition recommended</span>
                </div>
                <div className="insight-item">
                  <span className="insight-icon">📈</span>
                  <span className="insight-text">Cost savings potential: €28,000</span>
                </div>
              </div>
            </div>

            <div className="floating-card tertiary-card">
              <div className="card-header">
                <span className="card-icon">⚖️</span>
                <span>Compliance Status</span>
              </div>
              <div className="card-content">
                <div className="compliance-item">
                  <span className="compliance-label">EU ETS</span>
                  <span className="compliance-status warning">⚠️ Over Limit</span>
                </div>
                <div className="compliance-item">
                  <span className="compliance-label">ISO 14064</span>
                  <span className="compliance-status good">✅ Compliant</span>
                </div>
                <div className="compliance-item">
                  <span className="compliance-label">GHG Protocol</span>
                  <span className="compliance-status good">✅ Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Powerful Features</h2>
            <p className="section-description">
              Everything you need to manage carbon emissions effectively
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`feature-card ${index === currentFeature ? 'active' : ''}`}
                onMouseEnter={() => setCurrentFeature(index)}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.desc}</p>
                <div className="feature-arrow">→</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="demo-section">
        <div className="section-container">
          <div className="demo-content">
            <div className="demo-text">
              <h2 className="demo-title">See It In Action</h2>
              <p className="demo-description">
                Experience the power of AI-driven carbon management. 
                Our platform provides real-time insights, automated compliance, 
                and actionable recommendations to optimize your environmental impact.
              </p>
              <div className="demo-features">
                <div className="demo-feature">
                  <span className="demo-feature-icon">✅</span>
                  <span>Real-time emission tracking</span>
                </div>
                <div className="demo-feature">
                  <span className="demo-feature-icon">✅</span>
                  <span>EU ETS compliance automation</span>
                </div>
                <div className="demo-feature">
                  <span className="demo-feature-icon">✅</span>
                  <span>AI-powered risk analysis</span>
                </div>
                <div className="demo-feature">
                  <span className="demo-feature-icon">✅</span>
                  <span>Intelligent recommendations</span>
                </div>
              </div>
              <Link to="/dashboard" className="btn-primary">
                <span>Try Live Demo</span>
                <span className="btn-icon">→</span>
              </Link>
            </div>
            <div className="demo-visual">
              <div className="demo-card">
                <div className="demo-card-header">
                  <div className="demo-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="demo-card-title">CarbonSmart Dashboard</span>
                </div>
                <div className="demo-card-content">
                  <div className="demo-chart">
                    <div className="chart-bar" style={{height: '60%'}}></div>
                    <div className="chart-bar" style={{height: '80%'}}></div>
                    <div className="chart-bar" style={{height: '45%'}}></div>
                    <div className="chart-bar" style={{height: '90%'}}></div>
                  </div>
                  <div className="demo-metrics">
                    <div className="demo-metric">
                      <span className="demo-metric-label">Scope 1</span>
                      <span className="demo-metric-value">891 tCO₂e</span>
                    </div>
                    <div className="demo-metric">
                      <span className="demo-metric-label">Scope 2</span>
                      <span className="demo-metric-value">1,456 tCO₂e</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform Your Carbon Management?</h2>
            <p className="cta-description">
              Join leading companies using CarbonSmart to achieve their sustainability goals
            </p>
            <div className="cta-actions">
              <Link to="/dashboard" className="btn-primary large">
                <span>Get Started Now</span>
                <span className="btn-icon">→</span>
              </Link>
              <Link to="/upload" className="btn-secondary large">
                <span>Upload Your Data</span>
                <span className="btn-icon">📁</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="section-container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="brand-icon">🌍</span>
              <span className="brand-text">CarbonSmart</span>
            </div>
            <div className="footer-links">
              <Link to="/dashboard" className="footer-link">Dashboard</Link>
              <Link to="/upload" className="footer-link">Upload</Link>
              <Link to="/entities" className="footer-link">Entities</Link>
              <Link to="/allowances" className="footer-link">Allowances</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 CarbonSmart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

