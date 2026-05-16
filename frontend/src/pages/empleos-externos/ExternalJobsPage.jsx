import React, { useState, useEffect, useCallback } from 'react';
import { externalJobService } from '../../services/externalJobService';
import styles from './ExternalJobsPage.module.css';

const ExternalJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ search: '', workMode: '', contractType: '' });

  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await externalJobService.getJobs({ ...filter, limit: 50 });
      setJobs(data.jobs || []);
    } catch (err) {
      console.error('Error al cargar empleos:', err);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const workModeLabels = { REMOTE: 'Remoto', HYBRID: 'Híbrido', ONSITE: 'Presencial' };

  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <h1>Red de Empleo</h1>
          <p>Ofertas de trabajo escaneadas de portales web, gobierno, cabildos y redes sociales — ámbito nacional español</p>
        </header>

        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Buscar empleos (puesto, empresa, palabras clave)..."
            value={filter.search}
            onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
          />
          <select value={filter.workMode} onChange={e => setFilter(f => ({ ...f, workMode: e.target.value }))}>
            <option value="">Todos los modos</option>
            <option value="REMOTE">Remoto</option>
            <option value="HYBRID">Híbrido</option>
            <option value="ONSITE">Presencial</option>
          </select>
          <select value={filter.contractType} onChange={e => setFilter(f => ({ ...f, contractType: e.target.value }))}>
            <option value="">Todos los contratos</option>
            <option value="INDEFINIDO">Indefinido</option>
            <option value="TEMPORAL">Temporal</option>
            <option value="PRACTICAS">Prácticas</option>
            <option value="AUTONOMO">Autónomo</option>
            <option value="FUNCIONARIO">Funcionario</option>
          </select>
        </div>

        {loading ? (
          <p className={styles.loading}>Cargando empleos...</p>
        ) : (
          <div className={styles.grid}>
            {jobs.map(job => (
              <div key={job.id} className={styles.card}>
                <h3>{job.title}</h3>
                <p className={styles.company}>{job.company}</p>
                <p className={styles.location}>{job.location}</p>
                <p className={styles.description}>{job.description}</p>
                <div className={styles.meta}>
                  <span className={styles.badge}>{workModeLabels[job.workMode] || job.workMode}</span>
                  {job.contractType && <span className={styles.badge}>{job.contractType}</span>}
                  {job.salary && <span className={styles.salary}>{job.salary}</span>}
                </div>
                {job.url && (
                  <a href={job.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    Ver oferta &rarr;
                  </a>
                )}
              </div>
            ))}
            {jobs.length === 0 && (
              <p className={styles.empty}>
                No se encontraron ofertas de empleo. Los administradores pueden escanear fuentes desde el panel de administración.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExternalJobsPage;
