import { useState, useEffect } from 'react';

/**
 * Hook para retrasar la actualización de un valor.
 * Para búsquedas para no filtrar en cada tecla.
 * @param {*} value - Valor a debouncear
 * @param {number} delay - Retraso en milisegundos (default: 300)
 * @returns {*} Valor debounceado
 */
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Constante de retraso para búsquedas (300ms).
 * Balance entre UX y rendimiento.
 */
export const SEARCH_DEBOUNCE_DELAY = 300;

export default useDebounce;
