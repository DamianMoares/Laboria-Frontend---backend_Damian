import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { courseService } from '../../services/courseService';
import '../compartidos/MyListingsPage.css';

const MyCoursesPage = () => {
  const { user, isCompanyStudents, isCompanyHybrid } = useAuth();
  const [postedCourses, setPostedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const data = await courseService.getAll();
        setPostedCourses(Array.isArray(data) ? data.filter(c => c.authorId === user.id) : []);
      } catch (error) {
        setPostedCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
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

  const handleDelete = async (courseId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este curso?')) {
      try {
        await courseService.delete(courseId);
        setPostedCourses(postedCourses.filter(course => course.id !== courseId));
        alert('Curso eliminado');
      } catch (error) {
        alert('Error al eliminar curso');
      }
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

        {loading ? (
          <div className="loading">Cargando cursos...</div>
        ) : postedCourses.length > 0 ? (
          <div className="listings-grid">
            {postedCourses.map(course => (
              <div key={course.id} className="listing-card">
                <div className="listing-header">
                  <h3>{course.title}</h3>
                </div>
                
                <div className="listing-info">
                  <div className="info-item">
                    <strong>Proveedor:</strong> {course.provider}
                  </div>
                  <div className="info-item">
                    <strong>Nivel:</strong> {course.level}
                  </div>
                  <div className="info-item">
                    <strong>Duración:</strong> {course.duration || 'N/A'}
                  </div>
                  <div className="info-item">
                    <strong>Categoría:</strong> {course.category}
                  </div>
                  <div className="info-item">
                    <strong>Precio:</strong> {course.price || 'Gratuito'}
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
