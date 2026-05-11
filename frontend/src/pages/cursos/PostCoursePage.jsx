import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../compartidos/FormPage.css';

const PostCoursePage = () => {
  const { user, isCompanyStudents, isCompanyHybrid } = useAuth();
  const navigate = useNavigate();

  if (!user || (!isCompanyStudents() && !isCompanyHybrid())) {
    return (
      <div className="form-page not-authorized">
        <div className="container">
          <h1>No autorizado</h1>
          <p>Esta página es solo para empresas que pueden publicar cursos.</p>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    title: '',
    platform: user?.profile?.companyName || '',
    level: 'básico',
    duration: '',
    format: 'online',
    price: '',
    certification: false,
    technology: '',
    description: '',
    skills: '',
    requirements: '',
    instructor: user?.profile?.companyName || ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newCourse = {
      id: Date.now(),
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()),
      requirements: formData.requirements.split('\n').filter(r => r.trim()),
      rating: 0,
      students: 0,
      externalLink: '#'
    };

    const postedCourses = JSON.parse(localStorage.getItem('posted_courses') || '[]');
    postedCourses.push(newCourse);
    localStorage.setItem('posted_courses', JSON.stringify(postedCourses));

    alert('Curso publicado con éxito (simulado)');
    navigate('/mis-cursos');
  };

  return (
    <div className="form-page post-course-page">
      <div className="container">
        <header className="form-header">
          <h1>Publicar Curso</h1>
          <p className="form-subtitle">Crea un nuevo curso de formación</p>
        </header>

        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Información Básica</h2>
            
            <div className="form-group">
              <label htmlFor="title">Título del curso *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ej: React.js: De Cero a Experto"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="platform">Plataforma *</label>
                <input
                  type="text"
                  id="platform"
                  name="platform"
                  value={formData.platform}
                  onChange={handleInputChange}
                  placeholder="Ej: Tu empresa"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="instructor">Instructor *</label>
                <input
                  type="text"
                  id="instructor"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleInputChange}
                  placeholder="Nombre del instructor"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="level">Nivel *</label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  required
                >
                  <option value="básico">Básico</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="format">Formato *</label>
                <select
                  id="format"
                  name="format"
                  value={formData.format}
                  onChange={handleInputChange}
                  required
                >
                  <option value="online">Online</option>
                  <option value="presencial">Presencial</option>
                  <option value="híbrido">Híbrido</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="duration">Duración *</label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="Ej: 40 horas"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Precio</label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Ej: 19.99€ o Gratuito"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="technology">Tecnología principal</label>
              <input
                type="text"
                id="technology"
                name="technology"
                value={formData.technology}
                onChange={handleInputChange}
                placeholder="Ej: React, Python, JavaScript"
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="certification"
                  checked={formData.certification}
                  onChange={handleInputChange}
                />
                Incluye certificación
              </label>
            </div>
          </div>

          <div className="form-section">
            <h2>Detalles del Curso</h2>

            <div className="form-group">
              <label htmlFor="description">Descripción *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe el contenido del curso..."
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="skills">Skills (separados por coma)</label>
              <textarea
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="React, Hooks, Redux, State Management"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="requirements">Requisitos previos (uno por línea)</label>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                placeholder="JavaScript básico&#10;Conocimiento de HTML/CSS&#10;Ganas de aprender"
                rows="3"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Publicar Curso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostCoursePage;
