import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminNavigation.css';

const AdminNavigation = ({ onLogout }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/admin', icon: '📊', label: 'Dashboard' },
    { path: '/admin/users', icon: '👥', label: 'Usuarios' },
    { path: '/admin/jobs', icon: '💼', label: 'Empleos' },
    { path: '/admin/courses', icon: '📚', label: 'Cursos' },
    { path: '/admin/applications', icon: '📝', label: 'Aplicaciones' },
    { path: '/admin/api-status', icon: '🔌', label: 'Estado APIs' }
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return currentPath === '/admin';
    }
    return currentPath.startsWith(path);
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <Link to="/admin" className="sidebar-brand">
          <span className="brand-icon">🎛️</span>
          <span className="brand-text">Admin Laboria</span>
        </Link>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {isActive(item.path) && <span className="active-indicator">▶</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <Link to="/" className="nav-link home-link">
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Ir al sitio</span>
        </Link>
        {onLogout && (
          <button onClick={onLogout} className="btn-logout-sidebar">
            <span className="nav-icon">🔒</span>
            <span className="nav-label">Cerrar sesión</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default AdminNavigation;
