import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './AdminNavigation.module.css';

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
    <aside className={styles['admin-sidebar']}>
      <div className={styles['sidebar-header']}>
        <Link to="/admin" className={styles['sidebar-brand']}>
          <span className={styles['brand-icon']}>🎛️</span>
          <span className={styles['brand-text']}>Admin Laboria</span>
        </Link>
      </div>

      <nav className={styles['sidebar-nav']}>
        <ul className={styles['nav-list']}>
          {navItems.map((item) => (
            <li key={item.path} className={styles['nav-item']}>
              <Link
                to={item.path}
                className={styles['nav-link'] + (isActive(item.path) ? ' ' + styles['active'] : '')}
              >
                <span className={styles['nav-icon']}>{item.icon}</span>
                <span className={styles['nav-label']}>{item.label}</span>
                {isActive(item.path) && <span className={styles['active-indicator']}>▶</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles['sidebar-footer']}>
        <Link to="/" className={styles['nav-link'] + ' ' + styles['home-link']}>
          <span className={styles['nav-icon']}>🏠</span>
          <span className={styles['nav-label']}>Ir al sitio</span>
        </Link>
        {onLogout && (
          <button onClick={onLogout} className={styles['btn-logout-sidebar']}>
            <span className={styles['nav-icon']}>🔒</span>
            <span className={styles['nav-label']}>Cerrar sesión</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default AdminNavigation;
