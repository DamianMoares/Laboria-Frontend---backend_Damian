import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import jobsData from '../../data/jobs.json';
import coursesData from '../../data/courses.json';
import styles from './ProfilePage.module.css';

const CompanyProfilePage = () => {
  const { user, logout, isAnyCompany, isCompanyEmployees, isCompanyStudents, isCompanyHybrid } = useAuth();

  if (!user || !isAnyCompany()) {
    return (
      <div className={styles['profile-page'] + ' ' + styles['not-authorized']}>
        <div className="container">
          <h1>No autorizado</h1>
          <p>Esta página es solo para empresas.</p>
          <Link to="/" className="btn btn-primary">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  const profile = JSON.parse(localStorage.getItem(`profile_${user.id}`) || 'null') || user.profile || {};
  const focus = profile.focus || '';

  // Get posted jobs and courses based on IDs
  const postedJobs = profile.postedJobs 
    ? jobsData.filter(job => profile.postedJobs.includes(job.id))
    : [];
  
  const postedCourses = profile.postedCourses
    ? coursesData.filter(course => profile.postedCourses.includes(course.id))
    : [];

  return (
    <div className={styles['profile-page'] + ' company-profile-page'}>
      <div className="container">
        <header className={styles['profile-header']}>
          <div className={styles['profile-header-content']}>
            <div className={styles['profile-avatar'] + ' ' + styles['company']}>
              {profile.companyName ? profile.companyName[0] : user.name[0]}
            </div>
            <div className={styles['profile-info']}>
              <h1>{profile.companyName || user.name}</h1>
              <p className={styles['profile-email']}>{profile.email}</p>
              <p className={styles['profile-location']}>{profile.location}</p>
              <div className={styles['company-badges']}>
                <span className={styles['badge']}>{focus === 'híbrido' ? 'Híbrida' : focus === 'empleados' ? 'Empleados' : 'Estudiantes'}</span>
                <span className={styles['badge']}>{profile.industry}</span>
              </div>
            </div>
          </div>
          <button className="btn btn-secondary" onClick={logout}>
            Cerrar Sesión
          </button>
        </header>

        <div className={styles['profile-content']}>
          <div className={styles['profile-main']}>
            <section className={styles['profile-section']}>
              <h2>Información de la Empresa</h2>
              <div className={styles['info-grid']}>
                <div className={styles['info-item']}>
                  <span className={styles['info-label']}>Email:</span>
                  <span className={styles['info-value']}>{profile.email}</span>
                </div>
                <div className={styles['info-item']}>
                  <span className={styles['info-label']}>Teléfono:</span>
                  <span className={styles['info-value']}>{profile.phone || 'No especificado'}</span>
                </div>
                <div className={styles['info-item']}>
                  <span className={styles['info-label']}>Ubicación:</span>
                  <span className={styles['info-value']}>{profile.location}</span>
                </div>
                <div className={styles['info-item']}>
                  <span className={styles['info-label']}>Industria:</span>
                  <span className={styles['info-value']}>{profile.industry}</span>
                </div>
                <div className={styles['info-item']}>
                  <span className={styles['info-label']}>Tamaño:</span>
                  <span className={styles['info-value']}>{profile.size || 'No especificado'}</span>
                </div>
                <div className={styles['info-item']}>
                  <span className={styles['info-label']}>Sitio web:</span>
                  {profile.website ? (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className={styles['info-value'] + ' ' + styles['link']}>
                      {profile.website}
                    </a>
                  ) : (
                    <span className={styles['info-value']}>No especificado</span>
                  )}
                </div>
              </div>
            </section>

            <section className={styles['profile-section']}>
              <h2>Descripción</h2>
              <p className={styles['bio-text']}>{profile.description || 'No hay descripción'}</p>
            </section>

            {(isCompanyEmployees() || isCompanyHybrid()) && (
              <section className={styles['profile-section']}>
                <h2>Ofertas de Empleo Publicadas</h2>
                {postedJobs.length > 0 ? (
                  <div className={styles['posted-items']}>
                    {postedJobs.map(job => (
                      <Link key={job.id} to={`/empleos/${job.id}`} className={styles['posted-item']}>
                        <span className={styles['posted-item-title']}>{job.title}</span>
                        <span className={styles['posted-item-meta']}>{job.location} • {job.salary}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className={styles['no-data']}>No hay ofertas publicadas</p>
                )}
                <button className={styles['mt-md'] + ' btn btn-secondary'}>Publicar nueva oferta</button>
              </section>
            )}

            {(isCompanyStudents() || isCompanyHybrid()) && (
              <section className={styles['profile-section']}>
                <h2>Cursos Publicados</h2>
                {postedCourses.length > 0 ? (
                  <div className={styles['posted-items']}>
                    {postedCourses.map(course => (
                      <Link key={course.id} to={`/cursos/${course.id}`} className={styles['posted-item']}>
                        <span className={styles['posted-item-title']}>{course.title}</span>
                        <span className={styles['posted-item-meta']}>{course.platform} • {course.price}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className={styles['no-data']}>No hay cursos publicados</p>
                )}
                <button className={styles['mt-md'] + ' btn btn-secondary'}>Publicar nuevo curso</button>
              </section>
            )}
          </div>

          <aside className={styles['profile-sidebar']}>
            <div className={styles['sidebar-card']}>
              <h3>Estadísticas</h3>
              <div className={styles['stat-item']}>
                <span className={styles['stat-value']}>{postedJobs.length}</span>
                <span className={styles['stat-label']}>Ofertas publicadas</span>
              </div>
              <div className={styles['stat-item']}>
                <span className={styles['stat-value']}>{postedCourses.length}</span>
                <span className={styles['stat-label']}>Cursos publicados</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

    </div>
  );
};

export default CompanyProfilePage;
