import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './SettingsPage.module.css';

const SettingsPage = () => {
  const { user, updateProfile, changePassword, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      const saved = JSON.parse(localStorage.getItem(`profile_${user.id}`) || '{}');
      setProfile(saved);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: saved.phone || '',
        location: saved.location || '',
        bio: saved.bio || '',
        experience: saved.experience || '',
        salaryExpectation: saved.salaryExpectation || '',
        workModePreference: saved.workModePreference || '',
        linkedin: saved.linkedin || '',
        github: saved.github || '',
        portfolio: saved.portfolio || ''
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className={styles.page}>
        <div className="container">
          <h1>No autorizado</h1>
          <p>Debes iniciar sesión para ver esta página.</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
    setMessage(null);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setError(null);
    setMessage(null);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    const profileData = {
      firstName: formData.name?.split(' ')[0] || '',
      lastName: formData.name?.split(' ').slice(1).join(' ') || '',
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
    };
    localStorage.setItem(`profile_${user.id}`, JSON.stringify(profileData));

    const result = await updateProfile({ name: formData.name, email: formData.email });
    if (result.success) {
      setMessage('Perfil actualizado correctamente');
    } else {
      setError(result.error || 'Error al guardar');
    }
    setSaving(false);
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setSaving(true);
    const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
    if (result.success) {
      setMessage('Contraseña actualizada correctamente');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setError(result.error || 'Error al cambiar contraseña');
    }
    setSaving(false);
  };

  const handleDeleteAccount = async () => {
    setError(null);
    setMessage(null);
    const result = await deleteAccount();
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Error al eliminar cuenta');
    }
    setShowDeleteConfirm(false);
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <h1>Configuración</h1>
          <p>Administra tu cuenta y preferencias</p>
        </header>

        {message && <div className={styles.success}>{message}</div>}
        {error && <div className={styles.error}>{error}</div>}

        <section className={styles.section}>
          <h2>Información personal</h2>
          <form onSubmit={handleSaveProfile}>
            <div className={styles.formGroup}>
              <label>Nombre</label>
              <input type="text" name="name" value={formData.name || ''} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input type="email" name="email" value={formData.email || ''} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label>Teléfono</label>
              <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label>Ubicación</label>
              <input type="text" name="location" value={formData.location || ''} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label>Experiencia</label>
              <input type="text" name="experience" value={formData.experience || ''} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label>Expectativa Salarial</label>
              <input type="text" name="salaryExpectation" value={formData.salaryExpectation || ''} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label>Preferencia de Trabajo</label>
              <select name="workModePreference" value={formData.workModePreference || ''} onChange={handleChange}>
                <option value="">Seleccionar...</option>
                <option value="Remoto">Remoto</option>
                <option value="Presencial">Presencial</option>
                <option value="Híbrido">Híbrido</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Biografía</label>
              <textarea name="bio" value={formData.bio || ''} onChange={handleChange} rows="4" />
            </div>
            <div className={styles.formGroup}>
              <label>LinkedIn</label>
              <input type="url" name="linkedin" value={formData.linkedin || ''} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
            </div>
            <div className={styles.formGroup}>
              <label>GitHub</label>
              <input type="url" name="github" value={formData.github || ''} onChange={handleChange} placeholder="https://github.com/..." />
            </div>
            <div className={styles.formGroup}>
              <label>Portfolio</label>
              <input type="url" name="portfolio" value={formData.portfolio || ''} onChange={handleChange} placeholder="https://..." />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        </section>

        <section className={styles.section}>
          <h2>Cambiar contraseña</h2>
          <form onSubmit={handleSavePassword}>
            <div className={styles.formGroup}>
              <label>Contraseña actual</label>
              <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Nueva contraseña</label>
              <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required minLength={6} />
            </div>
            <div className={styles.formGroup}>
              <label>Confirmar nueva contraseña</label>
              <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} required minLength={6} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : 'Actualizar contraseña'}
            </button>
          </form>
        </section>

        <section className={styles.section}>
          <h2>Eliminar cuenta</h2>
          <p className={styles.dangerText}>Esta acción es irreversible. Se eliminarán todos tus datos.</p>
          {!showDeleteConfirm ? (
            <button className="btn btn-danger" onClick={() => setShowDeleteConfirm(true)}>
              Eliminar mi cuenta
            </button>
          ) : (
            <div className={styles.confirmDelete}>
              <p>¿Estás seguro? Esta acción no se puede deshacer.</p>
              <div className={styles.confirmActions}>
                <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancelar</button>
                <button className="btn btn-danger" onClick={handleDeleteAccount}>Confirmar eliminación</button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
