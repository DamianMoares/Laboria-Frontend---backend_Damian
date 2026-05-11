import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import EditProfileModal from '../../components/EditProfileModal';
import './ProfilePage.css';

const CandidateProfilePage = () => {
  const { user, logout, isCandidate, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [curriculum, setCurriculum] = useState({
    experience: [],
    education: [],
    skills: [],
    projects: [],
    languages: []
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (user && isCandidate()) {
      const savedCurriculum = JSON.parse(localStorage.getItem(`curriculum_${user.id}`) || 'null');
      if (savedCurriculum) {
        setCurriculum(savedCurriculum);
      }
    }
  }, [user, isCandidate]);

  if (!user || !isCandidate()) {
    return (
      <div className="profile-page not-authorized">
        <div className="container">
          <h1>No autorizado</h1>
          <p>Esta página es solo para candidatos.</p>
          <Link to="/" className="btn btn-primary">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  const profile = user.profile || {};

  return (
    <div className="profile-page candidate-profile-page">
      <div className="container">
        <header className="profile-header">
          <div className="profile-header-content">
            <div className="profile-avatar">
              {profile.firstName ? profile.firstName[0] : user.name[0]}
              {profile.lastName ? profile.lastName[0] : ''}
            </div>
            <div className="profile-info">
              <h1>{profile.firstName} {profile.lastName}</h1>
              <p className="profile-email">{profile.email}</p>
              <p className="profile-location">{profile.location}</p>
            </div>
          </div>
          <button className="btn btn-secondary" onClick={logout}>
            Cerrar Sesión
          </button>
        </header>

        <div className="profile-content">
          <div className="profile-main">
            <section className="profile-section">
              <h2>Información Personal</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{profile.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Teléfono:</span>
                  <span className="info-value">{profile.phone || 'No especificado'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Ubicación:</span>
                  <span className="info-value">{profile.location}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Experiencia:</span>
                  <span className="info-value">{profile.experience || 'No especificado'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Expectativa salarial:</span>
                  <span className="info-value">{profile.salaryExpectation || 'No especificado'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Preferencia de trabajo:</span>
                  <span className="info-value">{profile.workModePreference || 'No especificado'}</span>
                </div>
              </div>
            </section>

            <section className="profile-section">
              <h2>Biografía</h2>
              <p className="bio-text">{profile.bio || 'No hay biografía'}</p>
            </section>

            {curriculum.experience.length > 0 && (
              <section className="profile-section">
                <h2>Experiencia Laboral</h2>
                <div className="curriculum-list">
                  {curriculum.experience.map((exp) => (
                    <div key={exp.id} className="curriculum-item">
                      <h4>{exp.position} - {exp.company}</h4>
                      <p className="curriculum-date">{exp.startDate} - {exp.endDate || 'Actualidad'}</p>
                      <p>{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {curriculum.education.length > 0 && (
              <section className="profile-section">
                <h2>Educación</h2>
                <div className="curriculum-list">
                  {curriculum.education.map((edu) => (
                    <div key={edu.id} className="curriculum-item">
                      <h4>{edu.degree} - {edu.institution}</h4>
                      <p className="curriculum-date">{edu.startDate} - {edu.endDate}</p>
                      {edu.field && <p>Campo: {edu.field}</p>}
                      {edu.description && <p>{edu.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="profile-section">
              <h2>Skills</h2>
              <div className="skills-container">
                {curriculum.skills.length > 0 ? (
                  curriculum.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill.name} ({skill.level})
                    </span>
                  ))
                ) : profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))
                ) : (
                  <p className="no-data">No hay skills especificados</p>
                )}
              </div>
            </section>

            {curriculum.projects.length > 0 && (
              <section className="profile-section">
                <h2>Proyectos</h2>
                <div className="curriculum-list">
                  {curriculum.projects.map((proj) => (
                    <div key={proj.id} className="curriculum-item">
                      <h4>{proj.name}</h4>
                      <p>{proj.description}</p>
                      {proj.technologies && <p>Tecnologías: {proj.technologies}</p>}
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="profile-link">
                          Ver proyecto
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {curriculum.languages.length > 0 && (
              <section className="profile-section">
                <h2>Idiomas</h2>
                <div className="skills-container">
                  {curriculum.languages.map((lang, index) => (
                    <span key={index} className="skill-tag">
                      {lang.language} ({lang.level})
                    </span>
                  ))}
                </div>
              </section>
            )}

            <section className="profile-section">
              <h2>Enlaces</h2>
              <div className="links-container">
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="profile-link">
                    LinkedIn
                  </a>
                )}
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" className="profile-link">
                    GitHub
                  </a>
                )}
                {profile.portfolio && (
                  <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="profile-link">
                    Portfolio
                  </a>
                )}
                {!profile.linkedin && !profile.github && !profile.portfolio && (
                  <p className="no-data">No hay enlaces especificados</p>
                )}
              </div>
            </section>
          </div>

          <aside className="profile-sidebar">
            <div className="sidebar-card">
              <h3>Acciones rápidas</h3>
              <Link to="/panel" className="sidebar-action">
                Resumen
              </Link>
              <Link to="/empleos" className="sidebar-action">
                Buscar Empleo
              </Link>
              <Link to="/cursos" className="sidebar-action">
                Buscar Cursos
              </Link>
              <Link to="/curriculum" className="sidebar-action">
                Gestionar Currículum
              </Link>
              <button className="sidebar-action" onClick={() => setIsEditModalOpen(true)}>
                Editar Perfil
              </button>
              <button className="sidebar-action delete-account" onClick={() => setIsDeleteModalOpen(true)}>
                Eliminar Cuenta
              </button>
            </div>

            <div className="sidebar-card">
              <h3>Estadísticas</h3>
              <div className="stat-item">
                <span className="stat-value">0</span>
                <span className="stat-label">Aplicaciones</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">0</span>
                <span className="stat-label">Cursos guardados</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        userType="candidate" 
      />

      {isDeleteModalOpen && (
        <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Eliminar Cuenta</h2>
              <button className="modal-close" onClick={() => setIsDeleteModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible y se perderán todos tus datos.</p>
              <div className="form-actions">
                <button className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>
                  Cancelar
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={() => {
                    deleteAccount();
                    navigate('/');
                  }}
                >
                  Confirmar Eliminación
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateProfilePage;
