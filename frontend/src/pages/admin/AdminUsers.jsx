import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import AdminNavigation from './AdminNavigation';
import EmptyState from '../../components/EmptyState';
import styles from './AdminUsers.module.css';

const AdminUsers = ({ onAdminLogout }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filters, setFilters] = useState({ role: '', search: '' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const roles = [
    { value: '', label: 'Todos los roles' },
    { value: 'CANDIDATE', label: '👤 Candidato' },
    { value: 'COMPANY_EMPLOYEES', label: '🏢 Empresa (Empleados)' },
    { value: 'COMPANY_STUDENTS', label: '🎓 Empresa (Estudiantes)' },
    { value: 'COMPANY_HYBRID', label: '🔄 Empresa (Híbrida)' },
    { value: 'ADMIN', label: '🔒 Administrador' }
  ];

  useEffect(() => {
    loadUsers();
  }, [pagination.page, filters]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: 10,
        ...filters
      };
      const response = await adminService.getAllUsers(params);
      setUsers(response.users);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      setError('Error al cargar usuarios: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdateLoading(true);
      await adminService.updateUserRole(userId, newRole);
      setMessage({ type: 'success', text: 'Rol actualizado correctamente' });
      loadUsers();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setUpdateLoading(true);
      await adminService.deleteUser(userToDelete.id);
      setMessage({ type: 'success', text: 'Usuario eliminado correctamente' });
      setShowDeleteModal(false);
      setUserToDelete(null);
      loadUsers();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setUpdateLoading(false);
    }
  };

  const openUserDetail = async (user) => {
    try {
      setLoading(true);
      const response = await adminService.getUserDetails(user.id);
      setSelectedUser(response.user);
      setShowDetailModal(true);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleLabel = (role) => {
    const roleObj = roles.find(r => r.value === role);
    return roleObj ? roleObj.label : role;
  };

  return (
    <div className={styles['admin-layout']}>
      <AdminNavigation onLogout={onAdminLogout} />
      <div className={styles['admin-content']}>
    <div className={styles['admin-users']}>
      {/* Header */}
      <div className={styles['admin-header']}>
        <div className={styles['header-content']}>
          <div>
            <h1>👥 Gestión de Usuarios</h1>
            <p className={styles['subtitle']}>Administra los usuarios del sistema</p>
          </div>
          <Link to="/admin" className={styles['btn-back']}>
            ← Volver al Dashboard
          </Link>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={styles['message'] + ' ' + styles[message.type]}>
          {message.text}
        </div>
      )}

      {/* Filters */}
      <div className={styles['filters-section']}>
        <div className={styles['filter-group']}>
          <label>Buscar:</label>
          <input
            type="text"
            placeholder="Nombre o email..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className={styles['filter-input']}
          />
        </div>
        <div className={styles['filter-group']}>
          <label>Rol:</label>
          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            className={styles['filter-select']}
          >
            {roles.map(role => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
        </div>
        <button onClick={loadUsers} className={styles['btn-refresh']}>
          🔄 Actualizar
        </button>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className={styles['admin-loading']}>
          <div className={styles['spinner']}></div>
          <p>Cargando usuarios...</p>
        </div>
      ) : error ? (
        <div className={styles['admin-error']}>
          <p>{error}</p>
          <button onClick={loadUsers} className={styles['btn-retry']}>Reintentar</button>
        </div>
      ) : (
        <>
          <div className={styles['users-table-container']}>
            <table className={styles['users-table']}>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Registro</th>
                  <th>Actividad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}><EmptyState title="Sin datos" message="No hay elementos para mostrar." /></td></tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className={styles['user-info']}>
                          <div className={styles['user-avatar']}>{user.name.charAt(0).toUpperCase()}</div>
                          <span className={styles['user-name']}>{user.name}</span>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          disabled={updateLoading}
                          className={styles['role-select']}
                        >
                          {roles.filter(r => r.value).map(role => (
                            <option key={role.value} value={role.value}>{role.label}</option>
                          ))}
                        </select>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <div className={styles['activity-badges']}>
                          <span className={styles['badge']} title="Empleos publicados">
                            💼 {user._count?.jobs || 0}
                          </span>
                          <span className={styles['badge']} title="Cursos publicados">
                            📚 {user._count?.courses || 0}
                          </span>
                          <span className={styles['badge']} title="Aplicaciones enviadas">
                            📝 {user._count?.applications || 0}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className={styles['action-buttons']}>
                          <button
                            onClick={() => openUserDetail(user)}
                            className={styles['btn-view']}
                            title="Ver detalles"
                            aria-label="Ver detalles del usuario"
                          >
                            👁️
                          </button>
                          <button
                            onClick={() => confirmDelete(user)}
                            className={styles['btn-delete']}
                            title="Eliminar usuario"
                            aria-label="Eliminar usuario"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className={styles['pagination']}>
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              disabled={pagination.page === 1}
              className={styles['btn-page']}
            >
              ← Anterior
            </button>
            <span className={styles['page-info']}>
              Página {pagination.page} de {pagination.totalPages} 
              ({pagination.total} usuarios)
            </span>
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              disabled={pagination.page === pagination.totalPages}
              className={styles['btn-page']}
            >
              Siguiente →
            </button>
          </div>
        </>
      )}

      {/* User Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className={styles['modal-overlay']} onClick={() => setShowDetailModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className={styles['modal-header']}>
              <h2>👤 Detalles del Usuario</h2>
              <button onClick={() => setShowDetailModal(false)} className={styles['btn-close']}>×</button>
            </div>
            <div className={styles['modal-body']}>
              <div className="user-detail-header">
                <div className={styles['user-avatar'] + ' large'}>{selectedUser.name.charAt(0).toUpperCase()}</div>
                <div className="user-detail-info">
                  <h3>{selectedUser.name}</h3>
                  <p>{selectedUser.email}</p>
                  <span className={styles['role-badge'] + ' ' + selectedUser.role.toLowerCase()}>
                    {getRoleLabel(selectedUser.role)}
                  </span>
                </div>
              </div>

              <div className="detail-sections">
                <div className={styles['detail-section']}>
                  <h4>📊 Estadísticas</h4>
                  <div className="stats-grid">
                    <div className="stat-box">
                      <span className="stat-number">{selectedUser.jobs?.length || 0}</span>
                      <span className="stat-label">Empleos publicados</span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-number">{selectedUser.courses?.length || 0}</span>
                      <span className="stat-label">Cursos publicados</span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-number">{selectedUser.applications?.length || 0}</span>
                      <span className="stat-label">Aplicaciones enviadas</span>
                    </div>
                  </div>
                </div>

                {selectedUser.jobs && selectedUser.jobs.length > 0 && (
                  <div className={styles['detail-section']}>
                    <h4>💼 Empleos Publicados ({selectedUser.jobs.length})</h4>
                    <ul className="item-list">
                      {selectedUser.jobs.map(job => (
                        <li key={job.id}>
                          <strong>{job.title}</strong>
                          <span>en {job.company}</span>
                          <small>{formatDate(job.createdAt)}</small>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedUser.courses && selectedUser.courses.length > 0 && (
                  <div className={styles['detail-section']}>
                    <h4>📚 Cursos Publicados ({selectedUser.courses.length})</h4>
                    <ul className="item-list">
                      {selectedUser.courses.map(course => (
                        <li key={course.id}>
                          <strong>{course.title}</strong>
                          <span>por {course.provider}</span>
                          <small>{formatDate(course.createdAt)}</small>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedUser.applications && selectedUser.applications.length > 0 && (
                  <div className={styles['detail-section']}>
                    <h4>📝 Aplicaciones ({selectedUser.applications.length})</h4>
                    <ul className="item-list">
                      {selectedUser.applications.map(app => (
                        <li key={app.id}>
                          <strong>{app.job?.title}</strong>
                          <span className={'status-badge ' + app.status.toLowerCase()}>
                            {app.status}
                          </span>
                          <small>{formatDate(app.createdAt)}</small>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className={styles['detail-section']}>
                  <h4>📅 Información de Cuenta</h4>
                  <p><strong>Creado:</strong> {formatDate(selectedUser.createdAt)}</p>
                  <p><strong>Última actualización:</strong> {formatDate(selectedUser.updatedAt)}</p>
                  <p><strong>ID:</strong> <code>{selectedUser.id}</code></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className={styles['modal-overlay']} onClick={() => setShowDeleteModal(false)}>
          <div className={styles['modal-content'] + ' ' + styles['confirm-modal']} onClick={e => e.stopPropagation()}>
            <div className={styles['modal-header'] + ' ' + styles['warning']}>
              <h2>⚠️ Confirmar Eliminación</h2>
            </div>
            <div className={styles['modal-body']}>
              <p className={styles['confirm-text']}>
                ¿Estás seguro de que quieres eliminar al usuario <strong>{userToDelete.name}</strong>?
              </p>
              <p className={styles['confirm-warning']}>
                Esta acción no se puede deshacer. Se eliminarán todos los datos asociados:
                empleos, cursos y aplicaciones del usuario.
              </p>
              <div className={styles['confirm-actions']}>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className={styles['btn-cancel']}
                  disabled={updateLoading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteUser}
                  className={styles['btn-confirm-delete']}
                  disabled={updateLoading}
                >
                  {updateLoading ? 'Eliminando...' : '🗑️ Eliminar Usuario'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
    </div>
  );
};

export default AdminUsers;
