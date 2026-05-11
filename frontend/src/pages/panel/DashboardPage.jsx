import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import logoNegro from '../../assets/img/Laboria_Fondo_Negro.png';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user, isCandidate, isCompanyEmployees, isCompanyStudents, isCompanyHybrid } = useAuth();

  if (!user) {
    return (
      <div className="panel-page not-authorized">
        <div className="container">
          <h1>No autorizado</h1>
          <p>Debes iniciar sesión para ver tu panel.</p>
          <Link to="/login" className="btn btn-primary">Iniciar Sesión</Link>
        </div>
      </div>
    );
  }

  const profile = user.profile || {};

  // Configuración de pestañas por rol (para mostrar en el panel)
  const getCandidateTabs = () => [
    { id: 'jobs', label: 'Empleos', icon: '💼', link: '/empleos' },
    { id: 'courses', label: 'Cursos', icon: '📚', link: '/cursos' },
    { id: 'applications', label: 'Aplicaciones', icon: '📝', link: '/mis-aplicaciones' },
    { id: 'saved', label: 'Guardados', icon: '⭐', link: '/cursos-guardados' },
    { id: 'curriculum', label: 'Currículum', icon: '📄', link: '/curriculum' },
    { id: 'profile', label: 'Perfil', icon: '👤', link: '/perfil/candidato' }
  ];

  const getEmployeeTabs = () => [
    { id: 'post-job', label: 'Publicar Oferta', icon: '➕', link: '/publicar-oferta' },
    { id: 'my-jobs', label: 'Mis Ofertas', icon: '📋', link: '/mis-ofertas' },
    { id: 'browse-jobs', label: 'Ver Ofertas', icon: '🔍', link: '/empleos' },
    { id: 'profile', label: 'Perfil', icon: '🏢', link: '/perfil/empresa' }
  ];

  const getStudentTabs = () => [
    { id: 'post-course', label: 'Publicar Curso', icon: '➕', link: '/publicar-curso' },
    { id: 'my-courses', label: 'Mis Cursos', icon: '📚', link: '/mis-cursos' },
    { id: 'browse-courses', label: 'Ver Cursos', icon: '🔍', link: '/cursos' },
    { id: 'profile', label: 'Perfil', icon: '🏢', link: '/perfil/empresa' }
  ];

  const getHybridTabs = () => [
    { id: 'post-job', label: 'Publicar Oferta', icon: '➕', link: '/publicar-oferta' },
    { id: 'my-jobs', label: 'Mis Ofertas', icon: '📋', link: '/mis-ofertas' },
    { id: 'post-course', label: 'Publicar Curso', icon: '➕', link: '/publicar-curso' },
    { id: 'my-courses', label: 'Mis Cursos', icon: '📚', link: '/mis-cursos' },
    { id: 'browse-jobs', label: 'Ver Ofertas', icon: '🔍', link: '/empleos' },
    { id: 'browse-courses', label: 'Ver Cursos', icon: '🔍', link: '/cursos' },
    { id: 'profile', label: 'Perfil', icon: '🏢', link: '/perfil/empresa' }
  ];

  const getTabs = () => {
    if (isCandidate()) return getCandidateTabs();
    if (isCompanyEmployees()) return getEmployeeTabs();
    if (isCompanyStudents()) return getStudentTabs();
    if (isCompanyHybrid()) return getHybridTabs();
    return [];
  };

  const tabs = getTabs();

  return (
    <div className="panel-page">
      <div className="container">
        <header className="panel-header">
          <img src={logoNegro} alt="Laboria " className="panel-logo" />
          <h1>Panel de {isCandidate() ? profile.firstName || user.name : profile.companyName || user.name}</h1>
          <p className="panel-subtitle">
            Gestiona tu cuenta y actividades
          </p>
        </header>

        <div className="panel-content">
          <div className="panel-section">
            <h2>Resumen</h2>
            <div className="panel-grid">
              {tabs.map(tab => (
                <Link key={tab.id} to={tab.link} className="panel-card">
                  <div className="card-icon">{tab.icon}</div>
                  <h3>{tab.label}</h3>
                  <p>Accede a la sección de {tab.label.toLowerCase()}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="panel-stats">
            <h3>Estadísticas Rápidas</h3>
            <div className="stats-grid">
              {isCandidate() && (
                <>
                  <div className="stat-item">
                    <span className="stat-value">0</span>
                    <span className="stat-label">Aplicaciones</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">0</span>
                    <span className="stat-label">Cursos Guardados</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">0</span>
                    <span className="stat-label">Perfil Completado</span>
                  </div>
                </>
              )}
              {isCompanyEmployees() && (
                <>
                  <div className="stat-item">
                    <span className="stat-value">{profile.postedJobs?.length || 0}</span>
                    <span className="stat-label">Ofertas Publicadas</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">0</span>
                    <span className="stat-label">Candidatos</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">0</span>
                    <span className="stat-label">Vistas</span>
                  </div>
                </>
              )}
              {isCompanyStudents() && (
                <>
                  <div className="stat-item">
                    <span className="stat-value">{profile.postedCourses?.length || 0}</span>
                    <span className="stat-label">Cursos Publicados</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">0</span>
                    <span className="stat-label">Estudiantes</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">0</span>
                    <span className="stat-label">Inscripciones</span>
                  </div>
                </>
              )}
              {isCompanyHybrid() && (
                <>
                  <div className="stat-item">
                    <span className="stat-value">{profile.postedJobs?.length || 0}</span>
                    <span className="stat-label">Ofertas</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{profile.postedCourses?.length || 0}</span>
                    <span className="stat-label">Cursos</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">0</span>
                    <span className="stat-label">Total Interacciones</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
