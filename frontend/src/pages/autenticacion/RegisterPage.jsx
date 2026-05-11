import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoNegro from '../../assets/img/Laboria_Fondo_Negro.png';
import styles from './RegisterPage.module.css';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    // Candidato
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    bio: '',
    skills: '',
    experience: '',
    salaryExpectation: '',
    workModePreference: '',
    // Empresa
    companyName: '',
    industry: '',
    size: '',
    website: '',
    description: '',
    focus: ''
  });
  const [legalConsents, setLegalConsents] = useState({
    termsAccepted: false,
    privacyAccepted: false,
    cookiesEssential: true,
    cookiesAnalytics: false,
    cookiesMarketing: false
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) return 'El email es requerido';
        if (!emailRegex.test(value)) return 'Ingresa un email válido';
        return '';
      
      case 'password':
        if (!value) return 'La contraseña es requerida';
        if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
        return '';
      
      case 'confirmPassword':
        if (!value) return 'Confirma tu contraseña';
        if (value !== formData.password) return 'Las contraseñas no coinciden';
        return '';
      
      case 'firstName':
      case 'lastName':
      case 'companyName':
        if (!value) return 'Este campo es requerido';
        if (value.length < 2) return 'Debe tener al menos 2 caracteres';
        return '';
      
      case 'phone':
        if (!value) return 'El teléfono es requerido';
        const phoneRegex = /^[+]?[\d\s\-\(\)]+$/;
        if (!phoneRegex.test(value)) return 'Ingresa un teléfono válido';
        return '';
      
      case 'location':
        if (!value) return 'La ubicación es requerida';
        return '';
      
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Validar en tiempo real si el campo ya fue tocado
    if (touched[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    setFieldErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const handleConsentChange = (e) => {
    setLegalConsents({
      ...legalConsents,
      [e.target.name]: e.target.checked
    });
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setRole('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validar todos los campos requeridos
    const requiredFields = role === 'candidate' 
      ? ['email', 'password', 'confirmPassword', 'firstName', 'lastName', 'phone', 'location']
      : ['email', 'password', 'confirmPassword', 'companyName', 'phone', 'location'];
    
    const newFieldErrors = {};
    const newTouched = {};
    
    requiredFields.forEach(field => {
      newTouched[field] = true;
      newFieldErrors[field] = validateField(field, formData[field]);
    });
    
    setFieldErrors(newFieldErrors);
    setTouched(newTouched);

    // Verificar si hay errores
    const hasErrors = Object.values(newFieldErrors).some(error => error !== '');
    
    if (hasErrors) {
      setError('Por favor corrige los errores del formulario');
      return;
    }

    // Validaciones adicionales
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!legalConsents.termsAccepted) {
      setError('Debes aceptar los Términos y Condiciones para registrarte');
      return;
    }

    if (!legalConsents.privacyAccepted) {
      setError('Debes aceptar la Política de Privacidad para registrarte');
      return;
    }

    const userData = {
      email: formData.email,
      password: formData.password,
      role: role,
      name: role === 'candidate' ? `${formData.firstName} ${formData.lastName}` : formData.companyName,
      profile: {}
    };

    if (role === 'candidate') {
      userData.profile = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
        skills: formData.skills.split(',').map(s => s.trim()),
        experience: formData.experience,
        salaryExpectation: formData.salaryExpectation,
        workModePreference: formData.workModePreference
      };
    } else {
      userData.profile = {
        companyName: formData.companyName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        industry: formData.industry,
        size: formData.size,
        website: formData.website,
        description: formData.description,
        focus: role === 'company_hybrid' ? 'híbrido' : 
                role === 'company_employees' ? 'empleados' : 'estudiantes',
        postedJobs: [],
        postedCourses: []
      };
    }

    const result = register(userData);
    
    if (result.success) {
      // Guardar consentimiento de cookies en localStorage
      const cookieConsent = {
        timestamp: Date.now(),
        preferences: {
          essential: legalConsents.cookiesEssential,
          analytics: legalConsents.cookiesAnalytics,
          marketing: legalConsents.cookiesMarketing
        }
      };
      localStorage.setItem('cookieConsent', JSON.stringify(cookieConsent));
      
      navigate(role === 'candidate' ? '/perfil/candidato' : '/perfil/empresa');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className={`${styles.authPage} register-page`}>
      <div className="container">
        <div className={styles.authCard}>
          <header className={styles.authHeader}>
            <img src={logoNegro} alt="Laboria" className={styles.authLogo} />
            <h1>Registro</h1>
            <p className={styles.authSubtitle}>Crea tu cuenta en Laboria</p>
          </header>

          {step === 1 && (
            <div className={styles.roleSelection}>
              <h2>¿Qué tipo de cuenta necesitas?</h2>
              
              <div className={styles.roleCards}>
                <div 
                  className={styles.roleCard}
                  onClick={() => handleRoleSelect('candidate')}
                >
                  <div className={styles.roleIcon}>👤</div>
                  <h3>Candidato</h3>
                  <p>Busco empleo y formación para mejorar mi perfil profesional</p>
                </div>

                <div 
                  className={styles.roleCard}
                  onClick={() => handleRoleSelect('company_employees')}
                >
                  <div className={styles.roleIcon}>🏢</div>
                  <h3>Empresa (Empleados)</h3>
                  <p>Busco talento para cubrir vacantes en mi empresa</p>
                </div>

                <div 
                  className={styles.roleCard}
                  onClick={() => handleRoleSelect('company_students')}
                >
                  <div className={styles.roleIcon}>🎓</div>
                  <h3>Empresa (Estudiantes)</h3>
                  <p>Busco estudiantes para programas de formación y becas</p>
                </div>

                <div 
                  className={styles.roleCard}
                  onClick={() => handleRoleSelect('company_hybrid')}
                >
                  <div className={styles.roleIcon}>🔄</div>
                  <h3>Empresa (Híbrida)</h3>
                  <p>Busco tanto empleados como estudiantes para mi organización</p>
                </div>
              </div>

              <div className={styles.authFooter}>
                <p>¿Ya tienes cuenta? <Link to="/login" className={styles.authLink}>Inicia sesión</Link></p>
                <p><Link to="/" className={styles.authLink}>Volver al inicio</Link></p>
              </div>
            </div>
          )}

          {step === 2 && (
            <form className={styles.authForm} onSubmit={handleSubmit}>
              {error && <div className={styles.authError}>{error}</div>}

              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="tu@email.com"
                  className={fieldErrors.email && touched.email ? styles.error : ''}
                  required
                />
                {fieldErrors.email && touched.email && (
                  <div className={styles.fieldError}>
                    {fieldErrors.email}
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  className={fieldErrors.password && touched.password ? styles.error : ''}
                  required
                />
                {fieldErrors.password && touched.password && (
                  <div className={styles.fieldError}>
                    {fieldErrors.password}
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  className={fieldErrors.confirmPassword && touched.confirmPassword ? styles.error : ''}
                  required
                />
                {fieldErrors.confirmPassword && touched.confirmPassword && (
                  <div className={styles.fieldError}>
                    {fieldErrors.confirmPassword}
                  </div>
                )}
              </div>

              {role === 'candidate' ? (
                <>
                  <div className={styles.formGroup}>
                    <label htmlFor="firstName">Nombre</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Tu nombre"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="lastName">Apellidos</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Tus apellidos"
                      required
                    />
                  </div>
                </>
              ) : (
                <div className={styles.formGroup}>
                  <label htmlFor="companyName">Nombre de la Empresa</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Nombre de tu empresa"
                    required
                  />
                </div>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="phone">Teléfono</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+34 600 000 000"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="location">Ubicación</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Ciudad, País"
                  required
                />
              </div>

              {role === 'candidate' && (
                <>
                  <div className={styles.formGroup}>
                    <label htmlFor="bio">Biografía</label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Cuéntanos sobre ti..."
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="skills">Skills (separados por coma)</label>
                    <input
                      type="text"
                      id="skills"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      placeholder="React, JavaScript, CSS..."
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="experience">Experiencia</label>
                    <select
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecciona tu experiencia</option>
                      <option value="0-1 años">0-1 años</option>
                      <option value="1-3 años">1-3 años</option>
                      <option value="3-5 años">3-5 años</option>
                      <option value="5-10 años">5-10 años</option>
                      <option value="10+ años">10+ años</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="salaryExpectation">Expectativa salarial</label>
                    <input
                      type="text"
                      id="salaryExpectation"
                      name="salaryExpectation"
                      value={formData.salaryExpectation}
                      onChange={handleInputChange}
                      placeholder="30000-40000€"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="workModePreference">Preferencia de trabajo</label>
                    <select
                      id="workModePreference"
                      name="workModePreference"
                      value={formData.workModePreference}
                      onChange={handleInputChange}
                    >
                      <option value="">Selecciona preferencia</option>
                      <option value="presencial">Presencial</option>
                      <option value="remoto">Remoto</option>
                      <option value="híbrido">Híbrido</option>
                    </select>
                  </div>
                </>
              )}

              {role !== 'candidate' && (
                <>
                  <div className={styles.formGroup}>
                    <label htmlFor="industry">Industria</label>
                    <input
                      type="text"
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      placeholder="Tecnología, Educación, Salud..."
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="size">Tamaño de la empresa</label>
                    <select
                      id="size"
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecciona tamaño</option>
                      <option value="1-10 empleados">1-10 empleados</option>
                      <option value="10-50 empleados">10-50 empleados</option>
                      <option value="50-200 empleados">50-200 empleados</option>
                      <option value="200-500 empleados">200-500 empleados</option>
                      <option value="500+ empleados">500+ empleados</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="website">Sitio web</label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://tuempresa.com"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="description">Descripción</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe tu empresa..."
                      rows="3"
                      required
                    />
                  </div>
                </>
              )}

              <div className={styles.legalConsents}>
                <h3>Términos Legales y Consentimientos</h3>
                
                <div className={styles.consentItem}>
                  <label className={styles.consentLabel}>
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={legalConsents.termsAccepted}
                      onChange={handleConsentChange}
                      required
                    />
                    <span>
                      He leído y acepto los <a href="/legal/terminos-condiciones.html" target="_blank" rel="noopener noreferrer">Términos y Condiciones de Uso</a>
                    </span>
                  </label>
                </div>

                <div className={styles.consentItem}>
                  <label className={styles.consentLabel}>
                    <input
                      type="checkbox"
                      name="privacyAccepted"
                      checked={legalConsents.privacyAccepted}
                      onChange={handleConsentChange}
                      required
                    />
                    <span>
                      He leído y acepto la <a href="/legal/politica-privacidad.html" target="_blank" rel="noopener noreferrer">Política de Privacidad</a>
                    </span>
                  </label>
                </div>

                <div className={styles.consentSection}>
                  <h4>Preferencias de Cookies</h4>
                  <p className={styles.consentDescription}>
                    Selecciona las categorías de cookies que deseas aceptar. 
                    Las cookies esenciales son necesarias para el funcionamiento del sitio.
                  </p>

                  <div className={styles.consentItem}>
                    <label className={styles.consentLabel}>
                      <input
                        type="checkbox"
                        name="cookiesEssential"
                        checked={legalConsents.cookiesEssential}
                        onChange={handleConsentChange}
                        disabled
                      />
                      <span>
                        <strong>Cookies Esenciales</strong> (necesarias, no se pueden desactivar)
                      </span>
                    </label>
                  </div>

                  <div className={styles.consentItem}>
                    <label className={styles.consentLabel}>
                      <input
                        type="checkbox"
                        name="cookiesAnalytics"
                        checked={legalConsents.cookiesAnalytics}
                        onChange={handleConsentChange}
                      />
                      <span>
                        <strong>Cookies de Análisis</strong> (para mejorar el sitio)
                      </span>
                    </label>
                  </div>

                  <div className={styles.consentItem}>
                    <label className={styles.consentLabel}>
                      <input
                        type="checkbox"
                        name="cookiesMarketing"
                        checked={legalConsents.cookiesMarketing}
                        onChange={handleConsentChange}
                      />
                      <span>
                        <strong>Cookies de Marketing</strong> (para anuncios personalizados)
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.btnSecondary} onClick={handleBack}>
                  Atrás
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Registrarse
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
