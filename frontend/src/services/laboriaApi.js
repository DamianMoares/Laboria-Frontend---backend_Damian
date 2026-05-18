import { logger } from '../utils/logger';
import API_CONFIG from '../config/externalApis';
import { getHeaders } from './apiUtils';
import { searchJobs } from './externalJobsApi';
import { searchCourses } from './externalCoursesApi';

const LABORIA_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const searchLaboriaJobs = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.query) params.append('search', filters.query);
    if (filters.location) params.append('location', filters.location);
    if (filters.category) params.append('category', filters.category);
    if (filters.workMode) params.append('mode', filters.workMode);
    const url = `${LABORIA_API_URL}/api/jobs?${params}`;
    const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    const data = Array.isArray(result) ? result : result.data || [];
    return data.map(job => ({
      id: job.id, title: job.title, company: job.company,
      location: job.location || 'No especificado',
      workMode: job.mode === 'REMOTE' ? 'Remoto' : job.mode === 'HYBRID' ? 'Híbrido' : 'Presencial',
      schedule: 'Completa', experienceLevel: 'No especificado', salary: job.salary || 'No especificado',
      contractType: 'No especificado', sector: job.category || 'No especificado',
      technology: job.requirements || 'No especificado', description: job.description || 'Sin descripción',
      requirements: job.requirements ? job.requirements.split(',').map(r => r.trim()) : [],
      benefits: [], postedDate: job.createdAt ? job.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
      url: `#/empleos/${job.id}`, remote: job.mode === 'REMOTE', logo: '', source: 'Laboria',
    }));
  } catch (error) {
    logger.error('[Laboria API] Error:', error);
    return [];
  }
};

export const searchLaboriaCourses = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.query) params.append('search', filters.query);
    if (filters.category) params.append('category', filters.category);
    if (filters.level) params.append('level', filters.level);
    const url = `${LABORIA_API_URL}/api/courses?${params}`;
    const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    const data = Array.isArray(result) ? result : result.data || [];
    return data.map(course => ({
      id: course.id, title: course.title, provider: course.provider,
      category: course.category || 'No especificado',
      level: course.level === 'BEGINNER' ? 'Principiante' : course.level === 'INTERMEDIATE' ? 'Intermedio' : course.level === 'ADVANCED' ? 'Avanzado' : 'No especificado',
      duration: course.duration || 'No especificado', language: 'es', price: course.price || 'No especificado',
      rating: 0, reviews: 0, students: 0, description: course.description || 'Sin descripción',
      requirements: [], learningOutcomes: [], syllabus: [], imageUrl: course.image || '',
      url: course.url || `#/cursos/${course.id}`, certificate: false,
      lastUpdated: course.updatedAt || course.createdAt || new Date().toISOString(), location: '', mode: 'online',
      source: 'Laboria',
    }));
  } catch (error) {
    logger.error('[Laboria API] Error:', error);
    return [];
  }
};

export const searchAllJobs = async (filters = {}) => {
  const limit = filters.limit || 50;
  const allResults = [];
  const laboriaResults = await searchLaboriaJobs(filters);
  allResults.push(...laboriaResults);
  if (allResults.length < limit) {
    const externalResults = await searchJobs(filters);
    const existingIds = new Set(allResults.map(j => j.id));
    const newExternal = externalResults.filter(j => !existingIds.has(j.id));
    allResults.push(...newExternal);
  }
  if (allResults.length < limit / 2) logger.warn('[searchAllJobs] Pocos resultados, usando fallback local');
  return allResults.slice(0, limit);
};

export const searchAllCourses = async (filters = {}) => {
  const limit = filters.limit || 50;
  const allResults = [];
  const laboriaResults = await searchLaboriaCourses(filters);
  allResults.push(...laboriaResults);
  if (allResults.length < limit) {
    const externalResults = await searchCourses(filters);
    const existingIds = new Set(allResults.map(c => c.id));
    const newExternal = externalResults.filter(c => !existingIds.has(c.id));
    allResults.push(...newExternal);
  }
  return allResults.slice(0, limit);
};

export const checkLaboriaBackendConnection = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(`${LABORIA_API_URL}/`, { method: 'GET', signal: controller.signal });
    clearTimeout(timeoutId);
    if (response.ok) {
      const data = await response.json();
      return { connected: true, message: data.message || 'Backend Laboria conectado', url: LABORIA_API_URL };
    }
    return { connected: false, error: `HTTP ${response.status}`, url: LABORIA_API_URL };
  } catch (error) {
    let errorMessage = error.message;
    if (error.name === 'AbortError') errorMessage = 'Timeout - backend no responde en 5 segundos';
    else if (error.message.includes('Failed to fetch')) errorMessage = 'Backend no accesible - ¿Está corriendo en el puerto 3000?';
    return { connected: false, error: errorMessage, url: LABORIA_API_URL };
  }
};

