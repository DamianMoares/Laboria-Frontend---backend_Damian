import { useState, useEffect, useCallback } from 'react';
import useLocalStorage, { getUserStorageKey } from './useLocalStorage';

/**
 * Clave base para almacenar currículums en localStorage.
 */
const CURRICULUM_KEY = 'curriculum';

/**
 * Estructura por defecto del currículum.
 */
const defaultCurriculum = {
  experience: [],
  education: [],
  skills: [],
  projects: [],
  languages: []
};

/**
 * Crea un item vacío según la sección del currículum.
 * @param {string} section - Sección (experience, education, skills, projects, languages)
 * @returns {Object} Item con campos por defecto
 */
const createItem = (section) => {
  const id = Date.now();
  const sendToApplication = true;

  switch (section) {
    case 'experience':
      return { id, company: '', position: '', startDate: '', endDate: '', description: '', sendToApplication };
    case 'education':
      return { id, institution: '', degree: '', field: '', startDate: '', endDate: '', description: '', sendToApplication };
    case 'skills':
      return { id, name: '', level: 'intermedio', sendToApplication };
    case 'projects':
      return { id, name: '', description: '', technologies: '', link: '', sendToApplication };
    case 'languages':
      return { id, language: '', level: 'intermedio', sendToApplication };
    default:
      return { id, sendToApplication };
  }
};

/**
 * Hook para gestión de currículum con persistencia en localStorage.
 * @param {number|string} userId - ID del usuario para clave única
 * @returns {Object} Estado y funciones CRUD del currículum
 */
const useCurriculum = (userId) => {
  const storageKey = userId ? getUserStorageKey(CURRICULUM_KEY, userId) : null;
  const [curriculum, setCurriculum] = useLocalStorage(
    storageKey || 'curriculum_empty',
    defaultCurriculum
  );

  /**
   * Agrega un item vacío a una sección.
   * @param {string} section - Sección donde agregar
   */
  const addItem = useCallback((section) => {
    const newItem = createItem(section);
    setCurriculum(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), newItem]
    }));
  }, [setCurriculum]);

  /**
   * Actualiza un campo específico de un item.
   * @param {string} section - Sección del item
   * @param {number} id - ID del item
   * @param {string} field - Campo a actualizar
   * @param {*} value - Nuevo valor
   */
  const updateItem = useCallback((section, id, field, value) => {
    setCurriculum(prev => ({
      ...prev,
      [section]: (prev[section] || []).map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  }, [setCurriculum]);

  /**
   * Elimina un item de una sección.
   * @param {string} section - Sección del item
   * @param {number} id - ID del item a eliminar
   */
  const removeItem = useCallback((section, id) => {
    setCurriculum(prev => ({
      ...prev,
      [section]: (prev[section] || []).filter(item => item.id !== id)
    }));
  }, [setCurriculum]);

  /**
   * Alterna el flag sendToApplication de un item.
   * @param {string} section - Sección del item
   * @param {number} id - ID del item
   */
  const toggleSendToApplication = useCallback((section, id) => {
    setCurriculum(prev => ({
      ...prev,
      [section]: (prev[section] || []).map(item =>
        item.id === id ? { ...item, sendToApplication: !item.sendToApplication } : item
      )
    }));
  }, [setCurriculum]);

  /**
   * Obtiene items marcados para enviar en aplicación.
   * @param {string} section - Sección a filtrar
   * @returns {Array} Items con sendToApplication: true
   */
  const getItemsForApplication = useCallback((section) => {
    return (curriculum[section] || []).filter(item => item.sendToApplication);
  }, [curriculum]);

  /**
   * Cuenta items en una sección.
   * @param {string} section - Sección a contar
   * @returns {number} Cantidad de items
   */
  const getSectionCount = useCallback((section) => {
    return (curriculum[section] || []).length;
  }, [curriculum]);

  /**
   * Restablece el currículum a valores por defecto.
   */
  const resetCurriculum = useCallback(() => {
    setCurriculum(defaultCurriculum);
  }, [setCurriculum]);

  return {
    curriculum,
    setCurriculum,
    addItem,
    updateItem,
    removeItem,
    toggleSendToApplication,
    getItemsForApplication,
    getSectionCount,
    resetCurriculum
  };
};

export default useCurriculum;
