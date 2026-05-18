import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoNegro from '../../assets/img/Laboria_Fondo_Negro.png';
import { getTotalJobsCount, getTotalCoursesCount } from '../../context/ConexionApi';
import Spinner from '../../components/Spinner';
import styles from './Home.module.css';

const Home = () => {
  const [jobsCount, setJobsCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [jobs, courses] = await Promise.all([
          getTotalJobsCount(),
          getTotalCoursesCount(),
        ]);
        setJobsCount(jobs);
        setCoursesCount(courses);
      } catch (error) {
        console.error('Error al obtener los totales:', error);
        // Valores por defecto en caso de error
        setJobsCount(1500);
        setCoursesCount(1850);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className={styles.homePage}>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <img src={logoNegro} alt="Logo Laboria" className={styles.heroLogo} />
          
          <p className={styles.heroSubtitle}>
            Tu portal de empleo y formación profesional en España
          </p>
          <p className={styles.heroDescription}>
            Encuentra tu próximo trabajo o mejora tus habilidades con los mejores cursos del mercado.
          </p>
          <div className={styles.heroActions}>
            <Link to="/empleos" className="btn btn-primary btn-large">
              Buscar Empleo
            </Link>
            <Link to="/cursos" className="btn btn-secondary btn-large">
              Buscar Cursos
            </Link>
          </div>
        </div>
      </header>

      <section className={styles.features}>
        <div className="container">
          <h2 className={styles.sectionTitle}>¿Por qué Laboria?</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💼</div>
              <h3>Empleo</h3>
              <p>
                Miles de ofertas de trabajo en España. Filtra por ubicación, modalidad, salario y más.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📚</div>
              <h3>Formación</h3>
              <p>
                Cursos, bootcamps y certificaciones para mejorar tu perfil profesional.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎯</div>
              <h3>Enfoque Profesional</h3>
              <p>
                Conectamos oportunidades laborales con formación relevante para tu carrera.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.stats}>
        <div className="container">
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{loading ? <Spinner size={24} /> : `${jobsCount}+`}</span>
              <span className={styles.statLabel}>Ofertas de empleo</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{loading ? <Spinner size={24} /> : `${coursesCount}+`}</span>
              <span className={styles.statLabel}>Cursos disponibles</span>
            </div>
            {/* <div className={styles.statItem}>
              <span className={styles.statNumber}>100%</span>
              <span className={styles.statLabel}>En español</span>
            </div> */}
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className="container">
          <h2 className={styles.ctaTitle}>¿Listo para dar el siguiente paso?</h2>
          <p className={styles.ctaSubtitle}>
            Comienza tu búsqueda de empleo o encuentra el curso perfecto para ti.
          </p>
          <div className={styles.ctaActions}>
            <Link to="/empleos" className="btn btn-primary">
              Ver Ofertas de Empleo
            </Link>
            <Link to="/cursos" className="btn btn-secondary">
              Explorar Cursos
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Home;
