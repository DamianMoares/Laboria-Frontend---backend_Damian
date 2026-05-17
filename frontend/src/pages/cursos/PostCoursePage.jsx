import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { courseService } from '../../services/courseService';
import styles from '../compartidos/FormPage.module.css';

const REQUIRED_FIELDS = ['title', 'provider', 'duration', 'description'];
const FIELD_LABELS = { title: 'Título', provider: 'Proveedor', duration: 'Duración', description: 'Descripción' };

const PostCoursePage = () => {
  const { user, isCompanyStudents, isCompanyHybrid } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  if (!user || (!isCompanyStudents() && !isCompanyHybrid())) {
    return (
      <div className={styles['form-page'] + ' ' + styles['not-authorized']}>
        <div className="container">
          <h1>No autorizado</h1>
          <p>Esta página es solo para empresas que pueden publicar cursos.</p>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    title: '',
    provider: user?.name || '',
    level: 'BEGINNER',
    duration: '',
    price: '',
    url: '',
    image: '',
    description: '',
    category: 'Tecnología'
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
    
    const coursePayload = {
      title: formData.title,
      provider: formData.provider,
      description: formData.description,
      category: formData.category,
      level: formData.level,
      duration: formData.duration,
      price: formData.price,
      url: formData.url
    };

    try {
      await courseService.create(coursePayload);
      toast.success('Curso publicado con éxito');
      navigate('/mis-cursos');
    } catch (error) {
      const newCourse = { id: Date.now(), ...formData };
      const postedCourses = JSON.parse(localStorage.getItem('posted_courses') || '[]');
      postedCourses.push(newCourse);
      localStorage.setItem('posted_courses', JSON.stringify(postedCourses));
      toast.success('Curso guardado localmente (backend no disponible)');
      navigate('/mis-cursos');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles['form-page'] + ' post-course-page'}>
      <div className="container">
        <header className={styles['form-header']}>
          <h1>Publicar Curso</h1>
          <p className={styles['form-subtitle']}>Crea un nuevo curso de formación</p>
        </header>

        <form className={styles['form-container']} onSubmit={handleSubmit}>
          <div className={styles['form-section']}>
            <h2>Información Básica</h2>
            
            <div className={styles['form-group']}>
              <label htmlFor="title">Título del curso *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="Ej: React.js: De Cero a Experto"
                required
                className={errors.title && touched.title ? styles['input-error'] : ''}
              />
              {errors.title && touched.title && <span className={styles['error-text']}>{errors.title}</span>}
            </div>

            <div className={styles['form-row']}>
              <div className={styles['form-group']}>
                <label htmlFor="provider">Proveedor *</label>
                <input
                  type="text"
                  id="provider"
                  name="provider"
                  value={formData.provider}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Ej: Tu empresa"
                  required
                  className={errors.provider && touched.provider ? styles['input-error'] : ''}
                />
                {errors.provider && touched.provider && <span className={styles['error-text']}>{errors.provider}</span>}
              </div>

              <div className={styles['form-group']}>
                <label htmlFor="category">Categoría *</label>
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
                  <option value="Negocios">Negocios</option>
                  <option value="Idiomas">Idiomas</option>
                  <option value="Salud">Salud</option>
                  <option value="Educación">Educación</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
            </div>

            <div className={styles['form-row']}>
              <div className={styles['form-group']}>
                <label htmlFor="level">Nivel *</label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  required
                >
                  <option value="BEGINNER">Básico</option>
                  <option value="INTERMEDIATE">Intermedio</option>
                  <option value="ADVANCED">Avanzado</option>
                </select>
              </div>

              <div className={styles['form-group']}>
                <label htmlFor="url">URL del curso</label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className={styles['form-row']}>
              <div className={styles['form-group']}>
                <label htmlFor="duration">Duración *</label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Ej: 40 horas"
                  required
                  className={errors.duration && touched.duration ? styles['input-error'] : ''}
                />
                {errors.duration && touched.duration && <span className={styles['error-text']}>{errors.duration}</span>}
              </div>

              <div className={styles['form-group']}>
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

            <div className={styles['form-group']}>
              <label htmlFor="image">URL de imagen</label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
          </div>

          <div className={styles['form-section']}>
            <h2>Detalles del Curso</h2>

            <div className={styles['form-group']}>
              <label htmlFor="description">Descripción *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="Describe el contenido del curso..."
                rows="4"
                required
                className={errors.description && touched.description ? styles['input-error'] : ''}
              />
              {errors.description && touched.description && <span className={styles['error-text']}>{errors.description}</span>}
            </div>

          </div>

          <div className={styles['form-actions']}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Publicando...' : 'Publicar Curso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostCoursePage;
