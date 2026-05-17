import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { courseApplicationService } from '../../services/courseApplicationService';
import coursesData from '../../data/courses.json';
import styles from './CourseDetailPage.module.css';

const CourseDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated, isCandidate } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const foundCourse = coursesData.find(c => c.id === parseInt(id));
    setCourse(foundCourse);

    if (user && isCandidate()) {
      const savedCourses = JSON.parse(localStorage.getItem('user_saved_courses') || '[]');
      const alreadySaved = savedCourses.some(
        saved => saved.userId === user.id && saved.courseId === parseInt(id)
      );
      setIsSaved(alreadySaved);

      courseApplicationService.getMyApplications().then(data => {
        const alreadyApplied = data.some(a => a.courseId === String(id));
        setApplied(alreadyApplied);
      }).catch((err) => {
        console.error('Error al cargar aplicaciones del curso:', err);
      });
    }
  }, [id, user, isCandidate]);

  const handleApply = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!isCandidate()) { toast.error('Solo candidatos pueden inscribirse'); return; }
    setApplying(true);
    try {
      await courseApplicationService.apply(String(id), '');
      setApplied(true);
      toast.success('Inscripción enviada exitosamente');
    } catch (err) {
      toast.error(err.message || 'Error al inscribirse');
    }
    setApplying(false);
  };

  if (!course) {
    return (
      <div className={styles['detail-page'] + ' ' + styles['not-found']}>
        <div className="container">
          <h1>Curso no encontrado</h1>
          <p>El curso que buscas no existe.</p>
          <Link to="/cursos" className="btn btn-primary">
            Volver a cursos
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isCandidate()) {
      toast.error('Solo los candidatos pueden guardar cursos');
      return;
    }

    const savedCourses = JSON.parse(localStorage.getItem('user_saved_courses') || '[]');
    
    if (isSaved) {
      const updatedSavedCourses = savedCourses.filter(
        saved => !(saved.userId === user.id && saved.courseId === course.id)
      );
      localStorage.setItem('user_saved_courses', JSON.stringify(updatedSavedCourses));
      setIsSaved(false);
      toast.success('Curso eliminado de guardados');
    } else {
      const newSavedCourse = {
        userId: user.id,
        courseId: course.id,
        savedDate: new Date().toISOString().split('T')[0]
      };
      savedCourses.push(newSavedCourse);
      localStorage.setItem('user_saved_courses', JSON.stringify(savedCourses));
      setIsSaved(true);
      toast.success('Curso guardado con éxito');
    }
  };

  return (
    <div className={styles['detail-page'] + ' ' + styles['course-detail-page']}>
      <div className="container">
        <Link to="/cursos" className={styles['back-link']}>
          ← Volver a cursos
        </Link>

        <div className={styles['detail-header']}>
          <h1 className={styles['detail-title']}>{course.title}</h1>
          <div className={styles['detail-meta']}>
            <span className={styles['meta-item'] + ' ' + styles['platform']}>{course.platform}</span>
            <span className={styles['meta-item'] + ' ' + styles['instructor']}>Instructor: {course.instructor}</span>
          </div>
        </div>

        <div className={styles['detail-content']}>
          <div className={styles['detail-main']}>
            <section className={styles['detail-section']}>
              <h2>Descripción</h2>
              <p className={styles['description-text']}>{course.description}</p>
            </section>

            <section className={styles['detail-section']}>
              <h2>Competencias adquiridas</h2>
              <ul className={styles['skills-list']}>
                {course.skills.map((skill, index) => (
                  <li key={index} className={styles['skill-item']}>{skill}</li>
                ))}
              </ul>
            </section>

            <section className={styles['detail-section']}>
              <h2>Requisitos previos</h2>
              <ul className={styles['requirements-list']}>
                {course.requirements.map((req, index) => (
                  <li key={index} className={styles['requirement-item']}>{req}</li>
                ))}
              </ul>
            </section>

            <section className={styles['detail-section']}>
              <h2>Estadísticas</h2>
              <div className={styles['stats-grid']}>
                <div className={styles['stat-card']}>
                  <span className={styles['stat-value']}>⭐ {course.rating}</span>
                  <span className={styles['stat-label']}>Rating</span>
                </div>
                <div className={styles['stat-card']}>
                  <span className={styles['stat-value']}>{course.students.toLocaleString()}</span>
                  <span className={styles['stat-label']}>Estudiantes</span>
                </div>
              </div>
            </section>
          </div>

          <aside className={styles['detail-sidebar']}>
            <div className={styles['sidebar-card']}>
              <h3>Información del curso</h3>
              
              <div className={styles['info-row']}>
                <span className={styles['info-label']}>Nivel:</span>
                <span className={styles['info-value']}>{course.level}</span>
              </div>
              
              <div className={styles['info-row']}>
                <span className={styles['info-label']}>Duración:</span>
                <span className={styles['info-value']}>{course.duration}</span>
              </div>
              
              <div className={styles['info-row']}>
                <span className={styles['info-label']}>Formato:</span>
                <span className={styles['info-value']}>{course.format}</span>
              </div>
              
              <div className={styles['info-row']}>
                <span className={styles['info-label']}>Precio:</span>
                <span className={styles['info-value'] + ' ' + styles['price']}>{course.price}</span>
              </div>
              
              <div className={styles['info-row']}>
                <span className={styles['info-label']}>Tecnología:</span>
                <span className={styles['info-value'] + ' ' + styles['technology']}>{course.technology}</span>
              </div>

              <div className={styles['info-row']}>
                <span className={styles['info-label']}>Certificación:</span>
                <span className={styles['info-value']}>
                  {course.certification ? '✓ Incluida' : '✗ No incluida'}
                </span>
              </div>

              {isCandidate() && (
                <>
                  <button 
                    className={styles['btn-save-sidebar'] + (isSaved ? ' ' + styles['saved'] : '')}
                    onClick={handleSave}
                  >
                    {isSaved ? '★ Guardado' : '☆ Guardar Curso'}
                  </button>
                  {applied ? (
                    <button className={styles['btn-applied-sidebar']} disabled>
                      ✓ Inscrito
                    </button>
                  ) : (
                    <button className={styles['btn-enroll-sidebar']} onClick={handleApply} disabled={applying}>
                      {applying ? 'Inscribiendo...' : 'Inscribirme'}
                    </button>
                  )}
                </>
              )}
              <a 
                href={course.externalLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles['btn-enroll-sidebar']}
              >
                Ver curso en {course.platform}
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
