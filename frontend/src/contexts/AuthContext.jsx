import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('ADMIN');

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedAuth = localStorage.getItem('carbon_auth');
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      setIsAuthenticated(true);
      setUser(authData.user);
      setRole(authData.role);
    }
  }, []);

  const login = (userData) => {
    const authData = {
      user: userData,
      role: userData.role || 'ADMIN',
      timestamp: Date.now()
    };
    
    localStorage.setItem('carbon_auth', JSON.stringify(authData));
    setIsAuthenticated(true);
    setUser(userData);
    setRole(authData.role);
  };

  const logout = () => {
    localStorage.removeItem('carbon_auth');
    setIsAuthenticated(false);
    setUser(null);
    setRole('ADMIN');
  };

  const value = {
    isAuthenticated,
    user,
    role,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};