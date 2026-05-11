import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import coursesData from '../../data/courses.json';
import '../compartidos/MyListingsPage.css';

const SavedCoursesPage = () => {
  const { user, isCandidate } = useAuth();
  const [savedCourses, setSavedCourses] = useState([]);

  useEffect(() => {
    if (user && isCandidate()) {
      const savedCoursesData = JSON.parse(localStorage.getItem('user_saved_courses') || '[]');
      const userSavedCourses = savedCoursesData.filter(saved => saved.userId === user.id);
      
      const coursesWithDetails = userSavedCourses.map(saved => {
        const course = coursesData.find(c => c.id === saved.courseId);
        return course ? { ...course, savedDate: saved.savedDate } : null;
      }).filter(Boolean);
      
      setSavedCourses(coursesWithDetails);
    }
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

  const handleRemove = (courseId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este curso de guardados?')) {
      const savedCoursesData = JSON.parse(localStorage.getItem('user_saved_courses') || '[]');
      const updatedSavedCourses = savedCoursesData.filter(saved => !(saved.userId === user.id && saved.courseId === courseId));
      localStorage.setItem('user_saved_courses', JSON.stringify(updatedSavedCourses));
      
      setSavedCourses(savedCourses.filter(course => course.id !== courseId));
      alert('Curso eliminado de guardados');
    }
  };

  return (
    <div className="my-listings-page saved-courses-page">
      <div className="container">
        <header className="listings-header">
          <h1>Cursos Guardados</h1>
          <p className="listings-subtitle">
            Accede a tus cursos favoritos
          </p>
          <Link to="/cursos" className="btn btn-primary">
            Buscar Más Cursos
          </Link>
        </header>

        {savedCourses.length > 0 ? (
          <div className="listings-grid">
            {savedCourses.map(course => (
              <div key={course.id} className="listing-card">
                <div className="listing-header">
                  <h3>{course.title}</h3>
                  {course.certification && (
                    <span className="badge certification">Certificación</span>
                  )}
                </div>
                
                <div className="listing-info">
                  <div className="info-item">
                    <strong>Plataforma:</strong> {course.platform}
                  </div>
                  <div className="info-item">
                    <strong>Nivel:</strong> {course.level}
                  </div>
                  <div className="info-item">
                    <strong>Duración:</strong> {course.duration}
                  </div>
                  <div className="info-item">
                    <strong>Formato:</strong> {course.format}
                  </div>
                  <div className="info-item">
                    <strong>Precio:</strong> {course.price}
                  </div>
                  <div className="info-item">
                    <strong>Guardado:</strong> {course.savedDate}
                  </div>
                </div>

                <div className="listing-stats">
                  <div className="stat">
                    <span className="stat-value">⭐ {course.rating}</span>
                    <span className="stat-label">Rating</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{course.students}</span>
                    <span className="stat-label">Estudiantes</span>
                  </div>
                </div>

                <div className="listing-actions">
                  <Link to={`/cursos/${course.id}`} className="btn btn-secondary">
                    Ver Detalles
                  </Link>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleRemove(course.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-listings">
            <p>No has guardado ningún curso aún.</p>
            <Link to="/cursos" className="btn btn-primary">
              Buscar Cursos y Guardar
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedCoursesPage;
