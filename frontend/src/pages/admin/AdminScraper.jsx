import React, { useState, useEffect, useCallback } from 'react';
import { externalCourseService } from '../../services/externalCourseService';
import styles from './AdminScraper.module.css';

const AdminScraper = () => {
  const [sources, setSources] = useState([]);
  const [courses, setCourses] = useState([]);
  const [scraping, setScraping] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ search: '', source: '', priceType: '' });

  const loadCourses = useCallback(async () => {
    try {
      const data = await externalCourseService.getCourses(filter);
      setCourses(data.courses || []);
    } catch (err) {
      setError('Error al cargar cursos escaneados');
    }
  }, [filter]);

  useEffect(() => {
    externalCourseService.getSources().then(data => setSources(data.sources || [])).catch(() => {});
    loadCourses();
  }, [loadCourses]);

  const handleRunAll = async () => {
    setScraping(true);
    setMessage(null);
    setError(null);
    try {
      const result = await externalCourseService.runAll();
      setMessage(`Escaneo completado: ${result.results.map(r => `${r.source}: ${r.saved} guardados`).join(', ')}`);
      loadCourses();
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
      const result = await externalCourseService.runSource(name);
      setMessage(`"${name}": ${result.saved} cursos guardados`);
      loadCourses();
    } catch (err) {
      setError(`Error al escanear "${name}"`);
    }
    setScraping(false);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Escáner de Cursos</h1>
        <p>Escanea y gestiona cursos de fuentes externas</p>
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
        <h2>Cursos escaneados ({courses.length})</h2>

        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Buscar cursos..."
            value={filter.search}
            onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
          />
          <select value={filter.source} onChange={e => setFilter(f => ({ ...f, source: e.target.value }))}>
            <option value="">Todas las fuentes</option>
            {sources.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>
          <select value={filter.priceType} onChange={e => setFilter(f => ({ ...f, priceType: e.target.value }))}>
            <option value="">Todos los precios</option>
            <option value="FREE">Gratuitos</option>
            <option value="PAID">De pago</option>
            <option value="FREEMIUM">Freemium</option>
          </select>
        </div>

        <div className={styles.coursesGrid}>
          {courses.map(course => (
            <div key={course.id} className={styles.courseCard}>
              <div className={styles.courseHeader}>
                <h3>{course.title}</h3>
                <span className={`${styles.badge} ${styles[course.priceType?.toLowerCase()]}`}>
                  {course.price}
                </span>
              </div>
              <p className={styles.provider}>{course.provider}</p>
              <p className={styles.description}>{course.description}</p>
              <div className={styles.meta}>
                <span>Fuente: {course.source}</span>
                {course.duration && <span>Duración: {course.duration}</span>}
                <span>Nivel: {course.level}</span>
              </div>
              {course.url && (
                <a href={course.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                  Ver curso original
                </a>
              )}
            </div>
          ))}
          {courses.length === 0 && <p className={styles.empty}>No hay cursos escaneados. Usa el escáner para buscar cursos.</p>}
        </div>
      </section>
    </div>
  );
};

export default AdminScraper;
