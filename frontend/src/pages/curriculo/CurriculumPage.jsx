import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { curriculumService } from '../../services/curriculumService';
import { useCurriculumSection } from '../../hooks/useCurriculumSection';
import SectionEditor from '../../components/curriculum/SectionEditor';
import EmptyState from '../../components/EmptyState';
import styles from './CurriculumPage.module.css';

const SECTION_FIELDS = {
  experience: {
    title: 'Experiencia Laboral',
    emptyMsg: 'No hay experiencia agregada. Agrega tu primera experiencia laboral.',
    fields: [
      { name: 'company', label: 'Empresa', type: 'text', main: true },
      { name: 'position', label: 'Puesto', type: 'text', main: true },
      { name: 'startDate', label: 'Fecha inicio', type: 'date' },
      { name: 'endDate', label: 'Fecha fin', type: 'date' },
      { name: 'description', label: 'Descripción', type: 'textarea', fullWidth: true, show: true },
    ],
  },
  education: {
    title: 'Educación',
    emptyMsg: 'No hay educación agregada. Agrega tu educación formal.',
    fields: [
      { name: 'institution', label: 'Institución', type: 'text', main: true },
      { name: 'degree', label: 'Título', type: 'text', main: true },
      { name: 'field', label: 'Campo de estudio', type: 'text' },
      { name: 'startDate', label: 'Fecha inicio', type: 'date' },
      { name: 'endDate', label: 'Fecha fin', type: 'date' },
      { name: 'description', label: 'Descripción', type: 'textarea', fullWidth: true, show: true },
    ],
  },
  skills: {
    title: 'Habilidades (Skills)',
    emptyMsg: 'No hay skills agregados. Agrega tus habilidades técnicas.',
    fields: [
      { name: 'name', label: 'Skill', type: 'text', main: true },
      { name: 'level', label: 'Nivel', type: 'select', options: ['básico', 'intermedio', 'avanzado', 'experto'], main: true },
    ],
  },
  projects: {
    title: 'Proyectos',
    emptyMsg: 'No hay proyectos agregados. Agrega tus proyectos personales.',
    fields: [
      { name: 'name', label: 'Nombre', type: 'text', main: true },
      { name: 'description', label: 'Descripción', type: 'textarea', fullWidth: true, show: true },
      { name: 'technologies', label: 'Tecnologías', type: 'text', show: true },
      { name: 'link', label: 'Link', type: 'text', show: true },
    ],
  },
  languages: {
    title: 'Idiomas',
    emptyMsg: 'No hay idiomas agregados. Agrega tus idiomas.',
    fields: [
      { name: 'language', label: 'Idioma', type: 'text', main: true },
      { name: 'level', label: 'Nivel', type: 'select', options: ['básico', 'intermedio', 'avanzado', 'nativo'], main: true },
    ],
  },
};

const SECTIONS = ['experience', 'education', 'skills', 'projects', 'languages'];

const CurriculumPage = () => {
  const { user, isCandidate } = useAuth();
  const [curriculum, setCurriculum] = useState({ experience: [], education: [], skills: [], projects: [], languages: [] });
  const [editingItems, setEditingItems] = useState({});
  const [expandedItems, setExpandedItems] = useState({});
  const [saving, setSaving] = useState(false);

  const hooks = {};
  SECTIONS.forEach(key => {
    hooks[key] = useCurriculumSection(key, curriculum, setCurriculum, persistCurriculum);
  });

  const persistCurriculum = (data) => {
    if (user) {
      curriculumService.save(data).catch(() => {});
      localStorage.setItem(`curriculum_${user.id}`, JSON.stringify(data));
    }
  };

  useEffect(() => {
    if (user && isCandidate()) {
      curriculumService.get().then(data => {
        if (data.curriculum) setCurriculum(data.curriculum);
      }).catch(() => {
        const saved = JSON.parse(localStorage.getItem(`curriculum_${user.id}`) || 'null');
        if (saved) setCurriculum(saved);
      });
    }
  }, [user, isCandidate]);

  const saveCurriculum = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await curriculumService.save(curriculum);
      localStorage.setItem(`curriculum_${user.id}`, JSON.stringify(curriculum));
    } catch {
      localStorage.setItem(`curriculum_${user.id}`, JSON.stringify(curriculum));
    }
    setSaving(false);
  };

  if (!user || !isCandidate()) {
    return (
      <div className={`${styles['curriculum-page']} ${styles['not-authorized']}`}>
        <div className="container">
          <h1>No autorizado</h1>
          <p>Esta página es solo para candidatos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['curriculum-page']}>
      <div className="container">
        <header className={styles['curriculum-header']}>
          <h1>Gestión de Currículum</h1>
          <p className={styles['curriculum-subtitle']}>
            Agrega y gestiona los elementos de tu currículum. Marca los elementos que quieres enviar al aplicar a ofertas.
          </p>
          <button className="btn btn-primary" onClick={saveCurriculum} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar Currículum'}
          </button>
        </header>

        <div className={styles['curriculum-content']}>
          {SECTIONS.map(key => {
            const config = SECTION_FIELDS[key];
            const items = curriculum[key] || [];
            return (
              <React.Fragment key={key}>
                <SectionEditor
                  title={config.title}
                  sectionName={key}
                  items={items}
                  fields={config.fields}
                  hook={hooks[key]}
                  editingItems={editingItems}
                  setEditingItems={setEditingItems}
                  expandedItems={expandedItems}
                  setExpandedItems={setExpandedItems}
                />
                {items.length === 0 && !hooks[key].newItem && (
                  <EmptyState title={config.title} message={config.emptyMsg} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CurriculumPage;
