import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import jobsData from '../../data/jobs.json';
import coursesData from '../../data/courses.json';
import EditProfileModal from '../../components/EditProfileModal';
import './ProfilePage.css';

const CompanyProfilePage = () => {
  const { user, logout, isAnyCompany, isCompanyEmployees, isCompanyStudents, isCompanyHybrid, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!user || !isAnyCompany()) {
    return (
      <div className="profile-page not-authorized">
        <div className="container">
          <h1>No autorizado</h1>
          <p>Esta página es solo para empresas.</p>
          <Link to="/" className="btn btn-primary">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  const profile = user.profile || {};
  const focus = profile.focus || '';

  // Get posted jobs and courses based on IDs
  const postedJobs = profile.postedJobs 
    ? jobsData.filter(job => profile.postedJobs.includes(job.id))
    : [];
  
  const postedCourses = profile.postedCourses
    ? coursesData.filter(course => profile.postedCourses.includes(course.id))
    : [];

  return (
    <div className="profile-page company-profile-page">
      <div className="container">
        <header className="profile-header">
          <div className="profile-header-content">
            <div className="profile-avatar company">
              {profile.companyName ? profile.companyName[0] : user.name[0]}
            </div>
            <div className="profile-info">
              <h1>{profile.companyName}</h1>
              <p className="profile-email">{profile.email}</p>
              <p className="profile-location">{profile.location}</p>
              <div className="company-badges">
                <span className="badge">{focus === 'híbrido' ? 'Híbrida' : focus === 'empleados' ? 'Empleados' : 'Estudiantes'}</span>
                <span className="badge">{profile.industry}</span>
              </div>
            </div>
          </div>
          <button className="btn btn-secondary" onClick={logout}>
            Cerrar Sesión
          </button>
        </header>

        <div className="profile-content">
          <div className="profile-main">
            <section className="profile-section">
              <h2>Información de la Empresa</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{profile.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Teléfono:</span>
                  <span className="info-value">{profile.phone || 'No especificado'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Ubicación:</span>
                  <span className="info-value">{profile.location}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Industria:</span>
                  <span className="info-value">{profile.industry}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Tamaño:</span>
                  <span className="info-value">{profile.size || 'No especificado'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Sitio web:</span>
                  {profile.website ? (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="info-value link">
                      {profile.website}
                    </a>
                  ) : (
                    <span className="info-value">No especificado</span>
                  )}
                </div>
              </div>
            </section>

            <section className="profile-section">
              <h2>Descripción</h2>
              <p className="bio-text">{profile.description || 'No hay descripción'}</p>
            </section>

            {(isCompanyEmployees() || isCompanyHybrid()) && (
              <section className="profile-section">
                <h2>Ofertas de Empleo Publicadas</h2>
                {postedJobs.length > 0 ? (
                  <div className="posted-items">
                    {postedJobs.map(job => (
                      <Link key={job.id} to={`/empleos/${job.id}`} className="posted-item">
                        <span className="posted-item-title">{job.title}</span>
                        <span className="posted-item-meta">{job.location} • {job.salary}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="no-data">No hay ofertas publicadas</p>
                )}
                <button className="mt-md btn btn-secondary">Publicar nueva oferta</button>
              </section>
            )}

            {(isCompanyStudents() || isCompanyHybrid()) && (
              <section className="profile-section">
                <h2>Cursos Publicados</h2>
                {postedCourses.length > 0 ? (
                  <div className="posted-items">
                    {postedCourses.map(course => (
                      <Link key={course.id} to={`/cursos/${course.id}`} className="posted-item">
                        <span className="posted-item-title">{course.title}</span>
                        <span className="posted-item-meta">{course.platform} • {course.price}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="no-data">No hay cursos publicados</p>
                )}
                <button className="mt-md btn btn-secondary">Publicar nuevo curso</button>
              </section>
            )}
          </div>

          <aside className="profile-sidebar">
            <div className="sidebar-card">
              <h3>Acciones rápidas</h3>
              <Link to="/panel" className="sidebar-action">
                Resumen
              </Link>
              {(isCompanyEmployees() || isCompanyHybrid()) && (
                <Link to="/empleos" className="sidebar-action">
                  Ver ofertas de empleo
                </Link>
              )}
              {(isCompanyStudents() || isCompanyHybrid()) && (
                <Link to="/cursos" className="sidebar-action">
                  Ver cursos
                </Link>
              )}
              <button className="sidebar-action" onClick={() => setIsEditModalOpen(true)}>
                Editar Perfil
              </button>
              <button className="sidebar-action delete-account" onClick={() => setIsDeleteModalOpen(true)}>
                Eliminar Cuenta
              </button>
            </div>

            <div className="sidebar-card">
              <h3>Estadísticas</h3>
              <div className="stat-item">
                <span className="stat-value">{postedJobs.length}</span>
                <span className="stat-label">Ofertas publicadas</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{postedCourses.length}</span>
                <span className="stat-label">Cursos publicados</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        userType="company" 
      />

      {isDeleteModalOpen && (
        <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Eliminar Cuenta</h2>
              <button className="modal-close" onClick={() => setIsDeleteModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible y se perderán todos tus datos.</p>
              <div className="form-actions">
                <button className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>
                  Cancelar
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={() => {
                    deleteAccount();
                    navigate('/');
                  }}
                >
                  Confirmar Eliminación
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyProfilePage;
