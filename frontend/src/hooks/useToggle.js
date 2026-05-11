import { useState, useCallback } from 'react';

/**
 * Hook para manejar estados booleanos.
 * Útil para modales, dropdowns, menús, etc.
 * @param {boolean} initialValue - Valor inicial (default: false)
 * @returns {Object} Estado y funciones de control
 */
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  /**
   * Alterna el valor booleano (true ↔ false).
   */
  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  /**
   * Establece el valor a true.
   */
  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  /**
   * Establece el valor a false.
   */
  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return { value, toggle, setTrue, setFalse, setValue };
};

export default useToggle;
