import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import jobsData from '../../data/jobs.json';
import '../compartidos/MyListingsPage.css';

const MyApplicationsPage = () => {
  const { user, isCandidate } = useAuth();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (user && isCandidate()) {
      const savedApplications = JSON.parse(localStorage.getItem('user_applications') || '[]');
      const userApplications = savedApplications.filter(app => app.userId === user.id);
      
      const jobsWithDetails = userApplications.map(app => {
        const job = jobsData.find(j => j.id === app.jobId);
        return job ? { ...job, applicationDate: app.applicationDate, status: app.status } : null;
      }).filter(Boolean);
      
      setApplications(jobsWithDetails);
    }
  }, [user, isCandidate]);

  if (!user || !isCandidate()) {
    return (
      <div className="my-listings-page not-authorized">
        <div className="container">
          <h1>No autorizado</h1>
          <p>Esta página es solo para candidatos.</p>
          <Link to="/panel" className="btn btn-primary">Volver al Panel</Link>
        </div>
      </div>
    );
  }

  const handleWithdraw = (jobId) => {
    if (window.confirm('¿Estás seguro de que quieres retirar esta aplicación?')) {
      const savedApplications = JSON.parse(localStorage.getItem('user_applications') || '[]');
      const updatedApplications = savedApplications.filter(app => !(app.userId === user.id && app.jobId === jobId));
      localStorage.setItem('user_applications', JSON.stringify(updatedApplications));
      
      setApplications(applications.filter(app => app.id !== jobId));
      alert('Aplicación retirada (simulado)');
    }
  };

  return (
    <div className="my-applications-page my-listings-page">
      <div className="container">
        <header className="listings-header">
          <h1>Mis Aplicaciones</h1>
          <p className="listings-subtitle">
            Revisa las ofertas de empleo a las que has aplicado
          </p>
          <Link to="/empleos" className="btn btn-primary">
            Buscar Más Ofertas
          </Link>
        </header>

        {applications.length > 0 ? (
          <div className="listings-grid">
            {applications.map(job => (
              <div key={job.id} className="listing-card">
                <div className="listing-header">
                  <h3>{job.title}</h3>
                  <span className={`badge ${job.status === 'pendiente' ? 'pending' : job.status === 'aceptada' ? 'accepted' : 'rejected'}`}>
                    {job.status}
                  </span>
                </div>
                
                <div className="listing-info">
                  <div className="info-item">
                    <strong>Empresa:</strong> {job.company}
                  </div>
                  <div className="info-item">
                    <strong>Ubicación:</strong> {job.location}
                  </div>
                  <div className="info-item">
                    <strong>Modalidad:</strong> {job.workMode}
                  </div>
                  <div className="info-item">
                    <strong>Salario:</strong> {job.salary}
                  </div>
                  <div className="info-item">
                    <strong>Aplicado:</strong> {job.applicationDate}
                  </div>
                </div>

                <div className="listing-actions">
                  <Link to={`/empleos/${job.id}`} className="btn btn-secondary">
                    Ver Detalles
                  </Link>
                  {job.status === 'pendiente' && (
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleWithdraw(job.id)}
                    >
                      Retirar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-listings">
            <p>No has aplicado a ninguna oferta de empleo aún.</p>
            <Link to="/empleos" className="btn btn-primary">
              Buscar Ofertas y Aplicar
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplicationsPage;
