import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'ADMIN'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - in real app, this would be an API call
      if (formData.email && formData.password) {
        const userData = {
          email: formData.email,
          name: formData.email.split('@')[0],
          role: formData.role
        };
        
        login(userData);
        navigate('/dashboard');
      } else {
        setError('Please fill in all fields');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="corporate-signin">
      {/* Left Panel - Brand & Visual */}
      <div className="signin-left-panel">
        {/* Background Patterns */}
        <div className="background-patterns">
          <div className="pattern-circle pattern-1"></div>
          <div className="pattern-circle pattern-2"></div>
          <div className="pattern-circle pattern-3"></div>
          <div className="pattern-grid"></div>
        </div>
        
        {/* Content */}
        <div className="left-panel-content">
          {/* Company Branding */}
          <div className="company-branding">
            <div className="company-logo">
              <div className="logo-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect width="40" height="40" rx="12" fill="url(#logoGradient)"/>
                  <path d="M12 28L20 12L28 28H12Z" fill="white" opacity="0.9"/>
                  <circle cx="20" cy="20" r="3" fill="white"/>
                  <defs>
                    <linearGradient id="logoGradient" x1="0" y1="0" x2="40" y2="40">
                      <stop stopColor="#0EA5E9"/>
                      <stop offset="1" stopColor="#22C55E"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="company-info">
                <h1 className="company-name">CarbonSmart</h1>
                <p className="company-tagline">Enterprise Carbon Management</p>
              </div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="hero-content">
            <h2 className="hero-title">
              Transform Your 
              <span className="gradient-text"> Carbon Footprint</span>
            </h2>
            <p className="hero-description">
              Advanced analytics and insights to drive sustainable business practices 
              across your entire organization.
            </p>
            
            {/* Features List */}
            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                  </svg>
                </div>
                <span>Real-time emissions tracking</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                  </svg>
                </div>
                <span>Comprehensive compliance reporting</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                  </svg>
                </div>
                <span>AI-powered sustainability insights</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-section">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Companies</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50M+</div>
              <div className="stat-label">Tons CO₂ Tracked</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">15%</div>
              <div className="stat-label">Avg. Reduction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Sign In Form */}
      <div className="signin-right-panel">
        <div className="signin-form-container">
          {/* Form Header */}
          <div className="form-header">
            <h3 className="form-title">Welcome Back</h3>
            <p className="form-subtitle">Sign in to access your carbon management dashboard</p>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="signin-form">
            <div className="form-field">
              <label htmlFor="email" className="field-label">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="field-icon">
                  <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
                </svg>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className="field-input"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="password" className="field-label">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="field-icon">
                  <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2Zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"/>
                </svg>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="field-input"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="role" className="field-label">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="field-icon">
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                  <path d="M0 8a8 8 0 1 1 16 0v5.5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5V12a1 1 0 0 0-1-1v4a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 3 15V8a8 8 0 0 1 16 0Z"/>
                </svg>
                Access Level
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="field-select"
              >
                <option value="ADMIN">System Administrator</option>
                <option value="GROUP_MANAGER">Group Manager</option>
                <option value="ENTITY_USER">Entity User</option>
              </select>
            </div>

            {/* Additional Options */}
            <div className="form-options">
              <label className="checkbox-wrapper">
                <input type="checkbox" className="checkbox-input" />
                <span className="checkbox-mark"></span>
                <span className="checkbox-label">Remember me for 30 days</span>
              </label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-alert">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="error-icon">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                </svg>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" className="signin-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="button-icon">
                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Card */}
          <div className="demo-credentials">
            <div className="demo-header">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="demo-icon">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM6.79 5.093A6.5 6.5 0 0 0 8 5c.067 0 .134.003.201.009a6.5 6.5 0 0 0 1.19-.084l-.595-.595a1.5 1.5 0 0 0-2.122 0L6.79 5.093zM9.5 8.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
              </svg>
              <h4>Demo Access</h4>
            </div>
            <div className="demo-content">
              <p><strong>Email:</strong> admin@carbonmvp.com</p>
              <p><strong>Password:</strong> password</p>
            </div>
          </div>

          {/* Footer */}
          <div className="form-footer">
            <p>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="security-icon">
                <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"/>
              </svg>
              Secured with enterprise-grade encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}