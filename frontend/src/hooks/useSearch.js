import { useState, useMemo, useCallback } from 'react';
import useDebounce, { SEARCH_DEBOUNCE_DELAY } from './useDebounce';

/**
 * Hook para búsqueda con filtros dinámicos y debounce.
 * @param {Array} items - Lista de items a buscar
 * @param {Array<string>} searchFields - Campos donde buscar (ej: ['title', 'company'])
 * @param {Object} filterConfig - Configuración de filtros { key: matcher }
 * @returns {Object} Estado y funciones de búsqueda
 */
const useSearch = (items, searchFields = [], filterConfig = {}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(
    Object.keys(filterConfig).reduce((acc, key) => ({ ...acc, [key]: '' }), {})
  );
  const debouncedSearch = useDebounce(searchTerm, SEARCH_DEBOUNCE_DELAY);

  /**
   * Actualiza un filtro específico.
   * @param {string} key - Nombre del filtro
   * @param {*} value - Valor del filtro
   */
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  /**
   * Limpia todos los filtros y el término de búsqueda.
   */
  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setFilters(Object.keys(filterConfig).reduce((acc, key) => ({ ...acc, [key]: '' }), {}));
  }, [filterConfig]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = !debouncedSearch || searchFields.some(field => {
        const value = item[field];
        return value && value.toLowerCase().includes(debouncedSearch.toLowerCase());
      });

      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const matcher = filterConfig[key];
        if (typeof matcher === 'function') {
          return matcher(item, value);
        }
        return item[key] === value;
      });

      return matchesSearch && matchesFilters;
    });
  }, [items, debouncedSearch, searchFields, filters, filterConfig]);

  /**
   * Obtiene valores únicos de un campo (para select options).
   * @param {string} field - Campo del item
   * @returns {Array} Valores únicos
   */
  const uniqueValues = useCallback((field) => {
    return [...new Set(items.map(item => item[field]).filter(Boolean))];
  }, [items]);

  return {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    clearFilters,
    filteredItems,
    uniqueValues,
    totalResults: filteredItems.length,
    totalItems: items.length
  };
};

export default useSearch;
