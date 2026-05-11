import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import jobsData from '../../data/jobs.json';
import '../compartidos/MyListingsPage.css';

const MyJobsPage = () => {
  const { user, isCompanyEmployees, isCompanyHybrid } = useAuth();
  const [postedJobs, setPostedJobs] = useState([]);

  useEffect(() => {
    if (user && user.profile) {
      // Get jobs from user profile
      const profileJobs = user.profile.postedJobs || [];
      const jobsFromProfile = jobsData.filter(job => profileJobs.includes(job.id));
      
      // Get jobs from localStorage (newly posted)
      const localStorageJobs = JSON.parse(localStorage.getItem('posted_jobs') || '[]');
      const companyJobs = localStorageJobs.filter(job => job.company === user.profile.companyName);
      
      setPostedJobs([...jobsFromProfile, ...companyJobs]);
    }
  }, [user]);

  if (!user || (!isCompanyEmployees() && !isCompanyHybrid())) {
    return (
      <div className="my-listings-page not-authorized">
        <div className="container">
          <h1>No autorizado</h1>
          <p>Esta página es solo para empresas que publican ofertas de empleo.</p>
          <Link to="/panel" className="btn btn-primary">Volver al Panel</Link>
        </div>
      </div>
    );
  }

  const handleDelete = (jobId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta oferta?')) {
      const updatedJobs = postedJobs.filter(job => job.id !== jobId);
      setPostedJobs(updatedJobs);
      
      // Remove from localStorage
      const localStorageJobs = JSON.parse(localStorage.getItem('posted_jobs') || '[]');
      const updatedLocalStorageJobs = localStorageJobs.filter(job => job.id !== jobId);
      localStorage.setItem('posted_jobs', JSON.stringify(updatedLocalStorageJobs));
      
      alert('Oferta eliminada (simulado)');
    }
  };

  return (
    <div className="my-jobs-page my-listings-page">
      <div className="container">
        <header className="listings-header">
          <h1>Mis Ofertas de Empleo</h1>
          <p className="listings-subtitle">
            Gestiona las ofertas de empleo que has publicado
          </p>
          <Link to="/publicar-oferta" className="btn btn-primary">
            Publicar Nueva Oferta
          </Link>
        </header>

        {postedJobs.length > 0 ? (
          <div className="listings-grid">
            {postedJobs.map(job => (
              <div key={job.id} className="listing-card">
                <div className="listing-header">
                  <h3>{job.title}</h3>
                  <span className="listing-date">{job.postedDate}</span>
                </div>
                
                <div className="listing-info">
                  <div className="info-item">
                    <strong>Ubicación:</strong> {job.location}
                  </div>
                  <div className="info-item">
                    <strong>Modalidad:</strong> {job.workMode}
                  </div>
                  <div className="info-item">
                    <strong>Jornada:</strong> {job.schedule}
                  </div>
                  <div className="info-item">
                    <strong>Nivel:</strong> {job.experienceLevel}
                  </div>
                  <div className="info-item">
                    <strong>Salario:</strong> {job.salary}
                  </div>
                  <div className="info-item">
                    <strong>Tecnología:</strong> {job.technology}
                  </div>
                </div>

                <div className="listing-stats">
                  <div className="stat">
                    <span className="stat-value">0</span>
                    <span className="stat-label">Aplicaciones</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">0</span>
                    <span className="stat-label">Vistas</span>
                  </div>
                </div>

                <div className="listing-actions">
                  <Link to={`/empleos/${job.id}`} className="btn btn-secondary">
                    Ver Detalles
                  </Link>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(job.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-listings">
            <p>No has publicado ninguna oferta de empleo aún.</p>
            <Link to="/publicar-oferta" className="btn btn-primary">
              Publicar Tu Primera Oferta
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobsPage;
