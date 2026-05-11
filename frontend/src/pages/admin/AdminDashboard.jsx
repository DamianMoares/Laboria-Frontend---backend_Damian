import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import AdminNavigation from './AdminNavigation';
import './AdminDashboard.css';

const AdminDashboard = ({ onAdminLogout }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDashboardStats();
      setStats(response.stats);
      setError(null);
    } catch (err) {
      setError('Error al cargar estadísticas: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    return num?.toLocaleString() || '0';
  };

  const getRoleLabel = (role) => {
    const labels = {
      'CANDIDATE': '👤 Candidatos',
      'COMPANY_EMPLOYEES': '🏢 Empresas (Empleados)',
      'COMPANY_STUDENTS': '🎓 Empresas (Estudiantes)',
      'COMPANY_HYBRID': '🔄 Empresas (Híbridas)',
      'ADMIN': '🔒 Administradores'
    };
    return labels[role] || role;
  };

  const getStatusLabel = (status) => {
    const labels = {
      'PENDING': '⏳ Pendientes',
      'ACCEPTED': '✅ Aceptadas',
      'REJECTED': '❌ Rechazadas'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-loading">
          <div className="spinner"></div>
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="admin-error">
          <p>{error}</p>
          <button onClick={loadDashboardStats} className="btn-retry">
            🔄 Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminNavigation onLogout={onAdminLogout} />
      <div className="admin-content">
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="header-content">
          <div>
            <h1>🎛️ Panel de Administración</h1>
            <p className="subtitle">Gestión completa del sistema Laboria</p>
          </div>
          {onAdminLogout && (
            <button className="btn-logout" onClick={onAdminLogout}>
              🔒 Cerrar Sesión
            </button>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/admin/users" className="action-card">
          <span className="action-icon">👥</span>
          <span className="action-text">Usuarios</span>
        </Link>
        <Link to="/admin/jobs" className="action-card">
          <span className="action-icon">💼</span>
          <span className="action-text">Empleos</span>
        </Link>
        <Link to="/admin/courses" className="action-card">
          <span className="action-icon">📚</span>
          <span className="action-text">Cursos</span>
        </Link>
        <Link to="/admin/applications" className="action-card">
          <span className="action-icon">📝</span>
          <span className="action-text">Aplicaciones</span>
        </Link>
        <Link to="/admin/api-status" className="action-card">
          <span className="action-icon">🔌</span>
          <span className="action-text">Estado APIs</span>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card primary">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-value">{formatNumber(stats?.totals?.users)}</span>
            <span className="stat-label">Usuarios Totales</span>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">💼</div>
          <div className="stat-info">
            <span className="stat-value">{formatNumber(stats?.totals?.jobs)}</span>
            <span className="stat-label">Empleos Publicados</span>
          </div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <span className="stat-value">{formatNumber(stats?.totals?.courses)}</span>
            <span className="stat-label">Cursos Disponibles</span>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <span className="stat-value">{formatNumber(stats?.totals?.applications)}</span>
            <span className="stat-label">Aplicaciones Totales</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {stats?.recentActivity && (
        <div className="recent-activity">
          <h2>📈 Actividad Reciente (Últimos 30 días)</h2>
          <div className="activity-grid">
            <div className="activity-item">
              <span className="activity-count">+{formatNumber(stats.recentActivity.newUsers)}</span>
              <span className="activity-label">Nuevos usuarios</span>
            </div>
            <div className="activity-item">
              <span className="activity-count">+{formatNumber(stats.recentActivity.newJobs)}</span>
              <span className="activity-label">Nuevos empleos</span>
            </div>
            <div className="activity-item">
              <span className="activity-count">+{formatNumber(stats.recentActivity.newApplications)}</span>
              <span className="activity-label">Nuevas aplicaciones</span>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="charts-section">
        {/* Users by Role */}
        {stats?.usersByRole && stats.usersByRole.length > 0 && (
          <div className="chart-card">
            <h3>👥 Usuarios por Rol</h3>
            <div className="chart-list">
              {stats.usersByRole.map((item, index) => (
                <div key={index} className="chart-item">
                  <div className="item-label">{getRoleLabel(item.role)}</div>
                  <div className="item-bar-container">
                    <div 
                      className="item-bar"
                      style={{ 
                        width: `${(item.count / Math.max(...stats.usersByRole.map(u => u.count))) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <div className="item-value">{formatNumber(item.count)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Applications by Status */}
        {stats?.applicationsByStatus && stats.applicationsByStatus.length > 0 && (
          <div className="chart-card">
            <h3>📝 Aplicaciones por Estado</h3>
            <div className="chart-list">
              {stats.applicationsByStatus.map((item, index) => (
                <div key={index} className="chart-item">
                  <div className="item-label">{getStatusLabel(item.status)}</div>
                  <div className="item-bar-container">
                    <div 
                      className={`item-bar status-${item.status.toLowerCase()}`}
                      style={{ 
                        width: `${(item.count / Math.max(...stats.applicationsByStatus.map(a => a.count))) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <div className="item-value">{formatNumber(item.count)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Jobs by Category */}
        {stats?.jobsByCategory && stats.jobsByCategory.length > 0 && (
          <div className="chart-card">
            <h3>💼 Empleos por Categoría</h3>
            <div className="chart-list compact">
              {stats.jobsByCategory.map((item, index) => (
                <div key={index} className="chart-item compact">
                  <span className="compact-label">{item.category}</span>
                  <span className="compact-value">{formatNumber(item.count)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Courses by Level */}
        {stats?.coursesByLevel && stats.coursesByLevel.length > 0 && (
          <div className="chart-card">
            <h3>📚 Cursos por Nivel</h3>
            <div className="chart-list compact">
              {stats.coursesByLevel.map((item, index) => (
                <div key={index} className="chart-item compact">
                  <span className="compact-label">{item.level}</span>
                  <span className="compact-value">{formatNumber(item.count)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="admin-footer">
        <p>🛡️ Panel de Administración Laboria • {new Date().getFullYear()}</p>
        <button onClick={loadDashboardStats} className="btn-refresh">
          🔄 Actualizar datos
        </button>
      </div>
    </div>
    </div>
    </div>
  );
};

export default AdminDashboard;
