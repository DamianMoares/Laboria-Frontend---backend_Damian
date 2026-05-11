import React, { useState } from 'react';
import './AdminLogin.css';

const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY || 'laboria2024';

const AdminLogin = ({ onLogin }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (key === ADMIN_KEY) {
      // Guardar sesión de admin por 1 hora
      const expiresAt = new Date().getTime() + (60 * 60 * 1000); // 1 hora
      localStorage.setItem('admin_auth', JSON.stringify({ 
        authenticated: true, 
        expiresAt 
      }));
      onLogin();
    } else {
      setAttempts(prev => prev + 1);
      setError(`Clave incorrecta. Intento ${attempts + 1}/3`);
      
      if (attempts >= 2) {
        setError('Demasiados intentos. Acceso bloqueado temporalmente.');
        // Bloquear por 5 minutos
        const blockedUntil = new Date().getTime() + (5 * 60 * 1000);
        localStorage.setItem('admin_blocked', blockedUntil);
      }
    }
  };

  // Verificar si está bloqueado
  const blockedUntil = localStorage.getItem('admin_blocked');
  if (blockedUntil && new Date().getTime() < parseInt(blockedUntil)) {
    const remaining = Math.ceil((parseInt(blockedUntil) - new Date().getTime()) / 60000);
    return (
      <div className="admin-login-container">
        <div className="admin-login-box blocked">
          <h2>🔒 Acceso Bloqueado</h2>
          <p>Demasiados intentos fallidos.</p>
          <p className="blocked-timer">Intenta nuevamente en {remaining} minutos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <div className="login-header">
          <span className="lock-icon">🔐</span>
          <h2>Zona de Administración</h2>
          <p className="login-subtitle">Acceso restringido - Se requiere clave maestra</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="admin-key">Clave Maestra</label>
            <input
              type="password"
              id="admin-key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Ingresa la clave maestra"
              autoFocus
              disabled={attempts >= 3}
            />
          </div>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn-login"
            disabled={!key || attempts >= 3}
          >
            Acceder al Panel
          </button>
        </form>

        <div className="login-footer">
          <p>⚡ Solo personal autorizado</p>
          <p className="hint">💡 La clave está configurada en las variables de entorno</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
