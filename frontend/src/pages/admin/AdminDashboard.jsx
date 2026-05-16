import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import AdminNavigation from './AdminNavigation';
import styles from './AdminDashboard.module.css';

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
      <div className={styles['admin-dashboard']}>
        <div className={styles['admin-loading']}>
          <div className={styles['spinner']}></div>
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles['admin-dashboard']}>
        <div className={styles['admin-error']}>
          <p>{error}</p>
          <button onClick={loadDashboardStats} className={styles['btn-retry']}>
            🔄 Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['admin-layout']}>
      <AdminNavigation onLogout={onAdminLogout} />
      <div className={styles['admin-content']}>
    <div className={styles['admin-dashboard']}>
      {/* Header */}
      <div className={styles['admin-header']}>
        <div className={styles['header-content']}>
          <div>
            <h1>🎛️ Panel de Administración</h1>
            <p className={styles['subtitle']}>Gestión completa del sistema Laboria</p>
          </div>
          {onAdminLogout && (
            <button className={styles['btn-logout']} onClick={onAdminLogout}>
              🔒 Cerrar Sesión
            </button>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles['quick-actions']}>
        <Link to="/admin/users" className={styles['action-card']}>
          <span className={styles['action-icon']}>👥</span>
          <span className={styles['action-text']}>Usuarios</span>
        </Link>
        <Link to="/admin/jobs" className={styles['action-card']}>
          <span className={styles['action-icon']}>💼</span>
          <span className={styles['action-text']}>Empleos</span>
        </Link>
        <Link to="/admin/courses" className={styles['action-card']}>
          <span className={styles['action-icon']}>📚</span>
          <span className={styles['action-text']}>Cursos</span>
        </Link>
        <Link to="/admin/applications" className={styles['action-card']}>
          <span className={styles['action-icon']}>📝</span>
          <span className={styles['action-text']}>Aplicaciones</span>
        </Link>
        <Link to="/admin/api-status" className={styles['action-card']}>
          <span className={styles['action-icon']}>🔌</span>
          <span className={styles['action-text']}>Estado APIs</span>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className={styles['stats-overview']}>
        <div className={styles['stat-card'] + ' ' + styles['primary']}>
          <div className={styles['stat-icon']}>👥</div>
          <div className={styles['stat-info']}>
            <span className={styles['stat-value']}>{formatNumber(stats?.totals?.users)}</span>
            <span className={styles['stat-label']}>Usuarios Totales</span>
          </div>
        </div>
        <div className={styles['stat-card'] + ' ' + styles['success']}>
          <div className={styles['stat-icon']}>💼</div>
          <div className={styles['stat-info']}>
            <span className={styles['stat-value']}>{formatNumber(stats?.totals?.jobs)}</span>
            <span className={styles['stat-label']}>Empleos Publicados</span>
          </div>
        </div>
        <div className={styles['stat-card'] + ' ' + styles['info']}>
          <div className={styles['stat-icon']}>📚</div>
          <div className={styles['stat-info']}>
            <span className={styles['stat-value']}>{formatNumber(stats?.totals?.courses)}</span>
            <span className={styles['stat-label']}>Cursos Disponibles</span>
          </div>
        </div>
        <div className={styles['stat-card'] + ' ' + styles['warning']}>
          <div className={styles['stat-icon']}>📝</div>
          <div className={styles['stat-info']}>
            <span className={styles['stat-value']}>{formatNumber(stats?.totals?.applications)}</span>
            <span className={styles['stat-label']}>Aplicaciones Totales</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {stats?.recentActivity && (
        <div className={styles['recent-activity']}>
          <h2>📈 Actividad Reciente (Últimos 30 días)</h2>
          <div className={styles['activity-grid']}>
            <div className={styles['activity-item']}>
              <span className={styles['activity-count']}>+{formatNumber(stats.recentActivity.newUsers)}</span>
              <span className={styles['activity-label']}>Nuevos usuarios</span>
            </div>
            <div className={styles['activity-item']}>
              <span className={styles['activity-count']}>+{formatNumber(stats.recentActivity.newJobs)}</span>
              <span className={styles['activity-label']}>Nuevos empleos</span>
            </div>
            <div className={styles['activity-item']}>
              <span className={styles['activity-count']}>+{formatNumber(stats.recentActivity.newApplications)}</span>
              <span className={styles['activity-label']}>Nuevas aplicaciones</span>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className={styles['charts-section']}>
        {/* Users by Role */}
        {stats?.usersByRole && stats.usersByRole.length > 0 && (
          <div className={styles['chart-card']}>
            <h3>👥 Usuarios por Rol</h3>
            <div className={styles['chart-list']}>
              {stats.usersByRole.map((item, index) => (
                <div key={index} className={styles['chart-item']}>
                  <div className={styles['item-label']}>{getRoleLabel(item.role)}</div>
                  <div className={styles['item-bar-container']}>
                    <div 
                      className={styles['item-bar']}
                      style={{ 
                        width: `${(item.count / Math.max(...stats.usersByRole.map(u => u.count))) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <div className={styles['item-value']}>{formatNumber(item.count)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Applications by Status */}
        {stats?.applicationsByStatus && stats.applicationsByStatus.length > 0 && (
          <div className={styles['chart-card']}>
            <h3>📝 Aplicaciones por Estado</h3>
            <div className={styles['chart-list']}>
              {stats.applicationsByStatus.map((item, index) => (
                <div key={index} className={styles['chart-item']}>
                  <div className={styles['item-label']}>{getStatusLabel(item.status)}</div>
                  <div className={styles['item-bar-container']}>
                    <div 
                      className={styles['item-bar'] + ' ' + styles[`status-${item.status.toLowerCase()}`]}
                      style={{ 
                        width: `${(item.count / Math.max(...stats.applicationsByStatus.map(a => a.count))) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <div className={styles['item-value']}>{formatNumber(item.count)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Jobs by Category */}
        {stats?.jobsByCategory && stats.jobsByCategory.length > 0 && (
          <div className={styles['chart-card']}>
            <h3>💼 Empleos por Categoría</h3>
            <div className={styles['chart-list'] + ' ' + styles['compact']}>
              {stats.jobsByCategory.map((item, index) => (
                <div key={index} className={styles['chart-item'] + ' ' + styles['compact']}>
                  <span className={styles['compact-label']}>{item.category}</span>
                  <span className={styles['compact-value']}>{formatNumber(item.count)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Courses by Level */}
        {stats?.coursesByLevel && stats.coursesByLevel.length > 0 && (
          <div className={styles['chart-card']}>
            <h3>📚 Cursos por Nivel</h3>
            <div className={styles['chart-list'] + ' ' + styles['compact']}>
              {stats.coursesByLevel.map((item, index) => (
                <div key={index} className={styles['chart-item'] + ' ' + styles['compact']}>
                  <span className={styles['compact-label']}>{item.level}</span>
                  <span className={styles['compact-value']}>{formatNumber(item.count)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={styles['admin-footer']}>
        <p>🛡️ Panel de Administración Laboria • {new Date().getFullYear()}</p>
        <button onClick={loadDashboardStats} className={styles['btn-refresh']}>
          🔄 Actualizar datos
        </button>
      </div>
    </div>
    </div>
    </div>
  );
};

export default AdminDashboard;
