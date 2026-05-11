import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import AdminNavigation from './AdminNavigation';
import './AdminCourses.css';

const AdminCourses = ({ onAdminLogout }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filters, setFilters] = useState({ category: '', level: '', search: '' });
  const [editingCourse, setEditingCourse] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const categories = [
    { value: '', label: 'Todas las categorías' },
    { value: 'Tecnología', label: '💻 Tecnología' },
    { value: 'Diseño', label: '🎨 Diseño' },
    { value: 'Marketing', label: '📢 Marketing' },
    { value: 'Negocios', label: '💼 Negocios' },
    { value: 'Idiomas', label: '🗣️ Idiomas' },
    { value: 'Desarrollo Personal', label: '🌱 Desarrollo Personal' },
    { value: 'Otros', label: '📦 Otros' }
  ];

  const levels = [
    { value: '', label: 'Todos los niveles' },
    { value: 'BEGINNER', label: '🔰 Principiante' },
    { value: 'INTERMEDIATE', label: '📈 Intermedio' },
    { value: 'ADVANCED', label: '🚀 Avanzado' }
  ];

  useEffect(() => {
    loadCourses();
  }, [pagination.page, filters]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: 10,
        ...filters
      };
      const response = await adminService.getAllCourses(params);
      setCourses(response.courses);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      setError('Error al cargar cursos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse({ ...course });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingCourse) return;

    try {
      setUpdateLoading(true);
      await adminService.updateCourse(editingCourse.id, {
        title: editingCourse.title,
        provider: editingCourse.provider,
        description: editingCourse.description,
        category: editingCourse.category,
        level: editingCourse.level,
        duration: editingCourse.duration,
        price: editingCourse.price,
        url: editingCourse.url
      });
      setMessage({ type: 'success', text: 'Curso actualizado correctamente' });
      setShowEditModal(false);
      setEditingCourse(null);
      loadCourses();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setUpdateLoading(false);
    }
  };

  const confirmDelete = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!courseToDelete) return;

    try {
      setUpdateLoading(true);
      await adminService.deleteCourse(courseToDelete.id);
      setMessage({ type: 'success', text: 'Curso eliminado correctamente' });
      setShowDeleteModal(false);
      setCourseToDelete(null);
      loadCourses();
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

  const getLevelLabel = (level) => {
    const levelObj = levels.find(l => l.value === level);
    return levelObj ? levelObj.label : level;
  };

  return (
    <div className="admin-layout">
      <AdminNavigation onLogout={onAdminLogout} />
      <div className="admin-content">
    <div className="admin-courses">
      {/* Header */}
      <div className="admin-header">
        <div className="header-content">
          <div>
            <h1>📚 Gestión de Cursos</h1>
            <p className="subtitle">Administra todos los cursos del sistema</p>
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
            placeholder="Título o proveedor..."
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
        <div className="filter-group">
          <label>Nivel:</label>
          <select
            value={filters.level}
            onChange={(e) => setFilters({ ...filters, level: e.target.value })}
            className="filter-select"
          >
            {levels.map(lvl => (
              <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
            ))}
          </select>
        </div>
        <button onClick={loadCourses} className="btn-refresh">
          🔄 Actualizar
        </button>
      </div>

      {/* Courses Table */}
      {loading ? (
        <div className="admin-loading">
          <div className="spinner"></div>
          <p>Cargando cursos...</p>
        </div>
      ) : error ? (
        <div className="admin-error">
          <p>{error}</p>
          <button onClick={loadCourses} className="btn-retry">Reintentar</button>
        </div>
      ) : (
        <>
          <div className="courses-table-container">
            <table className="courses-table">
              <thead>
                <tr>
                  <th>Curso</th>
                  <th>Proveedor</th>
                  <th>Categoría</th>
                  <th>Nivel</th>
                  <th>Duración</th>
                  <th>Precio</th>
                  <th>Autor</th>
                  <th>Publicado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course.id}>
                    <td>
                      <div className="course-title">
                        <strong>{course.title}</strong>
                        {course.url && (
                          <a href={course.url} target="_blank" rel="noopener noreferrer" className="course-link">
                            🔗 Ver curso
                          </a>
                        )}
                      </div>
                    </td>
                    <td>{course.provider}</td>
                    <td>
                      <span className="category-badge">{course.category}</span>
                    </td>
                    <td>{getLevelLabel(course.level)}</td>
                    <td>{course.duration || '-'}</td>
                    <td>
                      {course.price ? (
                        <span className="price-tag">{course.price}</span>
                      ) : (
                        <span className="free-tag">Gratis</span>
                      )}
                    </td>
                    <td>
                      <div className="author-info">
                        <span className="author-name">{course.author?.name}</span>
                        <small>{course.author?.email}</small>
                      </div>
                    </td>
                    <td>{formatDate(course.createdAt)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEdit(course)}
                          className="btn-edit"
                          title="Editar curso"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => confirmDelete(course)}
                          className="btn-delete"
                          title="Eliminar curso"
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
              ({pagination.total} cursos)
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
      {showEditModal && editingCourse && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content edit-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✏️ Editar Curso</h2>
              <button onClick={() => setShowEditModal(false)} className="btn-close">×</button>
            </div>
            <div className="modal-body">
              <form className="edit-form">
                <div className="form-group">
                  <label>Título del curso *</label>
                  <input
                    type="text"
                    value={editingCourse.title}
                    onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Proveedor/Plataforma *</label>
                  <input
                    type="text"
                    value={editingCourse.provider}
                    onChange={(e) => setEditingCourse({ ...editingCourse, provider: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Categoría *</label>
                    <select
                      value={editingCourse.category}
                      onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                      required
                    >
                      {categories.filter(c => c.value).map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Nivel *</label>
                    <select
                      value={editingCourse.level}
                      onChange={(e) => setEditingCourse({ ...editingCourse, level: e.target.value })}
                      required
                    >
                      {levels.filter(l => l.value).map(lvl => (
                        <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Duración</label>
                    <input
                      type="text"
                      value={editingCourse.duration || ''}
                      onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                      placeholder="ej: 4 semanas, 20 horas"
                    />
                  </div>

                  <div className="form-group">
                    <label>Precio</label>
                    <input
                      type="text"
                      value={editingCourse.price || ''}
                      onChange={(e) => setEditingCourse({ ...editingCourse, price: e.target.value })}
                      placeholder="ej: Gratis, 49.99€"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>URL del curso</label>
                  <input
                    type="url"
                    value={editingCourse.url || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="form-group">
                  <label>Descripción *</label>
                  <textarea
                    value={editingCourse.description}
                    onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                    rows={4}
                    required
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
      {showDeleteModal && courseToDelete && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header warning">
              <h2>⚠️ Confirmar Eliminación</h2>
            </div>
            <div className="modal-body">
              <p className="confirm-text">
                ¿Estás seguro de que quieres eliminar el curso <strong>{courseToDelete.title}</strong> de <strong>{courseToDelete.provider}</strong>?
              </p>
              <p className="confirm-warning">
                Esta acción no se puede deshacer.
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
                  {updateLoading ? 'Eliminando...' : '🗑️ Eliminar Curso'}
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

export default AdminCourses;
