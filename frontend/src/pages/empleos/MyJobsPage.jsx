import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobService } from '../../services/jobService';
import '../compartidos/MyListingsPage.css';

const MyJobsPage = () => {
  const { user, isCompanyEmployees, isCompanyHybrid } = useAuth();
  const [postedJobs, setPostedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const data = await jobService.getAll();
        setPostedJobs(Array.isArray(data) ? data.filter(j => j.authorId === user.id) : []);
      } catch (error) {
        setPostedJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
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

  const handleDelete = async (jobId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta oferta?')) {
      try {
        await jobService.delete(jobId);
        setPostedJobs(postedJobs.filter(job => job.id !== jobId));
        alert('Oferta eliminada');
      } catch (error) {
        alert('Error al eliminar oferta');
      }
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

        {loading ? (
          <div className="loading">Cargando ofertas...</div>
        ) : postedJobs.length > 0 ? (
          <div className="listings-grid">
            {postedJobs.map(job => (
              <div key={job.id} className="listing-card">
                <div className="listing-header">
                  <h3>{job.title}</h3>
                  <span className="listing-date">{new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="listing-info">
                  <div className="info-item">
                    <strong>Empresa:</strong> {job.company}
                  </div>
                  <div className="info-item">
                    <strong>Ubicación:</strong> {job.location}
                  </div>
                  <div className="info-item">
                    <strong>Modalidad:</strong> {job.mode}
                  </div>
                  <div className="info-item">
                    <strong>Categoría:</strong> {job.category}
                  </div>
                  <div className="info-item">
                    <strong>Salario:</strong> {job.salary || 'No especificado'}
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
