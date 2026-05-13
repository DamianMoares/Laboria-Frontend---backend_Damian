import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { applicationService } from '../../services/applicationService';
import '../compartidos/MyListingsPage.css';

const MyApplicationsPage = () => {
  const { user, isCandidate } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user || !isCandidate()) return;
      setLoading(true);
      try {
        const data = await applicationService.getMyApplications();
        setApplications(Array.isArray(data) ? data : []);
      } catch (error) {
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
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

        {loading ? (
          <div className="loading">Cargando aplicaciones...</div>
        ) : applications.length > 0 ? (
          <div className="listings-grid">
            {applications.map(app => (
              <div key={app.id} className="listing-card">
                <div className="listing-header">
                  <h3>{app.job?.title || 'Empleo'}</h3>
                  <span className={`badge ${app.status === 'PENDING' ? 'pending' : app.status === 'ACCEPTED' ? 'accepted' : 'rejected'}`}>
                    {app.status}
                  </span>
                </div>
                
                <div className="listing-info">
                  <div className="info-item">
                    <strong>Empresa:</strong> {app.job?.company || 'N/A'}
                  </div>
                  <div className="info-item">
                    <strong>Ubicación:</strong> {app.job?.location || 'N/A'}
                  </div>
                  <div className="info-item">
                    <strong>Mensaje:</strong> {app.message || 'Sin mensaje'}
                  </div>
                  <div className="info-item">
                    <strong>Aplicado:</strong> {new Date(app.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="listing-actions">
                  <Link to={`/empleos/${app.job?.id}`} className="btn btn-secondary">
                    Ver Detalles
                  </Link>
                  {app.status === 'PENDING' && (
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleWithdraw(app.id)}
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
