import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './EditProfileModal.css';

const EditProfileModal = ({ isOpen, onClose, userType }) => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    experience: '',
    salaryExpectation: '',
    workModePreference: '',
    linkedin: '',
    github: '',
    portfolio: '',
    companyName: '',
    industry: '',
    size: '',
    website: '',
    description: '',
    focus: ''
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      const profile = JSON.parse(localStorage.getItem(`profile_${user.id}`) || '{}');
      setFormData({
        firstName: profile.firstName || user.name?.split(' ')[0] || '',
        lastName: profile.lastName || user.name?.split(' ').slice(1).join(' ') || '',
        email: profile.email || user.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: profile.bio || '',
        experience: profile.experience || '',
        salaryExpectation: profile.salaryExpectation || '',
        workModePreference: profile.workModePreference || '',
        linkedin: profile.linkedin || '',
        github: profile.github || '',
        portfolio: profile.portfolio || '',
        companyName: profile.companyName || user.name || '',
        industry: profile.industry || '',
        size: profile.size || '',
        website: profile.website || '',
        description: profile.description || '',
        focus: profile.focus || ''
      });
    }
  }, [user]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (userType === 'candidate') {
      if (!formData.firstName) newErrors.firstName = 'El nombre es obligatorio';
      if (!formData.lastName) newErrors.lastName = 'El apellido es obligatorio';
    } else if (userType === 'company') {
      if (!formData.companyName) newErrors.companyName = 'El nombre de la empresa es obligatorio';
      if (!formData.industry) newErrors.industry = 'La industria es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);

    const profileData = userType === 'candidate'
      ? {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
          experience: formData.experience,
          salaryExpectation: formData.salaryExpectation,
          workModePreference: formData.workModePreference,
          linkedin: formData.linkedin,
          github: formData.github,
          portfolio: formData.portfolio
        }
      : {
          companyName: formData.companyName,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          industry: formData.industry,
          size: formData.size,
          website: formData.website,
          description: formData.description,
          focus: formData.focus
        };

    // Guardar datos de perfil en localStorage (el backend no tiene modelo Profile)
    localStorage.setItem(`profile_${user.id}`, JSON.stringify(profileData));

    // Sincronizar name/email con la API (lo que soporta el backend)
    const name = userType === 'candidate'
      ? `${formData.firstName} ${formData.lastName}`
      : formData.companyName;

    const result = await updateProfile({ name, email: formData.email });

    if (result.success) {
      onClose();
    } else {
      setErrors({ general: result.error || 'Error al guardar' });
    }
    setSaving(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Perfil</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="edit-profile-form">
          {errors.general && <div className="error-message general">{errors.general}</div>}
          
          {userType === 'candidate' ? (
            <>
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? 'error' : ''}
                />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>
              
              <div className="form-group">
                <label>Apellido *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? 'error' : ''}
                />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>
              
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Ubicación</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Experiencia</label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Expectativa Salarial</label>
                <input
                  type="text"
                  name="salaryExpectation"
                  value={formData.salaryExpectation}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Preferencia de Trabajo</label>
                <select
                  name="workModePreference"
                  value={formData.workModePreference}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar...</option>
                  <option value="Remoto">Remoto</option>
                  <option value="Presencial">Presencial</option>
                  <option value="Híbrido">Híbrido</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Biografía</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                />
              </div>
              
              <div className="form-group">
                <label>LinkedIn</label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              
              <div className="form-group">
                <label>GitHub</label>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                />
              </div>
              
              <div className="form-group">
                <label>Portfolio</label>
                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Nombre de la Empresa *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={errors.companyName ? 'error' : ''}
                />
                {errors.companyName && <span className="error-message">{errors.companyName}</span>}
              </div>
              
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Ubicación</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Industria *</label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className={errors.industry ? 'error' : ''}
                />
                {errors.industry && <span className="error-message">{errors.industry}</span>}
              </div>
              
              <div className="form-group">
                <label>Tamaño de la Empresa</label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar...</option>
                  <option value="1-10">1-10 empleados</option>
                  <option value="11-50">11-50 empleados</option>
                  <option value="51-200">51-200 empleados</option>
                  <option value="201-500">201-500 empleados</option>
                  <option value="500+">500+ empleados</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Sitio Web</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
              
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                />
              </div>
              
              <div className="form-group">
                <label>Enfoque</label>
                <select
                  name="focus"
                  value={formData.focus}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar...</option>
                  <option value="empleados">Empleados</option>
                  <option value="estudiantes">Estudiantes</option>
                  <option value="híbrido">Híbrido</option>
                </select>
              </div>
            </>
          )}
          
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;