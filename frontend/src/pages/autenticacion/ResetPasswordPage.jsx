import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import logoNegro from '../../assets/img/Laboria_Fondo_Negro.png';
import styles from './LoginPage.module.css';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message || 'Error al restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className={`${styles.authPage} login-page`}>
        <div className="container">
          <div className={styles.authCard}>
            <header className={styles.authHeader}>
              <img src={logoNegro} alt="Laboria" className={styles.authLogo} />
              <h1>Enlace inválido</h1>
            </header>
            <div className={styles.authFooter}>
              <p>Este enlace de restablecimiento no es válido. Solicita uno nuevo.</p>
              <p><Link to="/olvide-mi-contrasena" className={styles.authLink}>Solicitar nuevo enlace</Link></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.authPage} login-page`}>
      <div className="container">
        <div className={styles.authCard}>
          <header className={styles.authHeader}>
            <img src={logoNegro} alt="Laboria" className={styles.authLogo} />
            <h1>Nueva Contraseña</h1>
            <p className={styles.authSubtitle}>Ingresa tu nueva contraseña</p>
          </header>

          {success ? (
            <div className={styles.authFooter}>
              <p>Contraseña restablecida exitosamente.</p>
              <p>Serás redirigido al inicio de sesión...</p>
              <p><Link to="/login" className={styles.authLink}>Ir a iniciar sesión</Link></p>
            </div>
          ) : (
            <form className={styles.authForm} onSubmit={handleSubmit}>
              {error && <div className={styles.authError}>{error}</div>}
              <div className={styles.formGroup}>
                <label htmlFor="password">Nueva contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
              </button>
            </form>
          )}

          <div className={styles.authFooter}>
            <p><Link to="/login" className={styles.authLink}>Volver a iniciar sesión</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
