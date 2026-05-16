import React, { useState, useEffect, useCallback } from 'react';
import { externalJobService } from '../../services/externalJobService';
import styles from './AdminScraper.module.css';

const AdminJobScraper = () => {
  const [sources, setSources] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [scraping, setScraping] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ search: '', source: '', workMode: '', contractType: '' });

  const loadJobs = useCallback(async () => {
    try {
      const data = await externalJobService.getJobs(filter);
      setJobs(data.jobs || []);
    } catch (err) {
      setError('Error al cargar empleos escaneados');
    }
  }, [filter]);

  useEffect(() => {
    externalJobService.getSources().then(data => setSources(data.sources || [])).catch(() => {});
    loadJobs();
  }, [loadJobs]);

  const handleRunAll = async () => {
    setScraping(true);
    setMessage(null);
    setError(null);
    try {
      const result = await externalJobService.runAll();
      setMessage(`Escaneo completado: ${result.results.map(r => `${r.source}: ${r.saved} guardados`).join(', ')}`);
      loadJobs();
    } catch (err) {
      setError('Error al ejecutar escaneo');
    }
    setScraping(false);
  };

  const handleRunSource = async (name) => {
    setScraping(true);
    setMessage(null);
    setError(null);
    try {
      const result = await externalJobService.runSource(name);
      setMessage(`"${name}": ${result.saved} empleos guardados`);
      loadJobs();
    } catch (err) {
      setError(`Error al escanear "${name}"`);
    }
    setScraping(false);
  };

  const workModeLabels = { REMOTE: 'Remoto', HYBRID: 'Híbrido', ONSITE: 'Presencial' };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Escáner de Empleos</h1>
        <p>Escanea ofertas de empleo de fuentes externas (gobierno, cabildos, portales, redes sociales)</p>
      </header>

      {message && <div className={styles.success}>{message}</div>}
      {error && <div className={styles.error}>{error}</div>}

      <section className={styles.section}>
        <h2>Fuentes disponibles</h2>
        <div className={styles.sourcesGrid}>
          {sources.map(source => (
            <div key={source.name} className={styles.sourceCard}>
              <h3>{source.name}</h3>
              <p>{source.description}</p>
              <a href={source.url} target="_blank" rel="noopener noreferrer">Visitar fuente</a>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleRunSource(source.name)}
                disabled={scraping}
              >
                Escanear esta fuente
              </button>
            </div>
          ))}
        </div>
        <button className="btn btn-primary" onClick={handleRunAll} disabled={scraping}>
          {scraping ? 'Escaneando...' : 'Escanear todas las fuentes'}
        </button>
      </section>

      <section className={styles.section}>
        <h2>Empleos escaneados ({jobs.length})</h2>

        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Buscar empleos..."
            value={filter.search}
            onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
          />
          <select value={filter.source} onChange={e => setFilter(f => ({ ...f, source: e.target.value }))}>
            <option value="">Todas las fuentes</option>
            {sources.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>
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

        <div className={styles.coursesGrid}>
          {jobs.map(job => (
            <div key={job.id} className={styles.courseCard}>
              <div className={styles.courseHeader}>
                <h3>{job.title}</h3>
              </div>
              <p className={styles.provider}>{job.company} — {job.location}</p>
              <p className={styles.description}>{job.description}</p>
              <div className={styles.meta}>
                <span>Fuente: {job.source}</span>
                <span>Modo: {workModeLabels[job.workMode] || job.workMode}</span>
                {job.contractType && <span>Contrato: {job.contractType}</span>}
                {job.salary && <span>Salario: {job.salary}</span>}
              </div>
              {job.url && (
                <a href={job.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                  Ver oferta original
                </a>
              )}
            </div>
          ))}
          {jobs.length === 0 && <p className={styles.empty}>No hay empleos escaneados. Usa el escáner para buscar ofertas.</p>}
        </div>
      </section>
    </div>
  );
};

export default AdminJobScraper;
