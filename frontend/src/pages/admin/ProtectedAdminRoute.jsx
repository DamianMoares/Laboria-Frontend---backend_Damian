import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';

const ProtectedAdminRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const adminAuth = localStorage.getItem('admin_auth');
    
    if (adminAuth) {
      try {
        const auth = JSON.parse(adminAuth);
        const now = new Date().getTime();
        
        // Verificar si la sesión no ha expirado
        if (auth.authenticated && auth.expiresAt && now < auth.expiresAt) {
          setIsAuthenticated(true);
        } else {
          // Sesión expirada, limpiar
          localStorage.removeItem('admin_auth');
          setIsAuthenticated(false);
        }
      } catch (error) {
        localStorage.removeItem('admin_auth');
        setIsAuthenticated(false);
      }
    }
    
    setIsLoading(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Verificando acceso...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // Pasar función de logout al componente hijo
  return React.cloneElement(children, { onAdminLogout: handleLogout });
};

export default ProtectedAdminRoute;
