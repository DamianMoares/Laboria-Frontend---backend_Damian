import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { jobService } from '../../services/jobService';
import styles from '../compartidos/FormPage.module.css';

const REQUIRED_FIELDS = ['title', 'location', 'description'];
const FIELD_LABELS = { title: 'Título', location: 'Ubicación', description: 'Descripción' };

const PostJobPage = () => {
  const { user, isCompanyEmployees, isCompanyHybrid } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  if (!user || (!isCompanyEmployees() && !isCompanyHybrid())) {
    return (
      <div className={styles['form-page'] + ' ' + styles['not-authorized']}>
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
    mode: 'REMOTE',
    schedule: 'full-time',
    experienceLevel: 'junior',
    salary: '',
    contractType: 'indefinido',
    category: 'Tecnología',
    technology: '',
    description: '',
    requirements: '',
    benefits: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (name, value) => {
    if (!REQUIRED_FIELDS.includes(name)) return '';
    if (!value || !value.trim()) return `${FIELD_LABELS[name] || name} es obligatorio`;
    if (name === 'title' && value.trim().length < 5) return 'El título debe tener al menos 5 caracteres';
    if (name === 'description' && value.trim().length < 20) return 'La descripción debe tener al menos 20 caracteres';
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };

  const isValid = () => REQUIRED_FIELDS.every(f => !validate(f, formData[f]));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    REQUIRED_FIELDS.forEach(f => { newErrors[f] = validate(f, formData[f]); });
    const allTouched = {};
    REQUIRED_FIELDS.forEach(f => { allTouched[f] = true; });
    setErrors(newErrors);
    setTouched(allTouched);
    if (Object.values(newErrors).some(Boolean)) return;
    setSubmitting(true);
    
    const jobPayload = {
      title: formData.title,
      company: user.name,
      location: formData.location,
      mode: formData.mode,
      salary: formData.salary,
      description: formData.description,
      requirements: formData.requirements,
      category: formData.category
    };

    try {
      await jobService.create(jobPayload);
      toast.success('Oferta publicada con éxito');
      navigate('/mis-ofertas');
    } catch (error) {
      const newJob = { id: Date.now(), ...formData, company: user.name };
      const postedJobs = JSON.parse(localStorage.getItem('posted_jobs') || '[]');
      postedJobs.push(newJob);
      localStorage.setItem('posted_jobs', JSON.stringify(postedJobs));
      toast.success('Oferta guardada localmente (backend no disponible)');
      navigate('/mis-ofertas');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles['form-page'] + ' post-job-page'}>
      <div className="container">
        <header className={styles['form-header']}>
          <h1>Publicar Oferta de Empleo</h1>
          <p className={styles['form-subtitle']}>Crea una nueva oferta de empleo para tu empresa</p>
        </header>

        <form className={styles['form-container']} onSubmit={handleSubmit}>
          <div className={styles['form-section']}>
            <h2>Información Básica</h2>
            
            <div className={styles['form-group']}>
              <label htmlFor="title">Título del puesto *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="Ej: Desarrollador Frontend React"
                required
                className={errors.title && touched.title ? styles['input-error'] : ''}
              />
              {errors.title && touched.title && <span className={styles['error-text']}>{errors.title}</span>}
            </div>

            <div className={styles['form-row']}>
              <div className={styles['form-group']}>
                <label htmlFor="location">Ubicación *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Ej: Madrid"
                  required
                  className={errors.location && touched.location ? styles['input-error'] : ''}
                />
                {errors.location && touched.location && <span className={styles['error-text']}>{errors.location}</span>}
              </div>

              <div className={styles['form-group']}>
                <label htmlFor="workMode">Modalidad *</label>
                <select
                  id="mode"
                  name="mode"
                  value={formData.mode}
                  onChange={handleInputChange}
                  required
                >
                  <option value="ONSITE">Presencial</option>
                  <option value="REMOTE">Remoto</option>
                  <option value="HYBRID">Híbrido</option>
                </select>
              </div>
            </div>

            <div className={styles['form-row']}>
              <div className={styles['form-group']}>
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

              <div className={styles['form-group']}>
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

            <div className={styles['form-row']}>
              <div className={styles['form-group']}>
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

              <div className={styles['form-group']}>
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

            <div className={styles['form-row']}>
              <div className={styles['form-group']}>
                <label htmlFor="sector">Sector *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
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

              <div className={styles['form-group']}>
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

          <div className={styles['form-section']}>
            <h2>Detalles de la Oferta</h2>

            <div className={styles['form-group']}>
              <label htmlFor="description">Descripción *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="Describe las responsabilidades del puesto..."
                rows="4"
                required
                className={errors.description && touched.description ? styles['input-error'] : ''}
              />
              {errors.description && touched.description && <span className={styles['error-text']}>{errors.description}</span>}
            </div>

            <div className={styles['form-group']}>
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

            <div className={styles['form-group']}>
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

          <div className={styles['form-actions']}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Publicando...' : 'Publicar Oferta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobPage;
