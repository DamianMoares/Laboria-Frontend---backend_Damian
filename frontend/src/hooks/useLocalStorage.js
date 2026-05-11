import { useState, useEffect, useCallback } from 'react';

/**
 * Prefijo para todas las claves de localStorage de Laboria.
 * Evita conflictos con otras aplicaciones.
 */
const STORAGE_PREFIX = 'laboria_';

/**
 * Genera la clave completa con el prefijo de Laboria.
 * @param {string} key - Clave base
 * @returns {string} Clave completa con prefijo
 */
const getFullKey = (key) => `${STORAGE_PREFIX}${key}`;

/**
 * Hook para persistir datos en localStorage con sincronización automática.
 * @param {string} key - Clave de almacenamiento (sin prefijo)
 * @param {*} initialValue - Valor inicial si no existe en storage
 * @returns {Array} [storedValue, setStoredValue, remove]
 */
const useLocalStorage = (key, initialValue) => {
  const fullKey = getFullKey(key);

  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(fullKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${fullKey}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (storedValue === null || storedValue === undefined) {
        localStorage.removeItem(fullKey);
      } else {
        localStorage.setItem(fullKey, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.warn(`Error writing localStorage key "${fullKey}":`, error);
    }
  }, [fullKey, storedValue]);

  /**
   * Elimina el valor del localStorage y restablece al valor inicial.
   */
  const remove = useCallback(() => {
    try {
      localStorage.removeItem(fullKey);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${fullKey}":`, error);
    }
  }, [fullKey, initialValue]);

  return [storedValue, setStoredValue, remove];
};

/**
 * Genera una clave de storage específica para un usuario.
 * Útil para datos por usuario como currículums.
 * @param {string} key - Clave base
 * @param {number|string} userId - ID del usuario
 * @returns {string} Clave con formato: key_userId
 * @example getUserStorageKey('curriculum', 1) // 'curriculum_1'
 */
export const getUserStorageKey = (key, userId) => `${key}_${userId}`;

/**
 * Elimina todas las claves de localStorage que empiezan con el prefijo 'laboria_'.
 * Útil para logout o limpieza de datos.
 */
export const clearLaboriaStorage = () => {
  Object.keys(localStorage)
    .filter(k => k.startsWith(STORAGE_PREFIX))
    .forEach(k => localStorage.removeItem(k));
};

export default useLocalStorage;
