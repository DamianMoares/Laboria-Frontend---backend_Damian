import { useState } from 'react';

export const useCurriculumSection = (sectionName, curriculum, setCurriculum, persistCurriculum) => {
  const [newItem, setNewItem] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const validateDates = (startDate, endDate, id) => {
    if (!startDate || !endDate) return true;
    if (new Date(endDate) < new Date(startDate)) {
      setValidationErrors(prev => ({ ...prev, [`${sectionName}_${id}`]: 'La fecha de fin no puede ser anterior a la fecha de inicio' }));
      return false;
    }
    setValidationErrors(prev => { const next = { ...prev }; delete next[`${sectionName}_${id}`]; return next; });
    return true;
  };

  const add = (template) => setNewItem({ id: Date.now(), sendToApplication: true, ...template });

  const saveNew = () => {
    if (!newItem) return;
    const updated = { ...curriculum, [sectionName]: [...curriculum[sectionName], newItem] };
    setCurriculum(updated);
    persistCurriculum(updated);
    setNewItem(null);
  };

  const cancelNew = () => setNewItem(null);

  const update = (id, field, value) => {
    if (newItem && newItem.id === id) {
      setNewItem(prev => ({ ...prev, [field]: value }));
      if (field === 'startDate' || field === 'endDate') {
        const updated = { ...newItem, [field]: value };
        validateDates(updated.startDate, updated.endDate, id);
      }
    } else {
      setCurriculum(prev => ({
        ...prev,
        [sectionName]: prev[sectionName].map(item =>
          item.id === id ? { ...item, [field]: value } : item
        )
      }));
    }
  };

  const startEditing = (id, setEditingItems) => setEditingItems(prev => ({ ...prev, [`${sectionName}_${id}`]: true }));

  const saveEdit = (id, setEditingItems) => { setEditingItems(prev => ({ ...prev, [`${sectionName}_${id}`]: false })); persistCurriculum(curriculum); };

  const cancelEdit = (id, setEditingItems) => setEditingItems(prev => ({ ...prev, [`${sectionName}_${id}`]: false }));

  const remove = (id) => {
    const updated = { ...curriculum, [sectionName]: curriculum[sectionName].filter(item => item.id !== id) };
    setCurriculum(updated);
    persistCurriculum(updated);
  };

  const toggleSendToApplication = (id) => setCurriculum(prev => ({
    ...prev,
    [sectionName]: prev[sectionName].map(item =>
      item.id === id ? { ...item, sendToApplication: !item.sendToApplication } : item
    )
  }));

  return { newItem, validationErrors, setValidationErrors, validateDates, add, saveNew, cancelNew, update, startEditing, saveEdit, cancelEdit, remove, toggleSendToApplication };
};
