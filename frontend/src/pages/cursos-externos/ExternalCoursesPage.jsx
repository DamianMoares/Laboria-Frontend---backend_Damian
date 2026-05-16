import React, { useState, useEffect, useCallback } from 'react';
import { externalCourseService } from '../../services/externalCourseService';
import styles from './ExternalCoursesPage.module.css';

const ExternalCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ search: '', priceType: '' });
  const [sources, setSources] = useState([]);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await externalCourseService.getCourses({ ...filter, limit: 50 });
      setCourses(data.courses || []);
    } catch (err) {
      console.error('Error al cargar cursos:', err);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    externalCourseService.getSources().then(data => setSources(data.sources || [])).catch(() => {});
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <h1>Red de Cursos</h1>
          <p>Cursos escaneados de plataformas, gobierno y portales web — gratuitos y de pago</p>
        </header>

        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Buscar cursos..."
            value={filter.search}
            onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
          />
          <select value={filter.priceType} onChange={e => setFilter(f => ({ ...f, priceType: e.target.value }))}>
            <option value="">Todos los precios</option>
            <option value="FREE">Gratuitos</option>
            <option value="PAID">De pago</option>
          </select>
        </div>

        {loading ? (
          <p className={styles.loading}>Cargando cursos...</p>
        ) : (
          <div className={styles.grid}>
            {courses.map(course => (
              <div key={course.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>{course.title}</h3>
                  <span className={`${styles.badge} ${styles[course.priceType?.toLowerCase()]}`}>
                    {course.price}
                  </span>
                </div>
                <p className={styles.provider}>{course.provider}</p>
                <p className={styles.description}>{course.description}</p>
                <div className={styles.meta}>
                  <span>Fuente: {course.source}</span>
                  {course.duration && <span>{course.duration}</span>}
                  <span>Nivel: {course.level}</span>
                </div>
                {course.url && (
                  <a href={course.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    Ver curso &rarr;
                  </a>
                )}
              </div>
            ))}
            {courses.length === 0 && (
              <p className={styles.empty}>
                No se encontraron cursos. Los administradores pueden escanear fuentes desde el panel de administración.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExternalCoursesPage;
