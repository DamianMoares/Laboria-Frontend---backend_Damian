import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import AdminNavigation from './AdminNavigation';
import './AdminUsers.css';

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
    <div className="admin-layout">
      <AdminNavigation onLogout={onAdminLogout} />
      <div className="admin-content">
    <div className="admin-users">
      {/* Header */}
      <div className="admin-header">
        <div className="header-content">
          <div>
            <h1>👥 Gestión de Usuarios</h1>
            <p className="subtitle">Administra los usuarios del sistema</p>
          </div>
          <Link to="/admin" className="btn-back">
            ← Volver al Dashboard
          </Link>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Buscar:</label>
          <input
            type="text"
            placeholder="Nombre o email..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="filter-input"
          />
        </div>
        <div className="filter-group">
          <label>Rol:</label>
          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            className="filter-select"
          >
            {roles.map(role => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
        </div>
        <button onClick={loadUsers} className="btn-refresh">
          🔄 Actualizar
        </button>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="admin-loading">
          <div className="spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      ) : error ? (
        <div className="admin-error">
          <p>{error}</p>
          <button onClick={loadUsers} className="btn-retry">Reintentar</button>
        </div>
      ) : (
        <>
          <div className="users-table-container">
            <table className="users-table">
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
                {users.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                        <span className="user-name">{user.name}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={updateLoading}
                        className="role-select"
                      >
                        {roles.filter(r => r.value).map(role => (
                          <option key={role.value} value={role.value}>{role.label}</option>
                        ))}
                      </select>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <div className="activity-badges">
                        <span className="badge" title="Empleos publicados">
                          💼 {user._count?.jobs || 0}
                        </span>
                        <span className="badge" title="Cursos publicados">
                          📚 {user._count?.courses || 0}
                        </span>
                        <span className="badge" title="Aplicaciones enviadas">
                          📝 {user._count?.applications || 0}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => openUserDetail(user)}
                          className="btn-view"
                          title="Ver detalles"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => confirmDelete(user)}
                          className="btn-delete"
                          title="Eliminar usuario"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              disabled={pagination.page === 1}
              className="btn-page"
            >
              ← Anterior
            </button>
            <span className="page-info">
              Página {pagination.page} de {pagination.totalPages} 
              ({pagination.total} usuarios)
            </span>
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              disabled={pagination.page === pagination.totalPages}
              className="btn-page"
            >
              Siguiente →
            </button>
          </div>
        </>
      )}

      {/* User Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>👤 Detalles del Usuario</h2>
              <button onClick={() => setShowDetailModal(false)} className="btn-close">×</button>
            </div>
            <div className="modal-body">
              <div className="user-detail-header">
                <div className="user-avatar large">{selectedUser.name.charAt(0).toUpperCase()}</div>
                <div className="user-detail-info">
                  <h3>{selectedUser.name}</h3>
                  <p>{selectedUser.email}</p>
                  <span className={`role-badge ${selectedUser.role.toLowerCase()}`}>
                    {getRoleLabel(selectedUser.role)}
                  </span>
                </div>
              </div>

              <div className="detail-sections">
                <div className="detail-section">
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
                  <div className="detail-section">
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
                  <div className="detail-section">
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
                  <div className="detail-section">
                    <h4>📝 Aplicaciones ({selectedUser.applications.length})</h4>
                    <ul className="item-list">
                      {selectedUser.applications.map(app => (
                        <li key={app.id}>
                          <strong>{app.job?.title}</strong>
                          <span className={`status-badge ${app.status.toLowerCase()}`}>
                            {app.status}
                          </span>
                          <small>{formatDate(app.createdAt)}</small>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="detail-section">
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
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header warning">
              <h2>⚠️ Confirmar Eliminación</h2>
            </div>
            <div className="modal-body">
              <p className="confirm-text">
                ¿Estás seguro de que quieres eliminar al usuario <strong>{userToDelete.name}</strong>?
              </p>
              <p className="confirm-warning">
                Esta acción no se puede deshacer. Se eliminarán todos los datos asociados:
                empleos, cursos y aplicaciones del usuario.
              </p>
              <div className="confirm-actions">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="btn-cancel"
                  disabled={updateLoading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="btn-confirm-delete"
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
