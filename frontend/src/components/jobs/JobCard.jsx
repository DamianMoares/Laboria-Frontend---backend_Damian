import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './JobCard.css';

const JobCard = ({ job }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  // Limpiar etiquetas HTML del texto
  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Obtener descripción limpia
  const cleanDescription = job.description ? stripHtml(job.description) : 'Sin descripción disponible';

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="job-title-section">
          <Link to={`/empleos/${job.id}`} className="job-title">
            {job.title}
          </Link>
          {job.source && (
            <span className="source-badge">{job.source}</span>
          )}
        </div>
        <span className="company-name">{job.company}</span>
      </div>
      
      <div className="job-card-body">
        <div className="job-info-grid-compact">
          <div className="info-item">
            <span className="info-label">📍 Ubicación</span>
            <span className="info-value">{job.location}</span>
          </div>
          <div className="info-item">
            <span className="info-label">💼 Modalidad</span>
            <span className="info-value">{job.workMode}</span>
          </div>
          <div className="info-item">
            <span className="info-label">💰 Salario</span>
            <span className="info-value">{job.salary}</span>
          </div>
          <div className="info-item">
            <span className="info-label">⏰ Jornada</span>
            <span className="info-value">{job.schedule}</span>
          </div>
        </div>
        
        <button 
          className="btn-toggle-details"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
          <span className={`arrow ${showDetails ? 'up' : 'down'}`}>▼</span>
        </button>
        
        {showDetails && (
          <div className="job-details">
            <div className="detail-section">
              <h4>Descripción</h4>
              <p>{cleanDescription}</p>
            </div>
            
            {job.requirements && job.requirements.length > 0 && (
              <div className="detail-section">
                <h4>Requisitos</h4>
                <ul>
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {job.benefits && job.benefits.length > 0 && (
              <div className="detail-section">
                <h4>Beneficios</h4>
                <ul>
                  {job.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="detail-section">
              <h4>Información adicional</h4>
              <div className="additional-info">
                <div className="info-row">
                  <span className="label">Nivel:</span>
                  <span className="value">{job.experienceLevel}</span>
                </div>
                <div className="info-row">
                  <span className="label">Contrato:</span>
                  <span className="value">{job.contractType}</span>
                </div>
                <div className="info-row">
                  <span className="label">Sector:</span>
                  <span className="value">{job.sector}</span>
                </div>
                {job.technology && job.technology !== 'No especificado' && (
                  <div className="info-row">
                    <span className="label">Tecnología:</span>
                    <span className="value">{job.technology}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="job-card-footer">
        <span className="posted-date">📅 Publicado: {formatDate(job.postedDate)}</span>
        <a href={job.url} target="_blank" rel="noopener noreferrer" className="btn-apply">
          Aplicar
        </a>
      </div>
    </div>
  );
};

export default JobCard;
