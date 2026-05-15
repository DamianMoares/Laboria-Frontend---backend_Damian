import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../config/enums';
import logoNegro from '../../assets/img/Laboria_Fondo_Negro.png';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: ''
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'El email es requerido';
    }
    if (!emailRegex.test(email)) {
      return 'Ingresa un email válido';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'La contraseña es requerida';
    }
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'email') {
      setEmail(value);
      if (touched.email) {
        setFieldErrors(prev => ({
          ...prev,
          email: validateEmail(value)
        }));
      }
    } else if (name === 'password') {
      setPassword(value);
      if (touched.password) {
        setFieldErrors(prev => ({
          ...prev,
          password: validatePassword(value)
        }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    if (name === 'email') {
      setFieldErrors(prev => ({
        ...prev,
        email: validateEmail(email)
      }));
    } else if (name === 'password') {
      setFieldErrors(prev => ({
        ...prev,
        password: validatePassword(password)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validar todos los campos
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    setFieldErrors({
      email: emailError,
      password: passwordError
    });
    
    setTouched({
      email: true,
      password: true
    });

    if (emailError || passwordError) {
      setError('Por favor corrige los errores del formulario');
      return;
    }

    const result = await login(email, password);
    
    if (result.success) {
      // Redirect based on role
      switch (result.user.role) {
        case ROLES.CANDIDATE:
          navigate('/perfil/candidato');
          break;
        case ROLES.ADMIN:
          navigate('/admin');
          break;
        case ROLES.COMPANY_EMPLOYEES:
        case ROLES.COMPANY_STUDENTS:
        case ROLES.COMPANY_HYBRID:
          navigate('/perfil/empresa');
          break;
        default:
          navigate('/');
      }
    } else {
      setError(result.error);
    }
  };

  const handleFillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className={`${styles.authPage} login-page`}>
      <div className="container">
        <div className={styles.authCard}>
          <header className={styles.authHeader}>
            <img src={logoNegro} alt="Laboria" className={styles.authLogo} />
            <h1>Iniciar Sesión</h1>
            <p className={styles.authSubtitle}>Accede a tu cuenta de Laboria</p>
          </header>

          <form className={styles.authForm} onSubmit={handleSubmit}>
            {error && <div className={styles.authError}>{error}</div>}

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
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
                value={password}
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

            <button type="submit" className="btn btn-primary btn-full">
              Iniciar Sesión
            </button>
          </form>

          <div className={styles.authFooter}>
            <p>¿No tienes cuenta? <Link to="/registro" className={styles.authLink}>Regístrate</Link></p>
            <p><Link to="/" className={styles.authLink}>Volver al inicio</Link></p>
          </div>

          <div className={styles.demoAccounts}>
            <button 
              className={styles.demoAccountsToggle}
              onClick={() => setShowDemoAccounts(!showDemoAccounts)}
            >
              <h3>Cuentas de demo {showDemoAccounts ? '▼' : '▶'}</h3>
            </button>
            {showDemoAccounts && (
              <div className={styles.demoAccountsList}>
                <div 
                  className={`${styles.demoAccount} ${styles.demoAccountClickable}`}
                  onClick={() => handleFillDemo('admin@laboria.com', 'admin123')}
                >
                  <strong>Administrador:</strong> admin@laboria.com / admin123
                </div>
                <div 
                  className={`${styles.demoAccount} ${styles.demoAccountClickable}`}
                  onClick={() => handleFillDemo('candidate@laboria.com', 'candidate123')}
                >
                  <strong>Candidato:</strong> candidate@laboria.com / candidate123
                </div>
                <div 
                  className={`${styles.demoAccount} ${styles.demoAccountClickable}`}
                  onClick={() => handleFillDemo('company@laboria.com', 'company123')}
                >
                  <strong>Empresa (empleados):</strong> company@laboria.com / company123
                </div>
                <div 
                  className={`${styles.demoAccount} ${styles.demoAccountClickable}`}
                  onClick={() => handleFillDemo('recruiter@laboria.com', 'recruiter123')}
                >
                  <strong>Empresa (estudiantes):</strong> recruiter@laboria.com / recruiter123
                </div>
                <div 
                  className={`${styles.demoAccount} ${styles.demoAccountClickable}`}
                  onClick={() => handleFillDemo('hybrid@laboria.com', 'hybrid123')}
                >
                  <strong>Empresa (híbrida):</strong> hybrid@laboria.com / hybrid123
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
