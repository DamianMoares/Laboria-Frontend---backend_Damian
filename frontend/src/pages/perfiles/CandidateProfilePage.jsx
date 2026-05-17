import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ProfilePage.module.css';

const CandidateProfilePage = () => {
  const { user, logout, isCandidate } = useAuth();
  const navigate = useNavigate();
  const [curriculum, setCurriculum] = useState({
    experience: [],
    education: [],
    skills: [],
    projects: [],
    languages: []
  });

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
      <div className={styles['profile-page'] + ' ' + styles['not-authorized']}>
        <div className="container">
          <h1>No autorizado</h1>
          <p>Esta página es solo para candidatos.</p>
          <Link to="/" className="btn btn-primary">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  const profile = JSON.parse(localStorage.getItem(`profile_${user.id}`) || 'null') || user.profile || {};

  return (
    <div className={styles['profile-page'] + ' candidate-profile-page'}>
      <div className="container">
        <header className={styles['profile-header']}>
          <div className={styles['profile-header-content']}>
            <div className={styles['profile-avatar']}>
              {profile.firstName ? profile.firstName[0] : user.name[0]}
              {profile.lastName ? profile.lastName[0] : ''}
            </div>
            <div className={styles['profile-info']}>
              <h1>{profile.firstName || user.name} {profile.lastName || ''}</h1>
              <p className={styles['profile-email']}>{profile.email}</p>
              <p className={styles['profile-location']}>{profile.location}</p>
            </div>
          </div>
          <button className="btn btn-secondary" onClick={() => { logout(); navigate('/'); }}>
            Cerrar Sesión
          </button>
        </header>

        <div className={styles['profile-content']}>
          <div className={styles['profile-main']}>
            <section className={styles['profile-section']}>
              <h2>Información Personal</h2>
              <div className={styles['info-grid']}>
                <div className={styles['info-item']}>
                  <span className={styles['info-label']}>Email:</span>
                  <span className={styles['info-value']}>{profile.email}</span>
                </div>
                <div className={styles['info-item']}>
                  <span className={styles['info-label']}>Teléfono:</span>
                  <span className={styles['info-value']}>{profile.phone || 'No especificado'}</span>
                </div>
                <div className={styles['info-item']}>
                  <span className={styles['info-label']}>Ubicación:</span>
                  <span className={styles['info-value']}>{profile.location}</span>
                </div>
                <div className={styles['info-item']}>
                  <span className={styles['info-label']}>Experiencia:</span>
                  <span className={styles['info-value']}>{profile.experience || 'No especificado'}</span>
                </div>
                <div className={styles['info-item']}>
                  <span className={styles['info-label']}>Expectativa salarial:</span>
                  <span className={styles['info-value']}>{profile.salaryExpectation || 'No especificado'}</span>
                </div>
                <div className={styles['info-item']}>
                  <span className={styles['info-label']}>Preferencia de trabajo:</span>
                  <span className={styles['info-value']}>{profile.workModePreference || 'No especificado'}</span>
                </div>
              </div>
            </section>

            <section className={styles['profile-section']}>
              <h2>Biografía</h2>
              <p className={styles['bio-text']}>{profile.bio || 'No hay biografía'}</p>
            </section>

            {curriculum.experience.length > 0 && (
              <section className={styles['profile-section']}>
                <h2>Experiencia Laboral</h2>
                <div className={styles['curriculum-list']}>
                  {curriculum.experience.map((exp) => (
                    <div key={exp.id} className={styles['curriculum-item']}>
                      <h4>{exp.position} - {exp.company}</h4>
                      <p className={styles['curriculum-date']}>{exp.startDate} - {exp.endDate || 'Actualidad'}</p>
                      <p>{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {curriculum.education.length > 0 && (
              <section className={styles['profile-section']}>
                <h2>Educación</h2>
                <div className={styles['curriculum-list']}>
                  {curriculum.education.map((edu) => (
                    <div key={edu.id} className={styles['curriculum-item']}>
                      <h4>{edu.degree} - {edu.institution}</h4>
                      <p className={styles['curriculum-date']}>{edu.startDate} - {edu.endDate}</p>
                      {edu.field && <p>Campo: {edu.field}</p>}
                      {edu.description && <p>{edu.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className={styles['profile-section']}>
              <h2>Skills</h2>
              <div className={styles['skills-container']}>
                {curriculum.skills.length > 0 ? (
                  curriculum.skills.map((skill, index) => (
                    <span key={index} className={styles['skill-tag']}>
                      {skill.name} ({skill.level})
                    </span>
                  ))
                ) : profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill, index) => (
                    <span key={index} className={styles['skill-tag']}>{skill}</span>
                  ))
                ) : (
                  <p className={styles['no-data']}>No hay skills especificados</p>
                )}
              </div>
            </section>

            {curriculum.projects.length > 0 && (
              <section className={styles['profile-section']}>
                <h2>Proyectos</h2>
                <div className={styles['curriculum-list']}>
                  {curriculum.projects.map((proj) => (
                    <div key={proj.id} className={styles['curriculum-item']}>
                      <h4>{proj.name}</h4>
                      <p>{proj.description}</p>
                      {proj.technologies && <p>Tecnologías: {proj.technologies}</p>}
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className={styles['profile-link']}>
                          Ver proyecto
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {curriculum.languages.length > 0 && (
              <section className={styles['profile-section']}>
                <h2>Idiomas</h2>
                <div className={styles['skills-container']}>
                  {curriculum.languages.map((lang, index) => (
                    <span key={index} className={styles['skill-tag']}>
                      {lang.language} ({lang.level})
                    </span>
                  ))}
                </div>
              </section>
            )}

            <section className={styles['profile-section']}>
              <h2>Enlaces</h2>
              <div className={styles['links-container']}>
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={styles['profile-link']}>
                    LinkedIn
                  </a>
                )}
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" className={styles['profile-link']}>
                    GitHub
                  </a>
                )}
                {profile.portfolio && (
                  <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className={styles['profile-link']}>
                    Portfolio
                  </a>
                )}
                {!profile.linkedin && !profile.github && !profile.portfolio && (
                  <p className={styles['no-data']}>No hay enlaces especificados</p>
                )}
              </div>
            </section>
          </div>

          <aside className={styles['profile-sidebar']}>
            <div className={styles['sidebar-card']}>
              <h3>Estadísticas</h3>
              <div className={styles['stat-item']}>
                <span className={styles['stat-value']}>0</span>
                <span className={styles['stat-label']}>Aplicaciones</span>
              </div>
              <div className={styles['stat-item']}>
                <span className={styles['stat-value']}>0</span>
                <span className={styles['stat-label']}>Cursos guardados</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

    </div>
  );
};

export default CandidateProfilePage;
