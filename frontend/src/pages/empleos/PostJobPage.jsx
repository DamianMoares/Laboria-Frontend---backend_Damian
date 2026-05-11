import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../compartidos/FormPage.css';

const PostJobPage = () => {
  const { user, isCompanyEmployees, isCompanyHybrid } = useAuth();
  const navigate = useNavigate();

  if (!user || (!isCompanyEmployees() && !isCompanyHybrid())) {
    return (
      <div className="form-page not-authorized">
        <div className="container">
          <h1>No autorizado</h1>
          <p>Esta página es solo para empresas que pueden publicar ofertas de empleo.</p>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    workMode: 'presencial',
    schedule: 'full-time',
    experienceLevel: 'junior',
    salary: '',
    contractType: 'indefinido',
    sector: 'Tecnología',
    technology: '',
    description: '',
    requirements: '',
    benefits: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simular publicación - en versión real esto enviaría a API
    const newJob = {
      id: Date.now(),
      ...formData,
      company: user.profile.companyName,
      requirements: formData.requirements.split('\n').filter(r => r.trim()),
      benefits: formData.benefits.split('\n').filter(b => b.trim()),
      postedDate: new Date().toISOString().split('T')[0]
    };

    // Guardar en localStorage para simular persistencia
    const postedJobs = JSON.parse(localStorage.getItem('posted_jobs') || '[]');
    postedJobs.push(newJob);
    localStorage.setItem('posted_jobs', JSON.stringify(postedJobs));

    alert('Oferta publicada con éxito (simulado)');
    navigate('/mis-ofertas');
  };

  return (
    <div className="form-page post-job-page">
      <div className="container">
        <header className="form-header">
          <h1>Publicar Oferta de Empleo</h1>
          <p className="form-subtitle">Crea una nueva oferta de empleo para tu empresa</p>
        </header>

        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Información Básica</h2>
            
            <div className="form-group">
              <label htmlFor="title">Título del puesto *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ej: Desarrollador Frontend React"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location">Ubicación *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Ej: Madrid"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="workMode">Modalidad *</label>
                <select
                  id="workMode"
                  name="workMode"
                  value={formData.workMode}
                  onChange={handleInputChange}
                  required
                >
                  <option value="presencial">Presencial</option>
                  <option value="remoto">Remoto</option>
                  <option value="híbrido">Híbrido</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="schedule">Jornada *</label>
                <select
                  id="schedule"
                  name="schedule"
                  value={formData.schedule}
                  onChange={handleInputChange}
                  required
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="experienceLevel">Nivel de experiencia *</label>
                <select
                  id="experienceLevel"
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleInputChange}
                  required
                >
                  <option value="junior">Junior</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="senior">Senior</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="salary">Salario</label>
                <input
                  type="text"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder="Ej: 35000-45000€"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contractType">Tipo de contrato *</label>
                <select
                  id="contractType"
                  name="contractType"
                  value={formData.contractType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="indefinido">Indefinido</option>
                  <option value="temporal">Temporal</option>
                  <option value="practicas">Prácticas</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="sector">Sector *</label>
                <select
                  id="sector"
                  name="sector"
                  value={formData.sector}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Tecnología">Tecnología</option>
                  <option value="Diseño">Diseño</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Ventas">Ventas</option>
                  <option value="Finanzas">Finanzas</option>
                  <option value="Salud">Salud</option>
                  <option value="Educación">Educación</option>
                  <option value="Otros">Otros</option>
                </select>
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
            </div>
          </div>

          <div className="form-section">
            <h2>Detalles de la Oferta</h2>

            <div className="form-group">
              <label htmlFor="description">Descripción *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe las responsabilidades del puesto..."
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="requirements">Requisitos (uno por línea)</label>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                placeholder="Experiencia con React&#10;Conocimiento de CSS&#10;Inglés intermedio"
                rows="4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="benefits">Beneficios (uno por línea)</label>
              <textarea
                id="benefits"
                name="benefits"
                value={formData.benefits}
                onChange={handleInputChange}
                placeholder="Seguro médico&#10;Trabajo híbrido&#10;Formación continua"
                rows="4"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Publicar Oferta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobPage;
