import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './JobCard.module.css';

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
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<body>${html}</body>`, 'text/html');
    return doc.body.textContent || '';
  };

  // Obtener descripción limpia
  const cleanDescription = job.description ? stripHtml(job.description) : 'Sin descripción disponible';

  return (
    <div className={styles['job-card']}>
      <div className={styles['job-card-header']}>
        <div className={styles['job-title-section']}>
          <Link to={`/empleos/${job.id}`} className={styles['job-title']}>
            {job.title}
          </Link>
          {job.source && (
            <span className={styles['source-badge']}>{job.source}</span>
          )}
        </div>
        <span className={styles['company-name']}>{job.company}</span>
      </div>
      
      <div className={styles['job-card-body']}>
        <div className={styles['job-info-grid-compact']}>
          <div className={styles['info-item']}>
            <span className={styles['info-label']}>📍 Ubicación</span>
            <span className={styles['info-value']}>{job.location}</span>
          </div>
          <div className={styles['info-item']}>
            <span className={styles['info-label']}>💼 Modalidad</span>
            <span className={styles['info-value']}>{job.workMode}</span>
          </div>
          <div className={styles['info-item']}>
            <span className={styles['info-label']}>💰 Salario</span>
            <span className={styles['info-value']}>{job.salary}</span>
          </div>
          <div className={styles['info-item']}>
            <span className={styles['info-label']}>⏰ Jornada</span>
            <span className={styles['info-value']}>{job.schedule}</span>
          </div>
        </div>
        
        <button 
          className={styles['btn-toggle-details']}
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
          <span className={styles['arrow'] + ' ' + (showDetails ? styles['up'] : styles['down'])}>▼</span>
        </button>
        
        {showDetails && (
          <div className={styles['job-details']}>
            <div className={styles['detail-section']}>
              <h4>Descripción</h4>
              <p>{cleanDescription}</p>
            </div>
            
            {job.requirements && job.requirements.length > 0 && (
              <div className={styles['detail-section']}>
                <h4>Requisitos</h4>
                <ul>
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {job.benefits && job.benefits.length > 0 && (
              <div className={styles['detail-section']}>
                <h4>Beneficios</h4>
                <ul>
                  {job.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className={styles['detail-section']}>
              <h4>Información adicional</h4>
              <div className={styles['additional-info']}>
                <div className={styles['info-row']}>
                  <span className={styles['label']}>Nivel:</span>
                  <span className={styles['value']}>{job.experienceLevel}</span>
                </div>
                <div className={styles['info-row']}>
                  <span className={styles['label']}>Contrato:</span>
                  <span className={styles['value']}>{job.contractType}</span>
                </div>
                <div className={styles['info-row']}>
                  <span className={styles['label']}>Sector:</span>
                  <span className={styles['value']}>{job.sector}</span>
                </div>
                {job.technology && job.technology !== 'No especificado' && (
                  <div className={styles['info-row']}>
                    <span className={styles['label']}>Tecnología:</span>
                    <span className={styles['value']}>{job.technology}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className={styles['job-card-footer']}>
        <span className={styles['posted-date']}>📅 Publicado: {formatDate(job.postedDate)}</span>
        <a href={job.url} target="_blank" rel="noopener noreferrer" className={styles['btn-apply']}>
          Aplicar
        </a>
      </div>
    </div>
  );
};

export default JobCard;
