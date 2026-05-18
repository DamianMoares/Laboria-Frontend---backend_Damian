import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import AdminNavigation from './AdminNavigation';
import EmptyState from '../../components/EmptyState';
import styles from './AdminApplications.module.css';

const AdminApplications = ({ onAdminLogout }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filters, setFilters] = useState({ status: '' });
  const [editingApplication, setEditingApplication] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const statuses = [
    { value: '', label: 'Todos los estados' },
    { value: 'PENDING', label: '⏳ Pendiente' },
    { value: 'ACCEPTED', label: '✅ Aceptada' },
    { value: 'REJECTED', label: '❌ Rechazada' }
  ];

  useEffect(() => {
    loadApplications();
  }, [pagination.page, filters]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: 10,
        ...filters
      };
      const response = await adminService.getAllApplications(params);
      setApplications(response.applications);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      setError('Error al cargar aplicaciones: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      setUpdateLoading(true);
      await adminService.updateApplicationStatus(applicationId, newStatus);
      setMessage({ type: 'success', text: 'Estado actualizado correctamente' });
      loadApplications();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setUpdateLoading(false);
    }
  };

  const openEditModal = (application) => {
    setEditingApplication({ ...application });
    setShowEditModal(true);
  };

  const handleSaveStatus = async () => {
    if (!editingApplication) return;

    try {
      setUpdateLoading(true);
      await adminService.updateApplicationStatus(
        editingApplication.id,
        editingApplication.status
      );
      setMessage({ type: 'success', text: 'Estado actualizado correctamente' });
      setShowEditModal(false);
      setEditingApplication(null);
      loadApplications();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setUpdateLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusLabel = (status) => {
    const statusObj = statuses.find(s => s.value === status);
    return statusObj ? statusObj.label : status;
  };

  const getStatusClass = (status) => {
    const classes = {
      'PENDING': 'status-pending',
      'ACCEPTED': 'status-accepted',
      'REJECTED': 'status-rejected'
    };
    return classes[status] || '';
  };

  return (
    <div className={styles['admin-layout']}>
      <AdminNavigation onLogout={onAdminLogout} />
      <div className={styles['admin-content']}>
    <div className={styles['admin-applications']}>
      {/* Header */}
      <div className={styles['admin-header']}>
        <div className={styles['header-content']}>
          <div>
            <h1>📝 Gestión de Aplicaciones</h1>
            <p className={styles['subtitle']}>Administra todas las aplicaciones a empleos</p>
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
          <label>Filtrar por estado:</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className={styles['filter-select']}
          >
            {statuses.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
        <button onClick={loadApplications} className={styles['btn-refresh']}>
          🔄 Actualizar
        </button>
      </div>

      {/* Stats Summary */}
      <div className={styles['stats-summary']}>
        {statuses.filter(s => s.value).map(status => {
          const count = applications.filter(a => a.status === status.value).length;
          return (
            <div key={status.value} className={styles['stat-pill'] + ' ' + styles[getStatusClass(status.value)]}>
              <span className={styles['stat-label']}>{status.label}</span>
              <span className={styles['stat-count']}>{count}</span>
            </div>
          );
        })}
      </div>

      {/* Applications Table */}
      {loading ? (
        <div className={styles['admin-loading']}>
          <div className={styles['spinner']}></div>
          <p>Cargando aplicaciones...</p>
        </div>
      ) : error ? (
        <div className={styles['admin-error']}>
          <p>{error}</p>
          <button onClick={loadApplications} className={styles['btn-retry']}>Reintentar</button>
        </div>
      ) : (
        <>
          <div className={styles['applications-table-container']}>
            <table className={styles['applications-table']}>
              <thead>
                <tr>
                  <th>Empleo</th>
                  <th>Empresa</th>
                  <th>Candidato</th>
                  <th>Estado</th>
                  <th>Mensaje</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}><EmptyState title="Sin datos" message="No hay elementos para mostrar." /></td></tr>
                ) : (
                  applications.map(application => (
                    <tr key={application.id}>
                      <td>
                        <div className={styles['job-info']}>
                          <strong>{application.job?.title}</strong>
                          <span className="job-category">{application.job?.category}</span>
                        </div>
                      </td>
                      <td>{application.job?.company}</td>
                      <td>
                        <div className={styles['candidate-info']}>
                          <span className={styles['candidate-name']}>{application.user?.name}</span>
                          <small>{application.user?.email}</small>
                        </div>
                      </td>
                      <td>
                        <select
                          value={application.status}
                          onChange={(e) => handleStatusChange(application.id, e.target.value)}
                          disabled={updateLoading}
                          className={styles['status-select'] + ' ' + styles[getStatusClass(application.status)]}
                        >
                          {statuses.filter(s => s.value).map(status => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        {application.message ? (
                          <span className={styles['message-preview']} title={application.message}>
                            {application.message.length > 50
                              ? application.message.substring(0, 50) + '...'
                              : application.message}
                          </span>
                        ) : (
                          <span className={styles['no-message']}>-</span>
                        )}
                      </td>
                      <td>{formatDate(application.createdAt)}</td>
                      <td>
                        <button
                          onClick={() => openEditModal(application)}
                          className={styles['btn-view']}
                          title="Ver detalles"
                          aria-label="Ver detalles de la aplicación"
                        >
                          👁️
                        </button>
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
              ({pagination.total} aplicaciones)
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

      {/* Edit Modal */}
      {showEditModal && editingApplication && (
        <div className={styles['modal-overlay']} onClick={() => setShowEditModal(false)}>
          <div className={styles['modal-content'] + ' detail-modal'} onClick={e => e.stopPropagation()}>
            <div className={styles['modal-header']}>
              <h2>📝 Detalles de la Aplicación</h2>
              <button onClick={() => setShowEditModal(false)} className={styles['btn-close']}>×</button>
            </div>
            <div className={styles['modal-body']}>
              <div className="application-detail">
                {/* Job Info */}
                <div className={styles['detail-section']}>
                  <h3>💼 Empleo</h3>
                  <div className={styles['detail-card']}>
                    <p><strong>Título:</strong> {editingApplication.job?.title}</p>
                    <p><strong>Empresa:</strong> {editingApplication.job?.company}</p>
                    <p><strong>Categoría:</strong> {editingApplication.job?.category}</p>
                    <p><strong>Publicado por:</strong> {editingApplication.job?.author?.name}</p>
                  </div>
                </div>

                {/* Candidate Info */}
                <div className={styles['detail-section']}>
                  <h3>👤 Candidato</h3>
                  <div className={styles['detail-card']}>
                    <p><strong>Nombre:</strong> {editingApplication.user?.name}</p>
                    <p><strong>Email:</strong> {editingApplication.user?.email}</p>
                    <p><strong>ID:</strong> <code>{editingApplication.user?.id}</code></p>
                  </div>
                </div>

                {/* Application Info */}
                <div className={styles['detail-section']}>
                  <h3>📝 Información de la Aplicación</h3>
                  <div className={styles['detail-card']}>
                    <div className={styles['form-group']}>
                      <label><strong>Estado:</strong></label>
                      <select
                        value={editingApplication.status}
                        onChange={(e) => setEditingApplication({
                          ...editingApplication,
                          status: e.target.value
                        })}
                        className={styles['status-select'] + ' ' + styles['large'] + ' ' + styles[getStatusClass(editingApplication.status)]}
                      >
                        {statuses.filter(s => s.value).map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {editingApplication.message && (
                      <div className="message-box">
                        <label><strong>Mensaje del candidato:</strong></label>
                        <p className="message-text">{editingApplication.message}</p>
                      </div>
                    )}

                    <p><strong>Fecha de aplicación:</strong> {formatDate(editingApplication.createdAt)}</p>
                    <p><strong>Última actualización:</strong> {formatDate(editingApplication.updatedAt)}</p>
                    <p><strong>ID de aplicación:</strong> <code>{editingApplication.id}</code></p>
                  </div>
                </div>

                <div className={styles['form-actions']}>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className={styles['btn-cancel']}
                    disabled={updateLoading}
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={handleSaveStatus}
                    className={styles['btn-save']}
                    disabled={updateLoading}
                  >
                    {updateLoading ? 'Guardando...' : '💾 Guardar Cambios'}
                  </button>
                </div>
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

export default AdminApplications;
