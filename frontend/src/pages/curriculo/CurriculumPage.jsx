import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './CurriculumPage.css';

const CurriculumPage = () => {
  const { user, isCandidate } = useAuth();
  const [curriculum, setCurriculum] = useState({
    experience: [],
    education: [],
    skills: [],
    projects: [],
    languages: []
  });
  const [editingItems, setEditingItems] = useState({});
  const [expandedItems, setExpandedItems] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [newItems, setNewItems] = useState({
    experience: null,
    education: null,
    skills: null,
    projects: null,
    languages: null
  });

  useEffect(() => {
    if (user && isCandidate()) {
      const savedCurriculum = JSON.parse(localStorage.getItem(`curriculum_${user.id}`) || 'null');
      if (savedCurriculum) {
        setCurriculum(savedCurriculum);
      }
    }
  }, [user, isCandidate]);

  const saveCurriculum = () => {
    if (user) {
      localStorage.setItem(`curriculum_${user.id}`, JSON.stringify(curriculum));
      alert('Currículum guardado con éxito');
    }
  };

  const toggleExpanded = (section, id) => {
    const key = `${section}_${id}`;
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const validateDates = (startDate, endDate, section, id) => {
    if (!startDate || !endDate) return true;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < start) {
      setValidationErrors(prev => ({
        ...prev,
        [`${section}_${id}`]: 'La fecha de fin no puede ser anterior a la fecha de inicio'
      }));
      return false;
    }
    
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`${section}_${id}`];
      return newErrors;
    });
    return true;
  };

  const addExperience = () => {
    setNewItems({
      ...newItems,
      experience: {
        id: Date.now(),
        company: '',
        position: '',
      startDate: '',
      endDate: '',
      description: '',
      sendToApplication: true
      }
    });
  };

  const saveNewExperience = () => {
    if (newItems.experience) {
      if (!validateDates(newItems.experience.startDate, newItems.experience.endDate, 'experience', newItems.experience.id)) {
        return;
      }
      setCurriculum({
        ...curriculum,
        experience: [...curriculum.experience, newItems.experience]
      });
      setNewItems({ ...newItems, experience: null });
    }
  };

  const cancelNewExperience = () => {
    setNewItems({ ...newItems, experience: null });
  };

  const updateExperience = (id, field, value) => {
    if (newItems.experience && newItems.experience.id === id) {
      const updated = { ...newItems.experience, [field]: value };
      setNewItems({
        ...newItems,
        experience: updated
      });
      if (field === 'startDate' || field === 'endDate') {
        validateDates(updated.startDate, updated.endDate, 'experience', id);
      }
    } else {
      const updated = curriculum.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      );
      setCurriculum({
        ...curriculum,
        experience: updated
      });
      if (field === 'startDate' || field === 'endDate') {
        const exp = updated.find(e => e.id === id);
        validateDates(exp.startDate, exp.endDate, 'experience', id);
      }
    }
  };

  const startEditingExperience = (id) => {
    setEditingItems({ ...editingItems, [`experience_${id}`]: true });
  };

  const saveExperienceEdit = (id) => {
    setEditingItems({ ...editingItems, [`experience_${id}`]: false });
  };

  const cancelExperienceEdit = (id) => {
    setEditingItems({ ...editingItems, [`experience_${id}`]: false });
  };

  const removeExperience = (id) => {
    setCurriculum({
      ...curriculum,
      experience: curriculum.experience.filter(exp => exp.id !== id)
    });
  };

  const toggleSendToApplication = (id, section) => {
    setCurriculum({
      ...curriculum,
      [section]: curriculum[section].map(item =>
        item.id === id ? { ...item, sendToApplication: !item.sendToApplication } : item
      )
    });
  };

  const addEducation = () => {
    setNewItems({
      ...newItems,
      education: {
        id: Date.now(),
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        description: '',
        sendToApplication: true
      }
    });
  };

  const saveNewEducation = () => {
    if (newItems.education) {
      if (!validateDates(newItems.education.startDate, newItems.education.endDate, 'education', newItems.education.id)) {
        return;
      }
      setCurriculum({
        ...curriculum,
        education: [...curriculum.education, newItems.education]
      });
      setNewItems({ ...newItems, education: null });
    }
  };

  const cancelNewEducation = () => {
    setNewItems({ ...newItems, education: null });
  };

  const updateEducation = (id, field, value) => {
    if (newItems.education && newItems.education.id === id) {
      const updated = { ...newItems.education, [field]: value };
      setNewItems({
        ...newItems,
        education: updated
      });
      if (field === 'startDate' || field === 'endDate') {
        validateDates(updated.startDate, updated.endDate, 'education', id);
      }
    } else {
      const updated = curriculum.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      );
      setCurriculum({
        ...curriculum,
        education: updated
      });
      if (field === 'startDate' || field === 'endDate') {
        const edu = updated.find(e => e.id === id);
        validateDates(edu.startDate, edu.endDate, 'education', id);
      }
    }
  };

  const startEditingEducation = (id) => {
    setEditingItems({ ...editingItems, [`education_${id}`]: true });
  };

  const saveEducationEdit = (id) => {
    setEditingItems({ ...editingItems, [`education_${id}`]: false });
  };

  const cancelEducationEdit = (id) => {
    setEditingItems({ ...editingItems, [`education_${id}`]: false });
  };

  const removeEducation = (id) => {
    setCurriculum({
      ...curriculum,
      education: curriculum.education.filter(edu => edu.id !== id)
    });
  };

  const addSkill = () => {
    setNewItems({
      ...newItems,
      skills: {
        id: Date.now(),
        name: '',
        level: 'intermedio',
        sendToApplication: true
      }
    });
  };

  const saveNewSkill = () => {
    if (newItems.skills) {
      setCurriculum({
        ...curriculum,
        skills: [...curriculum.skills, newItems.skills]
      });
      setNewItems({ ...newItems, skills: null });
    }
  };

  const cancelNewSkill = () => {
    setNewItems({ ...newItems, skills: null });
  };

  const updateSkill = (id, field, value) => {
    if (newItems.skills && newItems.skills.id === id) {
      setNewItems({
        ...newItems,
        skills: { ...newItems.skills, [field]: value }
      });
    } else {
      setCurriculum({
        ...curriculum,
        skills: curriculum.skills.map(skill => 
          skill.id === id ? { ...skill, [field]: value } : skill
        )
      });
    }
  };

  const startEditingSkill = (id) => {
    setEditingItems({ ...editingItems, [`skills_${id}`]: true });
  };

  const saveSkillEdit = (id) => {
    setEditingItems({ ...editingItems, [`skills_${id}`]: false });
  };

  const cancelSkillEdit = (id) => {
    setEditingItems({ ...editingItems, [`skills_${id}`]: false });
  };

  const removeSkill = (id) => {
    setCurriculum({
      ...curriculum,
      skills: curriculum.skills.filter(skill => skill.id !== id)
    });
  };

  const addProject = () => {
    setNewItems({
      ...newItems,
      projects: {
        id: Date.now(),
        name: '',
        description: '',
        technologies: '',
        link: '',
        sendToApplication: true
      }
    });
  };

  const saveNewProject = () => {
    if (newItems.projects) {
      setCurriculum({
        ...curriculum,
        projects: [...curriculum.projects, newItems.projects]
      });
      setNewItems({ ...newItems, projects: null });
    }
  };

  const cancelNewProject = () => {
    setNewItems({ ...newItems, projects: null });
  };

  const updateProject = (id, field, value) => {
    if (newItems.projects && newItems.projects.id === id) {
      setNewItems({
        ...newItems,
        projects: { ...newItems.projects, [field]: value }
      });
    } else {
      setCurriculum({
        ...curriculum,
        projects: curriculum.projects.map(proj => 
          proj.id === id ? { ...proj, [field]: value } : proj
        )
      });
    }
  };

  const startEditingProject = (id) => {
    setEditingItems({ ...editingItems, [`projects_${id}`]: true });
  };

  const saveProjectEdit = (id) => {
    setEditingItems({ ...editingItems, [`projects_${id}`]: false });
  };

  const cancelProjectEdit = (id) => {
    setEditingItems({ ...editingItems, [`projects_${id}`]: false });
  };

  const removeProject = (id) => {
    setCurriculum({
      ...curriculum,
      projects: curriculum.projects.filter(proj => proj.id !== id)
    });
  };

  const addLanguage = () => {
    setNewItems({
      ...newItems,
      languages: {
        id: Date.now(),
        language: '',
        level: 'intermedio',
        sendToApplication: true
      }
    });
  };

  const saveNewLanguage = () => {
    if (newItems.languages) {
      setCurriculum({
        ...curriculum,
        languages: [...curriculum.languages, newItems.languages]
      });
      setNewItems({ ...newItems, languages: null });
    }
  };

  const cancelNewLanguage = () => {
    setNewItems({ ...newItems, languages: null });
  };

  const updateLanguage = (id, field, value) => {
    if (newItems.languages && newItems.languages.id === id) {
      setNewItems({
        ...newItems,
        languages: { ...newItems.languages, [field]: value }
      });
    } else {
      setCurriculum({
        ...curriculum,
        languages: curriculum.languages.map(lang => 
          lang.id === id ? { ...lang, [field]: value } : lang
        )
      });
    }
  };

  const startEditingLanguage = (id) => {
    setEditingItems({ ...editingItems, [`languages_${id}`]: true });
  };

  const saveLanguageEdit = (id) => {
    setEditingItems({ ...editingItems, [`languages_${id}`]: false });
  };

  const cancelLanguageEdit = (id) => {
    setEditingItems({ ...editingItems, [`languages_${id}`]: false });
  };

  const removeLanguage = (id) => {
    setCurriculum({
      ...curriculum,
      languages: curriculum.languages.filter(lang => lang.id !== id)
    });
  };

  if (!user || !isCandidate()) {
    return (
      <div className="curriculum-page not-authorized">
        <div className="container">
          <h1>No autorizado</h1>
          <p>Esta página es solo para candidatos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="curriculum-page">
      <div className="container">
        <header className="curriculum-header">
          <h1>Gestión de Currículum</h1>
          <p className="curriculum-subtitle">
            Agrega y gestiona los elementos de tu currículum. Marca los elementos que quieres enviar al aplicar a ofertas.
          </p>
          <button className="btn btn-primary" onClick={saveCurriculum}>
            Guardar Currículum
          </button>
        </header>

        <div className="curriculum-content">
          {/* Experiencia Laboral */}
          <section className="curriculum-section">
            <div className="section-header">
              <h2>Experiencia Laboral</h2>
              <button className="btn btn-secondary" onClick={addExperience}>
                + Agregar Experiencia
              </button>
            </div>
            
            {/* Formulario para nueva experiencia */}
            {newItems.experience && (
              <div className="curriculum-item editing">
                <div className="item-header">
                  <span className="item-status">Nueva experiencia</span>
                </div>
                <div className="item-content">
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="Empresa"
                      value={newItems.experience.company}
                      onChange={(e) => updateExperience(newItems.experience.id, 'company', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Puesto"
                      value={newItems.experience.position}
                      onChange={(e) => updateExperience(newItems.experience.id, 'position', e.target.value)}
                    />
                  </div>
                  <div className="form-row">
                    <input
                      type="date"
                      value={newItems.experience.startDate}
                      onChange={(e) => updateExperience(newItems.experience.id, 'startDate', e.target.value)}
                    />
                    <input
                      type="date"
                      value={newItems.experience.endDate}
                      onChange={(e) => updateExperience(newItems.experience.id, 'endDate', e.target.value)}
                    />
                  </div>
                  {validationErrors[`experience_${newItems.experience.id}`] && (
                    <div className="validation-error">{validationErrors[`experience_${newItems.experience.id}`]}</div>
                  )}
                  <textarea
                    placeholder="Descripción del puesto..."
                    value={newItems.experience.description}
                    onChange={(e) => updateExperience(newItems.experience.id, 'description', e.target.value)}
                    rows="3"
                  />
                  <div className="form-actions">
                    <button className="btn btn-primary" onClick={saveNewExperience}>
                      Guardar
                    </button>
                    <button className="btn btn-secondary" onClick={cancelNewExperience}>
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Lista de experiencias guardadas */}
            {curriculum.experience.map((exp) => {
              const isEditing = editingItems[`experience_${exp.id}`];
              const isExpanded = expandedItems[`experience_${exp.id}`] || isEditing;
              return (
                <div key={exp.id} className={`curriculum-item ${isEditing ? 'editing' : 'read-only'} ${!isExpanded ? 'collapsed' : ''}`}>
                  <div className="item-header" onClick={() => !isEditing && toggleExpanded('experience', exp.id)}>
                    <input
                      type="checkbox"
                      checked={exp.sendToApplication}
                      onChange={(e) => { e.stopPropagation(); toggleSendToApplication(exp.id, 'experience'); }}
                      className="send-checkbox"
                      title="Enviar en aplicación"
                    />
                    <span className="item-title">{exp.company || 'Sin empresa'} - {exp.position || 'Sin puesto'}</span>
                    {isEditing ? (
                      <button className="btn-delete" onClick={(e) => { e.stopPropagation(); removeExperience(exp.id); }}>
                        🗑️ Eliminar
                      </button>
                    ) : (
                      <button className="btn-edit" onClick={(e) => { e.stopPropagation(); startEditingExperience(exp.id); }}>
                        ✏️ Editar
                      </button>
                    )}
                  </div>
                  
                  {isExpanded && (isEditing ? (
                    <div className="item-content">
                      <div className="form-row">
                        <input
                          type="text"
                          placeholder="Empresa"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Puesto"
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                        />
                      </div>
                      <div className="form-row">
                        <input
                          type="date"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                        />
                        <input
                          type="date"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                        />
                      </div>
                      {validationErrors[`experience_${exp.id}`] && (
                        <div className="validation-error">{validationErrors[`experience_${exp.id}`]}</div>
                      )}
                      <textarea
                        placeholder="Descripción del puesto..."
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        rows="3"
                      />
                      <div className="form-actions">
                        <button className="btn btn-primary" onClick={() => saveExperienceEdit(exp.id)}>
                          Guardar cambios
                        </button>
                        <button className="btn btn-secondary" onClick={() => cancelExperienceEdit(exp.id)}>
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="item-content read-view">
                      <div className="read-row">
                        <span className="read-label">Empresa:</span>
                        <span className="read-value">{exp.company || 'No especificado'}</span>
                      </div>
                      <div className="read-row">
                        <span className="read-label">Puesto:</span>
                        <span className="read-value">{exp.position || 'No especificado'}</span>
                      </div>
                      <div className="read-row">
                        <span className="read-label">Periodo:</span>
                        <span className="read-value">
                          {exp.startDate ? new Date(exp.startDate).toLocaleDateString('es-ES') : 'No especificado'} 
                          {' - '}
                          {exp.endDate ? new Date(exp.endDate).toLocaleDateString('es-ES') : 'Presente'}
                        </span>
                      </div>
                      {exp.description && (
                        <div className="read-row">
                          <span className="read-label">Descripción:</span>
                          <span className="read-value">{exp.description}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
            {curriculum.experience.length === 0 && !newItems.experience && (
              <p className="empty-message">No hay experiencia agregada. Agrega tu primera experiencia laboral.</p>
            )}
          </section>

          {/* Educación */}
          <section className="curriculum-section">
            <div className="section-header">
              <h2>Educación</h2>
              <button className="btn btn-secondary" onClick={addEducation}>
                + Agregar Educación
              </button>
            </div>
            
            {newItems.education && (
              <div className="curriculum-item editing">
                <div className="item-header">
                  <span className="item-status">Nueva educación</span>
                </div>
                <div className="item-content">
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="Institución"
                      value={newItems.education.institution}
                      onChange={(e) => updateEducation(newItems.education.id, 'institution', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Título"
                      value={newItems.education.degree}
                      onChange={(e) => updateEducation(newItems.education.id, 'degree', e.target.value)}
                    />
                  </div>
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="Campo de estudio"
                      value={newItems.education.field}
                      onChange={(e) => updateEducation(newItems.education.id, 'field', e.target.value)}
                    />
                    <input
                      type="date"
                      value={newItems.education.startDate}
                      onChange={(e) => updateEducation(newItems.education.id, 'startDate', e.target.value)}
                    />
                    <input
                      type="date"
                      value={newItems.education.endDate}
                      onChange={(e) => updateEducation(newItems.education.id, 'endDate', e.target.value)}
                    />
                  </div>
                  {validationErrors[`education_${newItems.education.id}`] && (
                    <div className="validation-error">{validationErrors[`education_${newItems.education.id}`]}</div>
                  )}
                  <textarea
                    placeholder="Descripción..."
                    value={newItems.education.description}
                    onChange={(e) => updateEducation(newItems.education.id, 'description', e.target.value)}
                    rows="2"
                  />
                  <div className="form-actions">
                    <button className="btn btn-primary" onClick={saveNewEducation}>Guardar</button>
                    <button className="btn btn-secondary" onClick={cancelNewEducation}>Cancelar</button>
                  </div>
                </div>
              </div>
            )}

            {curriculum.education.map((edu) => {
              const isEditing = editingItems[`education_${edu.id}`];
              const isExpanded = expandedItems[`education_${edu.id}`] || isEditing;
              return (
                <div key={edu.id} className={`curriculum-item ${isEditing ? 'editing' : 'read-only'} ${!isExpanded ? 'collapsed' : ''}`}>
                  <div className="item-header" onClick={() => !isEditing && toggleExpanded('education', edu.id)}>
                    <input
                      type="checkbox"
                      checked={edu.sendToApplication}
                      onChange={(e) => { e.stopPropagation(); toggleSendToApplication(edu.id, 'education'); }}
                      className="send-checkbox"
                      title="Enviar en aplicación"
                    />
                    <span className="item-title">{edu.institution || 'Sin institución'} - {edu.degree || 'Sin título'}</span>
                    {isEditing ? (
                      <button className="btn-delete" onClick={(e) => { e.stopPropagation(); removeEducation(edu.id); }}>🗑️ Eliminar</button>
                    ) : (
                      <button className="btn-edit" onClick={(e) => { e.stopPropagation(); startEditingEducation(edu.id); }}>✏️ Editar</button>
                    )}
                  </div>
                  {isExpanded && (isEditing ? (
                    <div className="item-content">
                      <div className="form-row">
                        <input type="text" placeholder="Institución" value={edu.institution} onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)} />
                        <input type="text" placeholder="Título" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} />
                      </div>
                      <div className="form-row">
                        <input type="text" placeholder="Campo de estudio" value={edu.field} onChange={(e) => updateEducation(edu.id, 'field', e.target.value)} />
                        <input type="date" value={edu.startDate} onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)} />
                        <input type="date" value={edu.endDate} onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)} />
                      </div>
                      {validationErrors[`education_${edu.id}`] && (
                        <div className="validation-error">{validationErrors[`education_${edu.id}`]}</div>
                      )}
                      <textarea placeholder="Descripción..." value={edu.description} onChange={(e) => updateEducation(edu.id, 'description', e.target.value)} rows="2" />
                      <div className="form-actions">
                        <button className="btn btn-primary" onClick={() => saveEducationEdit(edu.id)}>Guardar cambios</button>
                        <button className="btn btn-secondary" onClick={() => cancelEducationEdit(edu.id)}>Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <div className="item-content read-view">
                      <div className="read-row"><span className="read-label">Institución:</span><span className="read-value">{edu.institution || 'No especificado'}</span></div>
                      <div className="read-row"><span className="read-label">Título:</span><span className="read-value">{edu.degree || 'No especificado'}</span></div>
                      <div className="read-row"><span className="read-label">Campo:</span><span className="read-value">{edu.field || 'No especificado'}</span></div>
                      <div className="read-row"><span className="read-label">Periodo:</span><span className="read-value">{edu.startDate ? new Date(edu.startDate).toLocaleDateString('es-ES') : 'No especificado'} - {edu.endDate ? new Date(edu.endDate).toLocaleDateString('es-ES') : 'Presente'}</span></div>
                      {edu.description && <div className="read-row"><span className="read-label">Descripción:</span><span className="read-value">{edu.description}</span></div>}
                    </div>
                  ))}
                </div>
              );
            })}
            {curriculum.education.length === 0 && !newItems.education && (
              <p className="empty-message">No hay educación agregada. Agrega tu educación formal.</p>
            )}
          </section>

          {/* Skills */}
          <section className="curriculum-section">
            <div className="section-header">
              <h2>Habilidades (Skills)</h2>
              <button className="btn btn-secondary" onClick={addSkill}>
                + Agregar Skill
              </button>
            </div>
            
            {newItems.skills && (
              <div className="curriculum-item editing skill-item">
                <div className="item-header"><span className="item-status">Nuevo skill</span></div>
                <div className="item-content">
                  <div className="form-row">
                    <input type="text" placeholder="Skill (ej: React, Python, JavaScript)" value={newItems.skills.name} onChange={(e) => updateSkill(newItems.skills.id, 'name', e.target.value)} />
                    <select value={newItems.skills.level} onChange={(e) => updateSkill(newItems.skills.id, 'level', e.target.value)}>
                      <option value="básico">Básico</option>
                      <option value="intermedio">Intermedio</option>
                      <option value="avanzado">Avanzado</option>
                      <option value="experto">Experto</option>
                    </select>
                  </div>
                  <div className="form-actions">
                    <button className="btn btn-primary" onClick={saveNewSkill}>Guardar</button>
                    <button className="btn btn-secondary" onClick={cancelNewSkill}>Cancelar</button>
                  </div>
                </div>
              </div>
            )}

            {curriculum.skills.map((skill) => {
              const isEditing = editingItems[`skills_${skill.id}`];
              const isExpanded = expandedItems[`skills_${skill.id}`] || isEditing;
              return (
                <div key={skill.id} className={`curriculum-item skill-item ${isEditing ? 'editing' : 'read-only'} ${!isExpanded ? 'collapsed' : ''}`}>
                  <div className="item-header" onClick={() => !isEditing && toggleExpanded('skills', skill.id)}>
                    <input type="checkbox" checked={skill.sendToApplication} onChange={(e) => { e.stopPropagation(); toggleSendToApplication(skill.id, 'skills'); }} className="send-checkbox" title="Enviar en aplicación" />
                    <span className="item-title">{skill.name || 'Sin skill'} - {skill.level || 'Sin nivel'}</span>
                    {isEditing ? (
                      <button className="btn-delete" onClick={(e) => { e.stopPropagation(); removeSkill(skill.id); }}>🗑️ Eliminar</button>
                    ) : (
                      <button className="btn-edit" onClick={(e) => { e.stopPropagation(); startEditingSkill(skill.id); }}>✏️ Editar</button>
                    )}
                  </div>
                  {isExpanded && (isEditing ? (
                    <div className="item-content">
                      <div className="form-row">
                        <input type="text" placeholder="Skill (ej: React, Python, JavaScript)" value={skill.name} onChange={(e) => updateSkill(skill.id, 'name', e.target.value)} />
                        <select value={skill.level} onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}>
                          <option value="básico">Básico</option>
                          <option value="intermedio">Intermedio</option>
                          <option value="avanzado">Avanzado</option>
                          <option value="experto">Experto</option>
                        </select>
                      </div>
                      <div className="form-actions">
                        <button className="btn btn-primary" onClick={() => saveSkillEdit(skill.id)}>Guardar cambios</button>
                        <button className="btn btn-secondary" onClick={() => cancelSkillEdit(skill.id)}>Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <div className="item-content read-view">
                      <div className="read-row"><span className="read-label">Skill:</span><span className="read-value">{skill.name || 'No especificado'}</span></div>
                      <div className="read-row"><span className="read-label">Nivel:</span><span className="read-value">{skill.level || 'No especificado'}</span></div>
                    </div>
                  ))}
                </div>
              );
            })}
            {curriculum.skills.length === 0 && !newItems.skills && (
              <p className="empty-message">No hay skills agregados. Agrega tus habilidades técnicas.</p>
            )}
          </section>

          {/* Proyectos */}
          <section className="curriculum-section">
            <div className="section-header">
              <h2>Proyectos</h2>
              <button className="btn btn-secondary" onClick={addProject}>
                + Agregar Proyecto
              </button>
            </div>
            
            {newItems.projects && (
              <div className="curriculum-item editing">
                <div className="item-header"><span className="item-status">Nuevo proyecto</span></div>
                <div className="item-content">
                  <input type="text" placeholder="Nombre del proyecto" value={newItems.projects.name} onChange={(e) => updateProject(newItems.projects.id, 'name', e.target.value)} />
                  <textarea placeholder="Descripción del proyecto..." value={newItems.projects.description} onChange={(e) => updateProject(newItems.projects.id, 'description', e.target.value)} rows="2" />
                  <div className="form-row">
                    <input type="text" placeholder="Tecnologías (separadas por coma)" value={newItems.projects.technologies} onChange={(e) => updateProject(newItems.projects.id, 'technologies', e.target.value)} />
                    <input type="url" placeholder="Link al proyecto (opcional)" value={newItems.projects.link} onChange={(e) => updateProject(newItems.projects.id, 'link', e.target.value)} />
                  </div>
                  <div className="form-actions">
                    <button className="btn btn-primary" onClick={saveNewProject}>Guardar</button>
                    <button className="btn btn-secondary" onClick={cancelNewProject}>Cancelar</button>
                  </div>
                </div>
              </div>
            )}

            {curriculum.projects.map((proj) => {
              const isEditing = editingItems[`projects_${proj.id}`];
              const isExpanded = expandedItems[`projects_${proj.id}`] || isEditing;
              return (
                <div key={proj.id} className={`curriculum-item ${isEditing ? 'editing' : 'read-only'} ${!isExpanded ? 'collapsed' : ''}`}>
                  <div className="item-header" onClick={() => !isEditing && toggleExpanded('projects', proj.id)}>
                    <input type="checkbox" checked={proj.sendToApplication} onChange={(e) => { e.stopPropagation(); toggleSendToApplication(proj.id, 'projects'); }} className="send-checkbox" title="Enviar en aplicación" />
                    <span className="item-title">{proj.name || 'Sin nombre'}</span>
                    {isEditing ? (
                      <button className="btn-delete" onClick={(e) => { e.stopPropagation(); removeProject(proj.id); }}>🗑️ Eliminar</button>
                    ) : (
                      <button className="btn-edit" onClick={(e) => { e.stopPropagation(); startEditingProject(proj.id); }}>✏️ Editar</button>
                    )}
                  </div>
                  {isExpanded && (isEditing ? (
                    <div className="item-content">
                      <input type="text" placeholder="Nombre del proyecto" value={proj.name} onChange={(e) => updateProject(proj.id, 'name', e.target.value)} />
                      <textarea placeholder="Descripción del proyecto..." value={proj.description} onChange={(e) => updateProject(proj.id, 'description', e.target.value)} rows="2" />
                      <div className="form-row">
                        <input type="text" placeholder="Tecnologías (separadas por coma)" value={proj.technologies} onChange={(e) => updateProject(proj.id, 'technologies', e.target.value)} />
                        <input type="url" placeholder="Link al proyecto (opcional)" value={proj.link} onChange={(e) => updateProject(proj.id, 'link', e.target.value)} />
                      </div>
                      <div className="form-actions">
                        <button className="btn btn-primary" onClick={() => saveProjectEdit(proj.id)}>Guardar cambios</button>
                        <button className="btn btn-secondary" onClick={() => cancelProjectEdit(proj.id)}>Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <div className="item-content read-view">
                      <div className="read-row"><span className="read-label">Nombre:</span><span className="read-value">{proj.name || 'No especificado'}</span></div>
                      {proj.description && <div className="read-row"><span className="read-label">Descripción:</span><span className="read-value">{proj.description}</span></div>}
                      <div className="read-row"><span className="read-label">Tecnologías:</span><span className="read-value">{proj.technologies || 'No especificado'}</span></div>
                      {proj.link && <div className="read-row"><span className="read-label">Link:</span><span className="read-value"><a href={proj.link} target="_blank" rel="noopener noreferrer">{proj.link}</a></span></div>}
                    </div>
                  ))}
                </div>
              );
            })}
            {curriculum.projects.length === 0 && !newItems.projects && (
              <p className="empty-message">No hay proyectos agregados. Agrega tus proyectos personales.</p>
            )}
          </section>

          {/* Idiomas */}
          <section className="curriculum-section">
            <div className="section-header">
              <h2>Idiomas</h2>
              <button className="btn btn-secondary" onClick={addLanguage}>
                + Agregar Idioma
              </button>
            </div>
            
            {newItems.languages && (
              <div className="curriculum-item editing language-item">
                <div className="item-header"><span className="item-status">Nuevo idioma</span></div>
                <div className="item-content">
                  <div className="form-row">
                    <input type="text" placeholder="Idioma (ej: Inglés, Francés)" value={newItems.languages.language} onChange={(e) => updateLanguage(newItems.languages.id, 'language', e.target.value)} />
                    <select value={newItems.languages.level} onChange={(e) => updateLanguage(newItems.languages.id, 'level', e.target.value)}>
                      <option value="básico">Básico</option>
                      <option value="intermedio">Intermedio</option>
                      <option value="avanzado">Avanzado</option>
                      <option value="nativo">Nativo</option>
                    </select>
                  </div>
                  <div className="form-actions">
                    <button className="btn btn-primary" onClick={saveNewLanguage}>Guardar</button>
                    <button className="btn btn-secondary" onClick={cancelNewLanguage}>Cancelar</button>
                  </div>
                </div>
              </div>
            )}

            {curriculum.languages.map((lang) => {
              const isEditing = editingItems[`languages_${lang.id}`];
              const isExpanded = expandedItems[`languages_${lang.id}`] || isEditing;
              return (
                <div key={lang.id} className={`curriculum-item language-item ${isEditing ? 'editing' : 'read-only'} ${!isExpanded ? 'collapsed' : ''}`}>
                  <div className="item-header" onClick={() => !isEditing && toggleExpanded('languages', lang.id)}>
                    <input type="checkbox" checked={lang.sendToApplication} onChange={(e) => { e.stopPropagation(); toggleSendToApplication(lang.id, 'languages'); }} className="send-checkbox" title="Enviar en aplicación" />
                    <span className="item-title">{lang.language || 'Sin idioma'} - {lang.level || 'Sin nivel'}</span>
                    {isEditing ? (
                      <button className="btn-delete" onClick={(e) => { e.stopPropagation(); removeLanguage(lang.id); }}>🗑️ Eliminar</button>
                    ) : (
                      <button className="btn-edit" onClick={(e) => { e.stopPropagation(); startEditingLanguage(lang.id); }}>✏️ Editar</button>
                    )}
                  </div>
                  {isExpanded && (isEditing ? (
                    <div className="item-content">
                      <div className="form-row">
                        <input type="text" placeholder="Idioma (ej: Inglés, Francés)" value={lang.language} onChange={(e) => updateLanguage(lang.id, 'language', e.target.value)} />
                        <select value={lang.level} onChange={(e) => updateLanguage(lang.id, 'level', e.target.value)}>
                          <option value="básico">Básico</option>
                          <option value="intermedio">Intermedio</option>
                          <option value="avanzado">Avanzado</option>
                          <option value="nativo">Nativo</option>
                        </select>
                      </div>
                      <div className="form-actions">
                        <button className="btn btn-primary" onClick={() => saveLanguageEdit(lang.id)}>Guardar cambios</button>
                        <button className="btn btn-secondary" onClick={() => cancelLanguageEdit(lang.id)}>Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <div className="item-content read-view">
                      <div className="read-row"><span className="read-label">Idioma:</span><span className="read-value">{lang.language || 'No especificado'}</span></div>
                      <div className="read-row"><span className="read-label">Nivel:</span><span className="read-value">{lang.level || 'No especificado'}</span></div>
                    </div>
                  ))}
                </div>
              );
            })}
            {curriculum.languages.length === 0 && !newItems.languages && (
              <p className="empty-message">No hay idiomas agregados. Agrega tus idiomas.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default CurriculumPage;
