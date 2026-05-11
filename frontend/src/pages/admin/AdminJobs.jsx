import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import AdminNavigation from './AdminNavigation';
import './AdminJobs.css';

const AdminJobs = ({ onAdminLogout }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filters, setFilters] = useState({ category: '', search: '' });
  const [editingJob, setEditingJob] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const categories = [
    { value: '', label: 'Todas las categorías' },
    { value: 'Tecnología', label: '💻 Tecnología' },
    { value: 'Diseño', label: '🎨 Diseño' },
    { value: 'Marketing', label: '📢 Marketing' },
    { value: 'Ventas', label: '💰 Ventas' },
    { value: 'Administración', label: '📋 Administración' },
    { value: 'Educación', label: '📚 Educación' },
    { value: 'Salud', label: '🏥 Salud' },
    { value: 'Otros', label: '📦 Otros' }
  ];

  const workModes = [
    { value: 'REMOTE', label: '🏠 Remoto' },
    { value: 'HYBRID', label: '🔄 Híbrido' },
    { value: 'ONSITE', label: '🏢 Presencial' }
  ];

  useEffect(() => {
    loadJobs();
  }, [pagination.page, filters]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: 10,
        ...filters
      };
      const response = await adminService.getAllJobs(params);
      setJobs(response.jobs);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      setError('Error al cargar empleos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (job) => {
    setEditingJob({ ...job });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingJob) return;

    try {
      setUpdateLoading(true);
      await adminService.updateJob(editingJob.id, {
        title: editingJob.title,
        company: editingJob.company,
        location: editingJob.location,
        description: editingJob.description,
        requirements: editingJob.requirements,
        salary: editingJob.salary,
        category: editingJob.category,
        mode: editingJob.mode
      });
      setMessage({ type: 'success', text: 'Empleo actualizado correctamente' });
      setShowEditModal(false);
      setEditingJob(null);
      loadJobs();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setUpdateLoading(false);
    }
  };

  const confirmDelete = (job) => {
    setJobToDelete(job);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!jobToDelete) return;

    try {
      setUpdateLoading(true);
      await adminService.deleteJob(jobToDelete.id);
      setMessage({ type: 'success', text: 'Empleo eliminado correctamente' });
      setShowDeleteModal(false);
      setJobToDelete(null);
      loadJobs();
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
      day: 'numeric'
    });
  };

  const getModeLabel = (mode) => {
    const modeObj = workModes.find(m => m.value === mode);
    return modeObj ? modeObj.label : mode;
  };

  return (
    <div className="admin-layout">
      <AdminNavigation onLogout={onAdminLogout} />
      <div className="admin-content">
    <div className="admin-jobs">
      {/* Header */}
      <div className="admin-header">
        <div className="header-content">
          <div>
            <h1>💼 Gestión de Empleos</h1>
            <p className="subtitle">Administra todos los empleos del sistema</p>
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
            placeholder="Título o empresa..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="filter-input"
          />
        </div>
        <div className="filter-group">
          <label>Categoría:</label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="filter-select"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        <button onClick={loadJobs} className="btn-refresh">
          🔄 Actualizar
        </button>
      </div>

      {/* Jobs Table */}
      {loading ? (
        <div className="admin-loading">
          <div className="spinner"></div>
          <p>Cargando empleos...</p>
        </div>
      ) : error ? (
        <div className="admin-error">
          <p>{error}</p>
          <button onClick={loadJobs} className="btn-retry">Reintentar</button>
        </div>
      ) : (
        <>
          <div className="jobs-table-container">
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Empleo</th>
                  <th>Empresa</th>
                  <th>Categoría</th>
                  <th>Modalidad</th>
                  <th>Autor</th>
                  <th>Aplicaciones</th>
                  <th>Publicado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id}>
                    <td>
                      <div className="job-title">
                        <strong>{job.title}</strong>
                        {job.salary && (
                          <span className="job-salary">💰 {job.salary}</span>
                        )}
                      </div>
                    </td>
                    <td>{job.company}</td>
                    <td>
                      <span className="category-badge">{job.category}</span>
                    </td>
                    <td>{getModeLabel(job.mode)}</td>
                    <td>
                      <div className="author-info">
                        <span className="author-name">{job.author?.name}</span>
                        <small>{job.author?.email}</small>
                      </div>
                    </td>
                    <td>
                      <span className="applications-count">
                        {job._count?.applications || 0} aplicaciones
                      </span>
                    </td>
                    <td>{formatDate(job.createdAt)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEdit(job)}
                          className="btn-edit"
                          title="Editar empleo"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => confirmDelete(job)}
                          className="btn-delete"
                          title="Eliminar empleo"
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
              ({pagination.total} empleos)
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

      {/* Edit Modal */}
      {showEditModal && editingJob && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content edit-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✏️ Editar Empleo</h2>
              <button onClick={() => setShowEditModal(false)} className="btn-close">×</button>
            </div>
            <div className="modal-body">
              <form className="edit-form">
                <div className="form-group">
                  <label>Título del puesto *</label>
                  <input
                    type="text"
                    value={editingJob.title}
                    onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Empresa *</label>
                  <input
                    type="text"
                    value={editingJob.company}
                    onChange={(e) => setEditingJob({ ...editingJob, company: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Categoría *</label>
                    <select
                      value={editingJob.category}
                      onChange={(e) => setEditingJob({ ...editingJob, category: e.target.value })}
                      required
                    >
                      {categories.filter(c => c.value).map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Modalidad *</label>
                    <select
                      value={editingJob.mode}
                      onChange={(e) => setEditingJob({ ...editingJob, mode: e.target.value })}
                      required
                    >
                      {workModes.map(mode => (
                        <option key={mode.value} value={mode.value}>{mode.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Ubicación</label>
                  <input
                    type="text"
                    value={editingJob.location || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                    placeholder="Ciudad o 'Remoto'"
                  />
                </div>

                <div className="form-group">
                  <label>Salario</label>
                  <input
                    type="text"
                    value={editingJob.salary || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, salary: e.target.value })}
                    placeholder="ej: 30,000 - 50,000 €"
                  />
                </div>

                <div className="form-group">
                  <label>Descripción *</label>
                  <textarea
                    value={editingJob.description}
                    onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Requisitos</label>
                  <textarea
                    value={editingJob.requirements || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, requirements: e.target.value })}
                    rows={3}
                    placeholder="Lista de requisitos separados por comas"
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="btn-cancel"
                    disabled={updateLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="btn-save"
                    disabled={updateLoading}
                  >
                    {updateLoading ? 'Guardando...' : '💾 Guardar Cambios'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && jobToDelete && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header warning">
              <h2>⚠️ Confirmar Eliminación</h2>
            </div>
            <div className="modal-body">
              <p className="confirm-text">
                ¿Estás seguro de que quieres eliminar el empleo <strong>{jobToDelete.title}</strong> de <strong>{jobToDelete.company}</strong>?
              </p>
              <p className="confirm-warning">
                Esta acción no se puede deshacer. Se eliminarán también todas las aplicaciones asociadas a este empleo.
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
                  onClick={handleDelete}
                  className="btn-confirm-delete"
                  disabled={updateLoading}
                >
                  {updateLoading ? 'Eliminando...' : '🗑️ Eliminar Empleo'}
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

export default AdminJobs;
