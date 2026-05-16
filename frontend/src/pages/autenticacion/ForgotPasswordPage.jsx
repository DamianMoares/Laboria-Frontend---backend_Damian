import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import logoNegro from '../../assets/img/Laboria_Fondo_Negro.png';
import styles from './LoginPage.module.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Error al enviar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.authPage} login-page`}>
      <div className="container">
        <div className={styles.authCard}>
          <header className={styles.authHeader}>
            <img src={logoNegro} alt="Laboria" className={styles.authLogo} />
            <h1>Recuperar Contraseña</h1>
            <p className={styles.authSubtitle}>Te enviaremos un enlace para restablecer tu contraseña</p>
          </header>

          {sent ? (
            <div className={styles.authFooter}>
              <p>Si el email existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.</p>
              <p>Revisa tu bandeja de entrada y sigue las instrucciones.</p>
              <p><Link to="/login" className={styles.authLink}>Volver a iniciar sesión</Link></p>
            </div>
          ) : (
            <form className={styles.authForm} onSubmit={handleSubmit}>
              {error && <div className={styles.authError}>{error}</div>}
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar enlace'}
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

export default ForgotPasswordPage;