export const checkApiConnection = async () => {
  const status = { laboria: null, jobs: [], courses: [] };
  status.laboria = await checkLaboriaBackendConnection();
  for (const api of API_CONFIG.JOBS_APIS) {
    if (!api.enabled || !api.url) { status.jobs.push({ name: api.name, connected: false, error: 'No habilitada o sin URL' }); continue; }
    try {
      let url = api.url;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(url, { method: 'GET', headers: getHeaders(api.apiKey), signal: controller.signal });
      clearTimeout(timeoutId);
      status.jobs.push({ name: api.name, connected: response.ok, error: response.ok ? null : `HTTP ${response.status}`, note: response.ok ? 'Conexión exitosa' : 'Error en respuesta' });
    } catch (error) {
      let errorMessage = error.message;
      if (error.name === 'AbortError') errorMessage = 'Timeout - no respondió en 10 segundos';
      else if (error.message.includes('CORS')) errorMessage = 'Error CORS - API no permite llamadas desde navegador';
      else if (error.message.includes('Failed to fetch')) errorMessage = 'Error de red - posiblemente bloqueada por CORS';
      status.jobs.push({ name: api.name, connected: false, error: errorMessage });
    }
  }
  for (const api of API_CONFIG.COURSES_APIS) {
    if (!api.enabled || !api.url) { status.courses.push({ name: api.name, connected: false, error: 'No habilitada o sin URL' }); continue; }
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(api.url, { method: 'GET', headers: getHeaders(api.apiKey), signal: controller.signal });
      clearTimeout(timeoutId);
      status.courses.push({ name: api.name, connected: response.ok, error: response.ok ? null : `HTTP ${response.status}`, note: response.ok ? 'Conexión exitosa' : 'Error en respuesta' });
    } catch (error) {
      let errorMessage = error.message;
      if (error.name === 'AbortError') errorMessage = 'Timeout - no respondió en 10 segundos';
      else if (error.message.includes('CORS')) errorMessage = 'Error CORS - API no permite llamadas desde navegador';
      else if (error.message.includes('Failed to fetch')) errorMessage = 'Error de red - posiblemente bloqueada por CORS';
      status.courses.push({ name: api.name, connected: false, error: errorMessage });
    }
  }
  return status;
};

export const getTotalJobsCount = async () => {
  let totalCount = 0;
  for (const api of API_CONFIG.JOBS_APIS) {
    if (!api.enabled || !api.url) continue;
    try {
      let url = api.url;
      const params = new URLSearchParams();
      if (api.name === 'Junta Castilla y León Empleo') {
        params.append('rows', '0');
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}${params.toString()}`;
      } else if (api.name === 'SerpApi Google Jobs') {
        if (!api.apiKey) continue;
        params.append('engine', 'google_jobs');
        params.append('q', 'empleo España');
        params.append('api_key', api.apiKey);
        params.append('num', '10');
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}${params.toString()}`;
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(url, { method: 'GET', headers: getHeaders(api.apiKey), signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) {
        const data = await response.json();
        if (api.name === 'Junta Castilla y León Empleo') totalCount += data.nhits || 0;
        else if (api.name === 'SerpApi Google Jobs') { const jobsArray = data.jobs_results || []; totalCount += jobsArray.length * 10; }
        else if (Array.isArray(data)) totalCount += data.length;
        else { const jobsArray = data.jobs || data.results || data.data || data.items || data.records || []; totalCount += jobsArray.length; }
      }
    } catch (error) {
      logger.error(`Error al contar ofertas de ${api.name}:`, error);
      continue;
    }
  }
  return totalCount;
};

export const getTotalCoursesCount = async () => {
  let totalCount = 0;
  for (const api of API_CONFIG.COURSES_APIS) {
    if (!api.enabled || !api.url) continue;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(api.url, { method: 'GET', headers: getHeaders(api.apiKey), signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) totalCount += data.length;
        else { const coursesArray = data.courses || data.results || data.data || data.items || data.records || []; totalCount += coursesArray.length; }
      }
    } catch (error) {
      logger.error(`Error al contar cursos de ${api.name}:`, error);
      continue;
    }
  }
  return totalCount;
};
