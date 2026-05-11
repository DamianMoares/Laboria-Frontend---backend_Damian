import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import coursesData from '../../data/courses.json';
import '../compartidos/MyListingsPage.css';

const MyCoursesPage = () => {
  const { user, isCompanyStudents, isCompanyHybrid } = useAuth();
  const [postedCourses, setPostedCourses] = useState([]);

  useEffect(() => {
    if (user && user.profile) {
      const profileCourses = user.profile.postedCourses || [];
      const coursesFromProfile = coursesData.filter(course => profileCourses.includes(course.id));
      
      const localStorageCourses = JSON.parse(localStorage.getItem('posted_courses') || '[]');
      const companyCourses = localStorageCourses.filter(course => course.platform === user.profile.companyName);
      
      setPostedCourses([...coursesFromProfile, ...companyCourses]);
    }
  }, [user]);

  if (!user || (!isCompanyStudents() && !isCompanyHybrid())) {
    return (
      <div className="my-listings-page not-authorized">
        <div className="container">
          <h1>No autorizado</h1>
          <p>Esta página es solo para empresas que publican cursos.</p>
          <Link to="/panel" className="btn btn-primary">Volver al Panel</Link>
        </div>
      </div>
    );
  }

  const handleDelete = (courseId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este curso?')) {
      const updatedCourses = postedCourses.filter(course => course.id !== courseId);
      setPostedCourses(updatedCourses);
      
      const localStorageCourses = JSON.parse(localStorage.getItem('posted_courses') || '[]');
      const updatedLocalStorageCourses = localStorageCourses.filter(course => course.id !== courseId);
      localStorage.setItem('posted_courses', JSON.stringify(updatedLocalStorageCourses));
      
      alert('Curso eliminado (simulado)');
    }
  };

  return (
    <div className="my-courses-page my-listings-page">
      <div className="container">
        <header className="listings-header">
          <h1>Mis Cursos</h1>
          <p className="listings-subtitle">
            Gestiona los cursos que has publicado
          </p>
          <Link to="/publicar-curso" className="btn btn-primary">
            Publicar Nuevo Curso
          </Link>
        </header>

        {postedCourses.length > 0 ? (
          <div className="listings-grid">
            {postedCourses.map(course => (
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
                    <strong>Tecnología:</strong> {course.technology}
                  </div>
                </div>

                <div className="listing-stats">
                  <div className="stat">
                    <span className="stat-value">{course.students}</span>
                    <span className="stat-label">Estudiantes</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">⭐ {course.rating}</span>
                    <span className="stat-label">Rating</span>
                  </div>
                </div>

                <div className="listing-actions">
                  <Link to={`/cursos/${course.id}`} className="btn btn-secondary">
                    Ver Detalles
                  </Link>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(course.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-listings">
            <p>No has publicado ningún curso aún.</p>
            <Link to="/publicar-curso" className="btn btn-primary">
              Publicar Tu Primer Curso
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;
