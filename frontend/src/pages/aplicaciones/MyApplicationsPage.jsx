import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { applicationService } from '../../services/applicationService';
import { courseApplicationService } from '../../services/courseApplicationService';
import styles from '../compartidos/MyListingsPage.module.css';

const MyApplicationsPage = () => {
  const { user, isCandidate } = useAuth();
  const [applications, setApplications] = useState([]);
  const [courseApps, setCourseApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('jobs');

  useEffect(() => {
    const fetchAll = async () => {
      if (!user || !isCandidate()) return;
      setLoading(true);
      try {
        const [jobsData, coursesData] = await Promise.all([
          applicationService.getMyApplications(),
          courseApplicationService.getMyApplications()
        ]);
        setApplications(Array.isArray(jobsData) ? jobsData : []);
        setCourseApps(Array.isArray(coursesData) ? coursesData : []);
      } catch {
        setApplications([]);
        setCourseApps([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user, isCandidate]);

  if (!user || !isCandidate()) {
    return (
      <div className={styles['my-listings-page'] + ' ' + styles['not-authorized']}>
        <div className="container">
          <h1>No autorizado</h1>
          <p>Esta página es solo para candidatos.</p>
          <Link to="/panel" className="btn btn-primary">Volver al Panel</Link>
        </div>
      </div>
    );
  }

  const handleWithdraw = async (appId) => {
    if (window.confirm('¿Estás seguro de que quieres retirar esta aplicación?')) {
      try {
        await applicationService.cancel(appId);
        setApplications(applications.filter(app => app.id !== appId));
        alert('Aplicación retirada');
      } catch (error) {
        alert('Error al retirar aplicación');
      }
    }
  };

  const handleCancelCourse = async (appId) => {
    if (window.confirm('¿Cancelar inscripción en este curso?')) {
      try {
        await courseApplicationService.cancel(appId);
        setCourseApps(courseApps.filter(a => a.id !== appId));
        alert('Inscripción cancelada');
      } catch {
        alert('Error al cancelar inscripción');
      }
    }
  };

  const renderJobApps = () => (
    <>
      {applications.length > 0 ? (
        <div className={styles['listings-grid']}>
          {applications.map(app => (
            <div key={app.id} className={styles['listing-card']}>
              <div className={styles['listing-header']}>
                <h3>{app.job?.title || 'Empleo'}</h3>
                <span className={`badge ${app.status === 'PENDING' ? 'pending' : app.status === 'ACCEPTED' ? 'accepted' : 'rejected'}`}>
                  {app.status}
                </span>
              </div>
              <div className={styles['listing-info']}>
                <div className={styles['info-item']}><strong>Empresa:</strong> {app.job?.company || 'N/A'}</div>
                <div className={styles['info-item']}><strong>Ubicación:</strong> {app.job?.location || 'N/A'}</div>
                <div className={styles['info-item']}><strong>Aplicado:</strong> {new Date(app.createdAt).toLocaleDateString()}</div>
              </div>
              <div className={styles['listing-actions']}>
                <Link to={`/empleos/${app.job?.id}`} className="btn btn-secondary">Ver Detalles</Link>
                {app.status === 'PENDING' && (
                  <button className={'btn ' + styles['btn-danger']} onClick={() => handleWithdraw(app.id)}>Retirar</button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles['no-listings']}>
          <p>No has aplicado a ofertas de empleo aún.</p>
          <Link to="/empleos" className="btn btn-primary">Buscar Ofertas</Link>
        </div>
      )}
    </>
  );

  const renderCourseApps = () => (
    <>
      {courseApps.length > 0 ? (
        <div className={styles['listings-grid']}>
          {courseApps.map(app => (
            <div key={app.id} className={styles['listing-card']}>
              <div className={styles['listing-header']}>
                <h3>Curso</h3>
                <span className={`badge ${app.status === 'PENDING' ? 'pending' : app.status === 'ACCEPTED' ? 'accepted' : 'rejected'}`}>
                  {app.status}
                </span>
              </div>
              <div className={styles['listing-info']}>
                <div className={styles['info-item']}><strong>ID Curso:</strong> {app.courseId}</div>
                <div className={styles['info-item']}><strong>Inscrito:</strong> {new Date(app.createdAt).toLocaleDateString()}</div>
              </div>
              <div className={styles['listing-actions']}>
                <Link to={`/cursos/${app.courseId}`} className="btn btn-secondary">Ver Curso</Link>
                {app.status === 'PENDING' && (
                  <button className={'btn ' + styles['btn-danger']} onClick={() => handleCancelCourse(app.id)}>Cancelar</button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles['no-listings']}>
          <p>No te has inscrito en ningún curso aún.</p>
          <Link to="/cursos" className="btn btn-primary">Buscar Cursos</Link>
        </div>
      )}
    </>
  );

  return (
    <div className={'my-applications-page ' + styles['my-listings-page']}>
      <div className="container">
        <header className={styles['listings-header']}>
          <h1>Mis Postulaciones</h1>
          <p className={styles['listings-subtitle']}>
            Revisa tus aplicaciones a empleos e inscripciones a cursos
          </p>
        </header>

        <div className={styles['tabs']}>
          <button className={tab === 'jobs' ? styles['tab-active'] : styles['tab']} onClick={() => setTab('jobs')}>
            Empleos ({applications.length})
          </button>
          <button className={tab === 'courses' ? styles['tab-active'] : styles['tab']} onClick={() => setTab('courses')}>
            Cursos ({courseApps.length})
          </button>
        </div>

        {loading ? (
          <div className="loading">Cargando...</div>
        ) : tab === 'jobs' ? renderJobApps() : renderCourseApps()}
      </div>
    </div>
  );
};

export default MyApplicationsPage;
