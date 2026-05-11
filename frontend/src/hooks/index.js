/**
 * Barrel export para todos los hooks personalizados de Laboria.
 * Permite importar desde una sola ruta: import { ... } from '../hooks';
 */

// Hooks principales
export { default as useLocalStorage } from './useLocalStorage';
export { default as useForm } from './useForm';
export { default as useDebounce } from './useDebounce';
export { default as useToggle } from './useToggle';
export { default as useSearch } from './useSearch';
export { default as useCurriculum } from './useCurriculum';
export { default as useFetch } from './useFetch';

// Utilidades exportadas
export { getUserStorageKey, clearLaboriaStorage } from './useLocalStorage';
export { validationRules } from './useForm';
export { SEARCH_DEBOUNCE_DELAY } from './useDebounce';
