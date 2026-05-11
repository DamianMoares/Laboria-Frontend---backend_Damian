import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import coursesData from '../../data/courses.json';
import './CourseDetailPage.css';

const CourseDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated, isCandidate } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const foundCourse = coursesData.find(c => c.id === parseInt(id));
    setCourse(foundCourse);

    // Check if user has already saved this course
    if (user && isCandidate()) {
      const savedCourses = JSON.parse(localStorage.getItem('user_saved_courses') || '[]');
      const alreadySaved = savedCourses.some(
        saved => saved.userId === user.id && saved.courseId === parseInt(id)
      );
      setIsSaved(alreadySaved);
    }
  }, [id, user, isCandidate]);

  if (!course) {
    return (
      <div className="detail-page not-found">
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
      alert('Solo los candidatos pueden guardar cursos');
      return;
    }

    const savedCourses = JSON.parse(localStorage.getItem('user_saved_courses') || '[]');
    
    if (isSaved) {
      // Remove from saved
      const updatedSavedCourses = savedCourses.filter(
        saved => !(saved.userId === user.id && saved.courseId === course.id)
      );
      localStorage.setItem('user_saved_courses', JSON.stringify(updatedSavedCourses));
      setIsSaved(false);
      alert('Curso eliminado de guardados');
    } else {
      // Add to saved
      const newSavedCourse = {
        userId: user.id,
        courseId: course.id,
        savedDate: new Date().toISOString().split('T')[0]
      };
      savedCourses.push(newSavedCourse);
      localStorage.setItem('user_saved_courses', JSON.stringify(savedCourses));
      setIsSaved(true);
      alert('Curso guardado con éxito');
    }
  };

  return (
    <div className="detail-page course-detail-page">
      <div className="container">
        <Link to="/cursos" className="back-link">
          ← Volver a cursos
        </Link>

        <div className="detail-header">
          <h1 className="detail-title">{course.title}</h1>
          <div className="detail-meta">
            <span className="meta-item platform">{course.platform}</span>
            <span className="meta-item instructor">Instructor: {course.instructor}</span>
          </div>
        </div>

        <div className="detail-content">
          <div className="detail-main">
            <section className="detail-section">
              <h2>Descripción</h2>
              <p className="description-text">{course.description}</p>
            </section>

            <section className="detail-section">
              <h2>Competencias adquiridas</h2>
              <ul className="skills-list">
                {course.skills.map((skill, index) => (
                  <li key={index} className="skill-item">{skill}</li>
                ))}
              </ul>
            </section>

            <section className="detail-section">
              <h2>Requisitos previos</h2>
              <ul className="requirements-list">
                {course.requirements.map((req, index) => (
                  <li key={index} className="requirement-item">{req}</li>
                ))}
              </ul>
            </section>

            <section className="detail-section">
              <h2>Estadísticas</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-value">⭐ {course.rating}</span>
                  <span className="stat-label">Rating</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{course.students.toLocaleString()}</span>
                  <span className="stat-label">Estudiantes</span>
                </div>
              </div>
            </section>
          </div>

          <aside className="detail-sidebar">
            <div className="sidebar-card">
              <h3>Información del curso</h3>
              
              <div className="info-row">
                <span className="info-label">Nivel:</span>
                <span className="info-value">{course.level}</span>
              </div>
              
              <div className="info-row">
                <span className="info-label">Duración:</span>
                <span className="info-value">{course.duration}</span>
              </div>
              
              <div className="info-row">
                <span className="info-label">Formato:</span>
                <span className="info-value">{course.format}</span>
              </div>
              
              <div className="info-row">
                <span className="info-label">Precio:</span>
                <span className="info-value price">{course.price}</span>
              </div>
              
              <div className="info-row">
                <span className="info-label">Tecnología:</span>
                <span className="info-value technology">{course.technology}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Certificación:</span>
                <span className="info-value">
                  {course.certification ? '✓ Incluida' : '✗ No incluida'}
                </span>
              </div>

              {isCandidate() && (
                <button 
                  className={`btn-save-sidebar ${isSaved ? 'saved' : ''}`}
                  onClick={handleSave}
                >
                  {isSaved ? '★ Guardado' : '☆ Guardar Curso'}
                </button>
              )}
              <a 
                href={course.externalLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-enroll-sidebar"
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
