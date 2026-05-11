// ConexionApi.jsx - Sistema modular de conexión a APIs y RSS feeds
// Este archivo maneja las llamadas a APIs externas y RSS feeds para obtener ofertas de empleo y cursos
// Sistema modular: agregar nuevas fuentes simplemente añadiendo objetos a los arrays

// URLs de las APIs y RSS feeds (se pueden configurar mediante variables de entorno)
// Soporta múltiples APIs y RSS feeds por categoría para combinar resultados
const API_CONFIG = {
  // APIs de empleo (REST APIs)
  JOBS_APIS: [
    {
      name: 'RemoteOK',
      url: 'https://remoteok.com/api',
      apiKey: '',
      enabled: false, // Deshabilitado temporalmente por error de CORS
      type: 'api',
    },
    {
      name: 'Remotive Remote Jobs',
      url: import.meta.env.VITE_JOBS_API_5_URL || 'https://remotive.com/api/remote-jobs',
      apiKey: import.meta.env.VITE_JOBS_API_5_KEY || '',
      enabled: true,
      type: 'api',
    },
    {
      name: 'Jobicy Remote Jobs',
      url: import.meta.env.VITE_JOBS_API_3_URL || 'https://jobicy.com/api/v2/remote-jobs',
      apiKey: import.meta.env.VITE_JOBS_API_3_KEY || '',
      enabled: true,
      type: 'api',
    },
    {
      name: 'Himalayas Remote Jobs',
      url: import.meta.env.VITE_JOBS_API_4_URL || 'https://himalayas.app/jobs/api',
      apiKey: import.meta.env.VITE_JOBS_API_4_KEY || '',
      enabled: true,
      type: 'api',
    },
    {
      name: 'Arbeitnow Job Board',
      url: import.meta.env.VITE_JOBS_API_6_URL || 'https://www.arbeitnow.com/api/job-board-api',
      apiKey: import.meta.env.VITE_JOBS_API_6_KEY || '',
      enabled: true,
      type: 'api',
    },
    {
      name: 'Junta Castilla y León Empleo',
      url: import.meta.env.VITE_JOBS_API_1_URL || 'https://data.opendatasoft.com/api/records/1.0/search/?dataset=ofertas-de-empleo@jcyl',
      apiKey: import.meta.env.VITE_JOBS_API_1_KEY || '',
      enabled: true,
      type: 'api',
    },
    {
      name: 'SerpApi Google Jobs',
      url: import.meta.env.VITE_JOBS_API_2_URL || 'https://serpapi.com/search',
      apiKey: import.meta.env.VITE_JOBS_API_2_KEY || '',
      enabled: false, // Deshabilitado temporalmente por error de CORS
      type: 'api',
    },
  ],

  // RSS feeds de empleo
  JOBS_RSS: [
    {
      name: 'We Work Remotely',
      url: 'https://weworkremotely.com/remote-jobs.rss',
      enabled: true,
      type: 'rss',
    },
    {
      name: 'Indeed RSS',
      url: 'https://rss.indeed.com/rss?q=software+engineer&l=spain',
      enabled: false, // Requiere proxy para CORS
      type: 'rss',
    },
    {
      name: 'Glassdoor Blog',
      url: 'https://www.glassdoor.com/blog/feed/',
      enabled: true,
      type: 'rss',
    },
  ],

  // APIs de cursos
  COURSES_APIS: [
    {
      name: 'YouTube Data API',
      url: import.meta.env.VITE_COURSES_YOUTUBE_URL || 'https://www.googleapis.com/youtube/v3/search',
      apiKey: import.meta.env.VITE_COURSES_YOUTUBE_KEY || '',
      enabled: false, // Deshabilitado temporalmente por error 401 Unauthorized
      type: 'api',
    },
    {
      name: 'Google Custom Search',
      url: import.meta.env.VITE_COURSES_GOOGLE_SEARCH_URL || 'https://www.googleapis.com/customsearch/v1',
      apiKey: import.meta.env.VITE_COURSES_GOOGLE_SEARCH_KEY || '',
      enabled: false, // Deshabilitado temporalmente por error 401 Unauthorized
      type: 'api',
    },
    {
      name: 'Bing Search API',
      url: import.meta.env.VITE_COURSES_BING_URL || 'https://api.bing.microsoft.com/v7.0/search',
      apiKey: import.meta.env.VITE_COURSES_BING_KEY || '',
      enabled: false, // Deshabilitado temporalmente por error 404 Resource Not Found
      type: 'api',
    },
    {
      name: 'Khan Academy',
      url: import.meta.env.VITE_COURSES_API_1_URL || 'https://www.khanacademy.org/api/v1/topic/root',
      apiKey: import.meta.env.VITE_COURSES_API_1_KEY || '',
      enabled: false, // Problemas de CORS conocidos
      type: 'api',
    },
    {
      name: 'Coursera API',
      url: import.meta.env.VITE_COURSES_API_2_URL || 'https://api.coursera.org/api/courses.v1',
      apiKey: import.meta.env.VITE_COURSES_API_2_KEY || '',
      enabled: false, // Requiere API key
      type: 'api',
    },
    {
      name: 'Udemy API',
      url: import.meta.env.VITE_COURSES_API_3_URL || 'https://www.udemy.com/api-2.0/courses',
      apiKey: import.meta.env.VITE_COURSES_API_3_KEY || '',
      enabled: false, // Requiere API key
      type: 'api',
    },
  ],

  // RSS feeds de cursos
  COURSES_RSS: [
    {
      name: 'Coursera Blog',
      url: 'https://blog.coursera.org/feed/',
      enabled: true,
      type: 'rss',
    },
    {
      name: 'edX Blog',
      url: 'https://blog.edx.org/feed',
      enabled: true,
      type: 'rss',
    },
    {
      name: 'SEPE Formación',
      url: 'https://www.sepe.es/rss/sepe/formacion.xml',
      enabled: true,
      type: 'rss',
    },
    {
      name: 'MIT OpenCourseWare',
      url: 'https://ocw.mit.edu/rss/courses/new.xml',
      enabled: true,
      type: 'rss',
    },
    {
      name: 'TED-Ed',
      url: 'https://ed.ted.com/rss',
      enabled: true,
      type: 'rss',
    },
  ],
};

// Headers comunes para las peticiones
const getHeaders = (apiKey) => ({
  'Content-Type': 'application/json',
  ...(apiKey && { 'Authorization': `Bearer ${apiKey}` }),
});

// Construye URL con parámetros de autenticación para APIs que los requieren
const buildAuthUrl = (url, appId, apiKey) => {
  if (appId && apiKey) {
    return `${url}?app_id=${appId}&app_key=${apiKey}`;
  }
  return url;
};

/**
 * Manejo de errores de API
 * @param {Error} error - Error capturado
 * @param {string} context - Contexto del error
 * @throws {Error} Error con mensaje descriptivo
 */
const handleApiError = (error, context) => {
  console.error(`Error en ${context}:`, error);
  throw new Error(`Error al ${context}: ${error.message}`);
};

/**
 * Parsea un RSS feed y lo convierte a formato JSON
 * @param {string} rssText - Contenido del RSS feed
 * @returns {Array} Array de items del feed
 */
const parseRSSFeed = (rssText) => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(rssText, 'text/xml');
    
    const items = xmlDoc.querySelectorAll('item');
    const parsedItems = [];
    
    items.forEach(item => {
      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const category = item.querySelector('category')?.textContent || '';
      
      parsedItems.push({
        title,
        link,
        description,
        pubDate,
        category,
        source: 'RSS Feed',
      });
    });
    
    return parsedItems;
  } catch (error) {
    console.error('Error parsing RSS feed:', error);
    return [];
  }
};

/**
 * Realiza una petición GET a una API externa
 * @param {string} url - URL de la API
 * @param {Object} headers - Headers de la petición
 * @param {string} context - Contexto para manejo de errores
 * @returns {Promise<Object>} Respuesta de la API
 */
const fetchFromApi = async (url, headers, context) => {
  try {
    console.log(`Fetching from API: ${url}`);
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`API response:`, data);
    return data;
  } catch (error) {
    console.error(`Error in ${context}:`, error);
    throw error;
  }
};

/**
 * Realiza una petición GET a un RSS feed
 * @param {string} url - URL del RSS feed
 * @param {string} context - Contexto para manejo de errores
 * @returns {Promise<Array>} Array de items del feed
 */
const fetchFromRSS = async (url, context) => {
  try {
    console.log(`Fetching from RSS: ${url}`);
    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rssText = await response.text();
    const items = parseRSSFeed(rssText);
    console.log(`RSS response: ${items.length} items`);
    return items;
  } catch (error) {
    console.error(`Error in ${context}:`, error);
    // Para errores CORS o de red, retornar array vacío en lugar de lanzar error
    if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
      console.log(`Skipping ${context} due to CORS/network error`);
      return [];
    }
    throw error;
  }
};

/**
 * Busca ofertas de empleo en múltiples APIs externas
 * @param {Object} filters - Filtros de búsqueda
 * @param {string} filters.query - Término de búsqueda
 * @param {string} filters.location - Ubicación
 * @param {string} filters.category - Categoría
 * @param {string} filters.workMode - Modalidad de trabajo (remoto, presencial, híbrido)
 * @param {number} filters.page - Página de resultados
 * @param {number} filters.limit - Límite de resultados por página
 * @returns {Promise<Array>} Lista combinada de ofertas de empleo de todas las APIs
 */
export const searchJobs = async (filters = {}) => {
  const {
    query = '',
    location = '',
    category = '',
    workMode = '',
    page = 1,
    limit = 20,
  } = filters;

  const enabledApis = API_CONFIG.JOBS_APIS.filter(api => api.enabled && api.url);
  const enabledRss = API_CONFIG.JOBS_RSS.filter(rss => rss.enabled && rss.url);
  const allResults = [];
  const apiErrors = [];

  // Realizar peticiones a todas las APIs habilitadas en paralelo
  const apiPromises = enabledApis.map(async (api) => {
    try {
      // Construir URL base con autenticación si es necesaria
      let url = buildAuthUrl(api.url, api.appId, api.apiKey);
      
      console.log(`Processing API: ${api.name}, URL: ${url}`);
      
      // Construir URL con parámetros de consulta
      const params = new URLSearchParams();
      
      // APIs públicas gratuitas con parámetros específicos
      if (api.name === 'RemoteOK') {
        // RemoteOK API - devuelve array directo, no requiere parámetros
        // Filtramos localmente por España
        console.log(`Processing RemoteOK API`);
      } else if (api.name === 'Remotive Remote Jobs') {
        // Remotive usa parámetros específicos
        if (query) params.append('search', query);
        if (category) params.append('category', category);
        params.append('limit', limit);
        
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}${params.toString()}`;
      } else if (api.name === 'Jobicy Remote Jobs') {
        // Jobicy usa parámetros específicos - filtrar por España
        params.append('count', limit);
        if (location) params.append('geo', location);
        else params.append('geo', 'spain'); // Por defecto España
        if (query) params.append('tag', query);
        
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}${params.toString()}`;
      } else if (api.name === 'Himalayas Remote Jobs') {
        // Himalayas usa parámetros específicos - filtrar por España
        if (query) params.append('q', query);
        if (location) params.append('country', location);
        else params.append('country', 'Spain'); // Por defecto España
        params.append('limit', limit);
        params.append('offset', (page - 1) * limit);
        
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}${params.toString()}`;
      } else if (api.name === 'Arbeitnow Job Board') {
        // Arbeitnow es una API simple sin parámetros de filtro
        // Devuelve todos los jobs, luego filtramos localmente
        // No agregar parámetros
      } else if (api.name === 'Junta Castilla y León Empleo') {
        // API de Castilla y León - OpenDataSoft format
        // La URL base ya tiene el dataset, solo agregar rows y start
        params.append('rows', limit);
        params.append('start', (page - 1) * limit);
        
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}${params.toString()}`;
        console.log(`Final URL for JCyL: ${url}`);
      } else if (api.name === 'SerpApi Google Jobs') {
        // SerpApi Google Jobs - requiere API key
        console.log('Configurando SerpApi con API key:', api.apiKey ? 'Presente' : 'No presente');
        params.append('engine', 'google_jobs');
        if (query) params.append('q', query);
        else params.append('q', 'empleo España'); // Por defecto buscar empleo en España
        if (location) params.append('location', location);
        else params.append('location', 'Spain'); // Por defecto España
        params.append('api_key', api.apiKey);
        params.append('num', limit);
        
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}${params.toString()}`;
        console.log(`Final URL for SerpApi: ${url}`);
      }

      const headers = getHeaders(api.apiKey);

      const data = await fetchFromApi(url, headers, `buscar ofertas en ${api.name}`);
      
      console.log(`Data received from ${api.name}:`, data);
      
      // Normalizar datos y agregar fuente
      const normalizedData = normalizeJobsData(data);
      console.log(`Normalized data from ${api.name}:`, normalizedData);
      
      return {
        source: api.name,
        data: normalizedData,
      };
    } catch (error) {
      console.error(`Error en API ${api.name}:`, error);
      apiErrors.push({ api: api.name, error: error.message });
      return { source: api.name, data: [] };
    }
  });

  // Esperar todas las peticiones de APIs
  const apiResults = await Promise.all(apiPromises);

  // Combinar resultados de APIs y agregar información de fuente
  apiResults.forEach(result => {
    result.data.forEach(job => {
      job.source = result.source;
      allResults.push(job);
    });
  });

  // Realizar peticiones a RSS feeds habilitados
  const rssPromises = enabledRss.map(async (rss) => {
    try {
      console.log(`Processing RSS: ${rss.name}, URL: ${rss.url}`);
      const items = await fetchFromRSS(rss.url, `buscar feed ${rss.name}`);
      
      // Normalizar items de RSS a formato de empleo
      const normalizedItems = items.map(item => ({
        id: item.link || Math.random().toString(36).substr(2, 9),
        title: item.title || 'Sin título',
        company: rss.name,
        location: 'No especificado',
        workMode: 'No especificado',
        schedule: 'No especificado',
        experienceLevel: 'No especificado',
        salary: 'No especificado',
        contractType: 'No especificado',
        sector: item.category || 'No especificado',
        technology: 'No especificado',
        description: stripHtml(item.description) || 'Sin descripción disponible',
        requirements: [],
        benefits: [],
        postedDate: item.pubDate ? new Date(item.pubDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        url: item.link || '#',
        remote: false,
        logo: '',
        source: rss.name,
      }));
      
      return {
        source: rss.name,
        data: normalizedItems,
      };
    } catch (error) {
      console.error(`Error en RSS ${rss.name}:`, error);
      apiErrors.push({ api: rss.name, error: error.message });
      return { source: rss.name, data: [] };
    }
  });

  // Esperar todas las peticiones de RSS
  const rssResults = await Promise.all(rssPromises);

  // Combinar resultados de RSS
  rssResults.forEach(result => {
    result.data.forEach(job => {
      allResults.push(job);
    });
  });

  // Log de errores si existen
  if (apiErrors.length > 0) {
    console.warn('Errores en algunas fuentes de empleo:', apiErrors);
  }

  // Filtrar por ubicación (España) y modalidad (remoto/híbrido)
  const filteredResults = allResults.filter(job => {
    // Filtro por ubicación - España
    let locationMatch = true;
    if (location && (location.toLowerCase().includes('españa') || location.toLowerCase().includes('spain'))) {
      const jobLocation = (job.location || '').toLowerCase();
      locationMatch = jobLocation.includes('españa') || 
                      jobLocation.includes('spain') || 
                      jobLocation.includes('es') ||
                      jobLocation === 'remoto' || // Aceptar trabajos remotos
                      jobLocation === 'no especificado';
    }

    // Filtro por modalidad de trabajo
    let workModeMatch = true;
    if (workMode) {
      const jobWorkMode = (job.workMode || '').toLowerCase();
      if (workMode.toLowerCase() === 'remoto') {
        workModeMatch = jobWorkMode === 'remoto' || job.remote === true;
      } else if (workMode.toLowerCase() === 'híbrido') {
        workModeMatch = jobWorkMode === 'híbrido' || jobWorkMode === 'hybrid';
      } else if (workMode.toLowerCase() === 'presencial') {
        workModeMatch = jobWorkMode === 'presencial' || jobWorkMode === 'on-site' || jobWorkMode === 'onsite';
      }
    }

    // Filtro por búsqueda (opcional) - busca en todos los campos sin restricción de sector
    let searchMatch = true;
    if (query && query.trim() !== '') {
      const searchLower = query.toLowerCase();
      const titleMatch = (job.title || '').toLowerCase().includes(searchLower);
      const companyMatch = (job.company || '').toLowerCase().includes(searchLower);
      const sectorMatch = (job.sector || '').toLowerCase().includes(searchLower);
      const techMatch_field = (job.technology || '').toLowerCase().includes(searchLower);
      const descMatch = (job.description || '').toLowerCase().includes(searchLower);
      const locationMatch_search = (job.location || '').toLowerCase().includes(searchLower);
      searchMatch = titleMatch || companyMatch || sectorMatch || techMatch_field || descMatch || locationMatch_search;
    }

    return locationMatch && workModeMatch && searchMatch;
  });

  // Aplicar límite total a resultados filtrados
  return filteredResults.slice(0, limit);
};

/**
 * Obtiene detalles de una oferta de empleo específica
 * @param {string} jobId - ID de la oferta de empleo
 * @param {string} source - Fuente de la API (opcional, busca en todas si no se especifica)
 * @returns {Promise<Object|null>} Detalles de la oferta de empleo
 */
export const getJobDetails = async (jobId, source = null) => {
  // Si se especifica fuente, buscar solo en esa API
  if (source) {
    const api = API_CONFIG.JOBS_APIS.find(api => api.name === source && api.enabled);
    if (!api) {
      console.error(`API ${source} no encontrada o no habilitada`);
      return null;
    }

    try {
      const url = `${api.url}/${jobId}`;
      const headers = getHeaders(api.apiKey);
      const data = await fetchFromApi(url, headers, 'obtener detalles de empleo');
      const normalized = normalizeJobDetails(data);
      normalized.source = source;
      return normalized;
    } catch (error) {
      console.error(`Error al obtener detalles del empleo de ${source}:`, error);
      return null;
    }
  }

  // Si no se especifica fuente, buscar en todas las APIs habilitadas
  const enabledApis = API_CONFIG.JOBS_APIS.filter(api => api.enabled && api.url);

  for (const api of enabledApis) {
    try {
      const url = `${api.url}/${jobId}`;
      const headers = getHeaders(api.apiKey);
      const data = await fetchFromApi(url, headers, `obtener detalles de empleo en ${api.name}`);
      const normalized = normalizeJobDetails(data);
      normalized.source = api.name;
      return normalized;
    } catch (error) {
      console.error(`Error al obtener detalles del empleo de ${api.name}:`, error);
      continue;
    }
  }

  return null;
};

/**
 * Obtiene detalles de un curso específico
 * @param {string} courseId - ID del curso
 * @param {string} source - Fuente de la API (opcional, busca en todas si no se especifica)
 * @returns {Promise<Object|null>} Detalles del curso
 */
export const getCourseDetails = async (courseId, source = null) => {
  // Si se especifica fuente, buscar solo en esa API
  if (source) {
    const api = API_CONFIG.COURSES_APIS.find(api => api.name === source && api.enabled);
    if (!api) {
      console.error(`API ${source} no encontrada o no habilitada`);
      return null;
    }

    try {
      const url = `${api.url}/${courseId}`;
      const headers = getHeaders(api.apiKey);
      const data = await fetchFromApi(url, headers, 'obtener detalles del curso');
      const normalized = normalizeCourseDetails(data);
      normalized.source = source;
      return normalized;
    } catch (error) {
      console.error(`Error al obtener detalles del curso de ${source}:`, error);
      return null;
    }
  }

  // Si no se especifica fuente, buscar en todas las APIs habilitadas
  const enabledApis = API_CONFIG.COURSES_APIS.filter(api => api.enabled && api.url);

  for (const api of enabledApis) {
    try {
      const url = `${api.url}/${courseId}`;
      const headers = getHeaders(api.apiKey);
      const data = await fetchFromApi(url, headers, `obtener detalles del curso en ${api.name}`);
      const normalized = normalizeCourseDetails(data);
      normalized.source = api.name;
      return normalized;
    } catch (error) {
      console.error(`Error al obtener detalles del curso de ${api.name}:`, error);
      continue;
    }
  }

  return null;
};

/**
 * Normaliza los datos de empleos de la API externa al formato interno
 * @param {Object} apiData - Datos de la API externa
 * @returns {Array} Datos normalizados
 */
const normalizeJobsData = (apiData) => {
  // Si la API devuelve un array directo
  if (Array.isArray(apiData)) {
    return apiData.map(job => normalizeJobDetails(job));
  }

  // Si la API devuelve un objeto con propiedades como 'jobs', 'results', 'data', etc.
  const jobsArray = apiData.jobs || apiData.results || apiData.data || apiData.items || apiData.records || apiData.jobs_results || [];
  
  return jobsArray.map(job => normalizeJobDetails(job));
};

/**
 * Normaliza los detalles de un empleo individual
 * @param {Object} job - Datos del empleo de la API externa
 * @returns {Object} Datos normalizados
 */
const normalizeJobDetails = (job) => {
  // Traducir modalidad de trabajo al español
  const workModeMap = {
    'remote': 'Remoto',
    'hybrid': 'Híbrido',
    'on-site': 'Presencial',
    'onsite': 'Presencial',
    'full-time': 'Tiempo completo',
    'part-time': 'Tiempo parcial',
    'contractor': 'Autónomo',
    'freelance': 'Freelance',
  };
  
  // Traducir nivel de experiencia al español
  const experienceMap = {
    'entry': 'Junior',
    'junior': 'Junior',
    'mid': 'Intermedio',
    'mid-level': 'Intermedio',
    'intermediate': 'Intermedio',
    'senior': 'Senior',
    'lead': 'Liderazgo',
    'manager': 'Manager',
    'director': 'Director',
    'executive': 'Ejecutivo',
  };
  
  // Traducir tipo de contrato al español
  const contractMap = {
    'full-time': 'Indefinido',
    'part-time': 'Parcial',
    'contract': 'Temporal',
    'temporary': 'Temporal',
    'internship': 'Prácticas',
    'freelance': 'Freelance',
    'volunteer': 'Voluntario',
    'indefinido': 'Indefinido',
    'temporal': 'Temporal',
  };
  
  // Traducir jornada al español
  const scheduleMap = {
    'full-time': 'Completa',
    'part-time': 'Parcial',
    'flexible': 'Flexible',
    'completa': 'Completa',
    'parcial': 'Parcial',
  };
  
  const rawWorkMode = job.work_mode || job.workMode || job.employment_type || job.type || '';
  const rawExperience = job.experience_level || job.level || job.seniority || '';
  const rawContract = job.contract_type || job.employment_type || job.type || '';
  const rawSchedule = job.schedule || job.hours || '';
  
  // Manejo especial para RemoteOK API
  if (job.slug && job.company && job.tags) {
    return {
      id: job.slug || job.id,
      title: job.position || job.title || 'Sin título',
      company: job.company || 'Empresa no especificada',
      location: job.location || 'Remoto',
      workMode: 'Remoto', // RemoteOK es exclusivamente remoto
      schedule: scheduleMap[job.time?.toLowerCase()] || job.time || 'Completa',
      experienceLevel: experienceMap[job.seniority?.toLowerCase()] || job.seniority || 'No especificado',
      salary: job.salary_min || job.salary_max ? `${job.salary_min || ''} - ${job.salary_max || ''}` : 'No especificado',
      contractType: contractMap[job.job_type?.toLowerCase()] || job.job_type || 'No especificado',
      sector: job.tags?.[0] || 'No especificado',
      technology: job.tags?.join(', ') || 'No especificado',
      description: stripHtml(job.description) || 'Sin descripción disponible',
      requirements: job.tags || [],
      benefits: [],
      postedDate: job.epoch ? new Date(job.epoch * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      url: job.url || job.apply_url || '#',
      remote: true,
      logo: job.company_logo || '',
    };
  }
  
  // Manejo especial para Remotive API
  if (job.url && job.company_name && job.categories) {
    return {
      id: job.id || job.slug,
      title: job.title || 'Sin título',
      company: job.company_name || 'Empresa no especificada',
      location: job.candidate_required_location || 'Remoto',
      workMode: 'Remoto', // Remotive es exclusivamente remoto
      schedule: scheduleMap[job.job_type?.toLowerCase()] || job.job_type || 'Completa',
      experienceLevel: experienceMap[job.experience?.toLowerCase()] || job.experience || 'No especificado',
      salary: job.salary || 'No especificado',
      contractType: contractMap[job.job_type?.toLowerCase()] || job.job_type || 'No especificado',
      sector: job.categories?.[0]?.name || 'No especificado',
      technology: job.tags?.join(', ') || 'No especificado',
      description: stripHtml(job.description) || 'Sin descripción disponible',
      requirements: job.tags || [],
      benefits: [],
      postedDate: job.publication_date || new Date().toISOString().split('T')[0],
      url: job.url || '#',
      remote: true,
      logo: job.company_logo || '',
    };
  }

  // Manejo especial para SerpApi Google Jobs
  if (job.title && job.company_name && job.location) {
    const scheduleType = job.detected_extensions?.schedule_type || 'No especificado';
    const postedAt = job.detected_extensions?.posted_at || job.extensions?.[0] || '';
    
    // Determinar modalidad de trabajo
    let workMode = 'Presencial';
    if (job.detected_extensions?.schedule_type?.toLowerCase().includes('remote') || 
        job.location?.toLowerCase().includes('remote')) {
      workMode = 'Remoto';
    } else if (job.location?.toLowerCase().includes('hybrid')) {
      workMode = 'Híbrido';
    }

    // Extraer salario si existe
    let salary = 'No especificado';
    if (job.detected_extensions?.salary) {
      salary = job.detected_extensions.salary;
    } else {
      // Buscar salario en extensions
      const salaryExt = job.extensions?.find(ext => ext.includes('$') || ext.includes('€') || ext.includes('hour') || ext.includes('year'));
      if (salaryExt) salary = salaryExt;
    }

    return {
      id: job.job_id || job.share_link,
      title: job.title || 'Sin título',
      company: job.company_name || 'Empresa no especificada',
      location: job.location || 'No especificado',
      workMode: workMode,
      schedule: scheduleMap[scheduleType?.toLowerCase()] || scheduleType || 'Completa',
      experienceLevel: job.detected_extensions?.qualifications || 'No especificado',
      salary: salary,
      contractType: 'No especificado',
      sector: job.via || 'No especificado',
      technology: 'No especificado',
      description: stripHtml(job.description) || 'Sin descripción disponible',
      requirements: job.extensions || [],
      benefits: job.extensions?.filter(ext => ext.includes('insurance') || ext.includes('benefit') || ext.includes('paid')) || [],
      postedDate: postedAt || new Date().toISOString().split('T')[0],
      url: job.source_link || job.share_link || '#',
      remote: workMode === 'Remoto',
      logo: job.thumbnail || '',
    };
  }
  
  // Manejo especial para API de Castilla y León (OpenDataSoft format)
  if (job.fields) {
    const fields = job.fields;
    return {
      id: fields.identificador || job.recordid,
      title: fields.titulo || 'Sin título',
      company: 'Servicio Público de Empleo Castilla y León',
      location: fields.localidad ? `${fields.localidad}, ${fields.provincia}` : fields.provincia || 'Castilla y León',
      workMode: 'Presencial', // La mayoría son presenciales
      schedule: 'Completa', // Por defecto
      experienceLevel: 'No especificado',
      salary: 'No especificado',
      contractType: contractMap[fields.tipo_contrato?.toLowerCase()] || fields.tipo_contrato || 'No especificado',
      sector: 'Empleo Público',
      technology: 'No especificado',
      description: stripHtml(fields.descripcion) || 'Sin descripción disponible',
      requirements: [],
      benefits: [],
      postedDate: fields.fecha_publicacion || new Date().toISOString().split('T')[0],
      url: fields.enlace_al_contenido || '#',
      remote: false,
      logo: '',
    };
  }
  
  // Manejo especial para SerpApi Google Jobs
  if (job.job_id && job.detected_extensions) {
    return {
      id: job.job_id,
      title: job.title || 'Sin título',
      company: job.company_name || 'Empresa no especificada',
      location: job.location || 'No especificado',
      workMode: job.detected_extensions.schedule_type === 'REMOTE' ? 'Remoto' : 
                job.detected_extensions.schedule_type === 'HYBRID' ? 'Híbrido' : 'Presencial',
      schedule: job.detected_extensions.schedule_type || 'Completa',
      experienceLevel: job.detected_extensions.experience_level || 'No especificado',
      salary: job.detected_extensions.salary || 'No especificado',
      contractType: job.detected_extensions.contract_type || 'No especificado',
      sector: job.detected_extensions.industry || 'No especificado',
      technology: job.detected_extensions.qualifications?.join(', ') || 'No especificado',
      description: stripHtml(job.description) || 'Sin descripción disponible',
      requirements: job.detected_extensions.qualifications || [],
      benefits: job.detected_extensions.benefits || [],
      postedDate: job.detected_extensions.posted_at || new Date().toISOString().split('T')[0],
      url: job.apply_options?.[0]?.link || job.share_link || '#',
      remote: job.detected_extensions.schedule_type === 'REMOTE',
      logo: job.company_logo || '',
    };
  }
  
  // Manejo especial para InfoJobs API (cuando se habilite)
  if (job.codigo && job.puesto) {
    return {
      id: job.codigo,
      title: job.puesto || 'Sin título',
      company: job.empresa || 'Empresa no especificada',
      location: job.provincia || 'No especificado',
      workMode: workModeMap[job.modalidad?.toLowerCase()] || job.modalidad || 'No especificado',
      schedule: job.jornada || 'Completa',
      experienceLevel: job.experiencia || 'No especificado',
      salary: job.salario || 'No especificado',
      contractType: contractMap[job.tipo_contrato?.toLowerCase()] || job.tipo_contrato || 'No especificado',
      sector: job.categoria || 'No especificado',
      technology: job.requisitos || 'No especificado',
      description: stripHtml(job.descripcion) || 'Sin descripción disponible',
      requirements: job.requisitos_minimos || [],
      benefits: job.prestaciones || [],
      postedDate: job.fecha_publicacion || new Date().toISOString().split('T')[0],
      url: job.url || '#',
      remote: job.teletrabajo || false,
      logo: job.logo_empresa || '',
    };
  }
  
  return {
    id: job.id || job.job_id || job._id || Math.random().toString(36).substr(2, 9),
    title: job.title || job.job_title || job.position || job.role || 'Sin título',
    company: job.company || job.company_name || job.employer || job.organization || 'Empresa no especificada',
    location: job.location || job.city || job.country || job.candidate_required_location || 'Remoto',
    workMode: workModeMap[typeof rawWorkMode === 'string' ? rawWorkMode.toLowerCase() : rawWorkMode] || rawWorkMode || 'No especificado',
    schedule: scheduleMap[typeof rawSchedule === 'string' ? rawSchedule.toLowerCase() : rawSchedule] || rawSchedule || 'Completa',
    experienceLevel: experienceMap[typeof rawExperience === 'string' ? rawExperience.toLowerCase() : rawExperience] || rawExperience || 'No especificado',
    salary: job.salary || job.salary_range || job.compensation || 'No especificado',
    contractType: contractMap[typeof rawContract === 'string' ? rawContract.toLowerCase() : rawContract] || rawContract || 'No especificado',
    sector: job.sector || job.industry || job.category || job.department || 'No especificado',
    technology: job.technology || job.tech_stack || job.tags?.join(', ') || job.skills?.join(', ') || 'No especificado',
    description: stripHtml(job.description || job.job_description || job.summary || job.text) || 'Sin descripción disponible',
    requirements: job.requirements || job.qualifications || job.skills || [],
    benefits: job.benefits || job.perks || [],
    postedDate: job.posted_date || job.created_at || job.date || job.publication_date || new Date().toISOString().split('T')[0],
    url: job.url || job.apply_url || job.application_url || job.link || '#',
    // Campos adicionales que la API podría proporcionar
    remote: job.remote || job.is_remote || rawWorkMode.toLowerCase().includes('remote') || false,
    logo: job.logo || job.company_logo || job.company_logo_url || '',
  };
};

/**
 * Función auxiliar para limpiar etiquetas HTML
 * @param {string} html - Texto con etiquetas HTML
 * @returns {string} Texto limpio sin etiquetas
 */
const stripHtml = (html) => {
  if (!html) return '';
  if (typeof html !== 'string') return String(html);
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
};

/**
 * Normaliza los datos de cursos de la API externa al formato interno
 * @param {Object} apiData - Datos de la API externa
 * @returns {Array} Datos normalizados
 */
const normalizeCoursesData = (apiData) => {
  // Si la API devuelve un array directo
  if (Array.isArray(apiData)) {
    return apiData.map(course => normalizeCourseDetails(course));
  }

  // Si la API devuelve un objeto con propiedades como 'courses', 'results', 'data', etc.
  const coursesArray = apiData.courses || apiData.results || apiData.data || apiData.items || [];
  
  return coursesArray.map(course => normalizeCourseDetails(course));
};

/**
 * Normaliza los detalles de un curso individual
 * @param {Object} course - Datos del curso de la API externa
 * @returns {Object} Datos normalizados
 */
const normalizeCourseDetails = (course) => {
  // Manejo especial para YouTube Data API
  if (course.id && course.snippet && course.snippet.title) {
    return {
      id: course.id.videoId || course.id,
      title: course.snippet.title,
      provider: course.snippet.channelTitle || 'YouTube',
      category: course.snippet.categoryId || 'Educación',
      level: 'No especificado',
      duration: 'No especificado',
      language: course.snippet.defaultLanguage || 'es',
      price: 'Gratis',
      rating: 0,
      reviews: 0,
      students: 0,
      description: course.snippet.description || 'Sin descripción',
      requirements: [],
      learningOutcomes: [],
      syllabus: [],
      imageUrl: course.snippet.thumbnails?.high?.url || course.snippet.thumbnails?.medium?.url || '',
      url: `https://www.youtube.com/watch?v=${course.id.videoId || course.id}`,
      certificate: false,
      lastUpdated: course.snippet.publishedAt || new Date().toISOString(),
      location: '',
      mode: 'online',
    };
  }

  // Manejo especial para Google Custom Search
  if (course.title && course.link && course.snippet) {
    return {
      id: course.cacheId || course.link,
      title: course.title,
      provider: course.displayLink || 'Google Search',
      category: 'No especificado',
      level: 'No especificado',
      duration: 'No especificado',
      language: 'es',
      price: 'No especificado',
      rating: 0,
      reviews: 0,
      students: 0,
      description: course.snippet || 'Sin descripción',
      requirements: [],
      learningOutcomes: [],
      syllabus: [],
      imageUrl: course.pagemap?.cse_image?.[0]?.src || '',
      url: course.link,
      certificate: false,
      lastUpdated: new Date().toISOString(),
      location: '',
      mode: 'online',
    };
  }

  // Manejo especial para Bing Search API
  if (course.name && course.url && course.snippet) {
    return {
      id: course.id || course.url,
      title: course.name,
      provider: course.displayUrl || 'Bing Search',
      category: 'No especificado',
      level: 'No especificado',
      duration: 'No especificado',
      language: 'es',
      price: 'No especificado',
      rating: 0,
      reviews: 0,
      students: 0,
      description: course.snippet || 'Sin descripción',
      requirements: [],
      learningOutcomes: [],
      syllabus: [],
      imageUrl: course.image?.thumbnailUrl || '',
      url: course.url,
      certificate: false,
      lastUpdated: course.dateLastCrawled || new Date().toISOString(),
      location: '',
      mode: 'online',
    };
  }

  // Manejo para RSS feeds (cursos de blogs)
  if (course.title && course.link && course.description) {
    return {
      id: course.link,
      title: course.title,
      provider: course.source || 'Blog Educativo',
      category: course.category || 'No especificado',
      level: 'No especificado',
      duration: 'No especificado',
      language: 'es',
      price: 'No especificado',
      rating: 0,
      reviews: 0,
      students: 0,
      description: stripHtml(course.description) || 'Sin descripción',
      requirements: [],
      learningOutcomes: [],
      syllabus: [],
      imageUrl: '',
      url: course.link,
      certificate: false,
      lastUpdated: course.pubDate || new Date().toISOString(),
      location: '',
      mode: 'online',
    };
  }

  // Normalización genérica para otras APIs
  return {
    id: course.id || course.course_id || course._id,
    title: course.title || course.course_title || course.name || 'Sin título',
    provider: course.provider || course.instructor || course.author || 'Proveedor no especificado',
    category: course.category || course.subject || course.topic || 'Sin categoría',
    level: course.level || course.difficulty || 'No especificado',
    duration: course.duration || course.length || course.hours || 'No especificado',
    language: course.language || course.locale || 'es',
    price: course.price || course.cost || course.fee || 'No especificado',
    rating: course.rating || course.average_rating || course.score || 0,
    reviews: course.reviews || course.review_count || 0,
    students: course.students || course.enrollment_count || course.participants || 0,
    description: course.description || course.summary || course.about || 'Sin descripción',
    requirements: course.requirements || course.prerequisites || [],
    learningOutcomes: course.learning_outcomes || course.objectives || course.what_you_learn || [],
    syllabus: course.syllabus || course.curriculum || course.modules || [],
    imageUrl: course.image_url || course.thumbnail || course.cover_image || '',
    url: course.url || course.course_url || course.link || '#',
    // Campos adicionales que la API podría proporcionar
    certificate: course.certificate || course.has_certificate || false,
    lastUpdated: course.last_updated || course.updated_at || new Date().toISOString(),
    location: course.location || course.country || course.city || '',
    mode: course.mode || course.delivery_mode || course.is_online !== undefined ? (course.is_online ? 'online' : 'presencial') : 'no especificado',
  };
};

/**
 * Filtra cursos por ubicación y modalidad
 * @param {Array} courses - Lista de cursos normalizados
 * @param {string} location - Ubicación (ej: 'españa', 'madrid')
 * @param {string} mode - Modalidad ('presencial', 'online', 'ambos')
 * @returns {Array} Cursos filtrados
 */
const filterCoursesByLocationAndMode = (courses, location, mode) => {
  if (!location && (!mode || mode === 'ambos')) {
    return courses;
  }

  return courses.filter(course => {
    // Filtro por ubicación
    let locationMatch = true;
    if (location) {
      const courseLocation = (course.location || '').toLowerCase();
      const searchLocation = location.toLowerCase();
      locationMatch = courseLocation.includes(searchLocation) || 
                      courseLocation.includes('españa') || 
                      courseLocation.includes('spain');
    }

    // Filtro por modalidad
    let modeMatch = true;
    if (mode && mode !== 'ambos') {
      const courseMode = (course.mode || '').toLowerCase();
      if (mode === 'online') {
        modeMatch = courseMode === 'online' || courseMode === 'remoto' || courseMode === 'virtual';
      } else if (mode === 'presencial') {
        modeMatch = courseMode === 'presencial' || courseMode === 'in-person' || courseMode === 'offline';
      }
    }

    return locationMatch && modeMatch;
  });
};

/**
 * Busca cursos en múltiples APIs externas y RSS feeds
 * @param {Object} filters - Filtros de búsqueda
 * @param {string} filters.query - Término de búsqueda
 * @param {string} filters.category - Categoría
 * @param {string} filters.level - Nivel (principiante, intermedio, avanzado)
 * @param {string} filters.mode - Modalidad (online, presencial, ambos)
 * @param {number} filters.page - Página de resultados
 * @param {number} filters.limit - Límite de resultados por página
 * @returns {Promise<Array>} Lista combinada de cursos de todas las fuentes
 */
export const searchCourses = async (filters = {}) => {
  const {
    query = '',
    category = '',
    level = '',
    mode = '',
    page = 1,
    limit = 20,
  } = filters;

  const enabledApis = API_CONFIG.COURSES_APIS.filter(api => api.enabled && api.url);
  const enabledRss = API_CONFIG.COURSES_RSS.filter(rss => rss.enabled && rss.url);
  const allResults = [];
  const apiErrors = [];

  // Realizar peticiones a todas las APIs habilitadas en paralelo
  const apiPromises = enabledApis.map(async (api) => {
    try {
      let url = api.url;
      const params = new URLSearchParams();
      
      // Configuración específica para cada API
      if (api.name === 'YouTube Data API') {
        if (!api.apiKey) return { source: api.name, data: [] };
        params.append('part', 'snippet');
        params.append('q', query || 'cursos');
        params.append('type', 'video');
        params.append('maxResults', limit);
        params.append('key', api.apiKey);
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}${params.toString()}`;
      } else if (api.name === 'Google Custom Search') {
        if (!api.apiKey) return { source: api.name, data: [] };
        params.append('q', query || 'cursos online');
        params.append('cx', import.meta.env.VITE_GOOGLE_CSE_ID || '');
        params.append('key', api.apiKey);
        params.append('num', limit);
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}${params.toString()}`;
      } else if (api.name === 'Bing Search API') {
        if (!api.apiKey) return { source: api.name, data: [] };
        params.append('q', query || 'cursos online');
        params.append('count', limit);
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}${params.toString()}`;
      } else {
        url = buildAuthUrl(api.url, api.appId, api.apiKey);
      }
      
      console.log(`Processing Course API: ${api.name}, URL: ${url}`);
      
      const headers = getHeaders(api.apiKey);
      // Bing usa header diferente para API key
      if (api.name === 'Bing Search API') {
        headers['Ocp-Apim-Subscription-Key'] = api.apiKey;
        delete headers['Authorization'];
      }
      
      const data = await fetchFromApi(url, headers, `buscar cursos en ${api.name}`);
      
      // Extraer array de resultados según la API
      let coursesData = data;
      if (api.name === 'YouTube Data API') {
        coursesData = data.items || [];
      } else if (api.name === 'Google Custom Search') {
        coursesData = data.items || [];
      } else if (api.name === 'Bing Search API') {
        coursesData = data.webPages?.value || [];
      }
      
      const normalizedData = normalizeCoursesData(coursesData);
      
      return {
        source: api.name,
        data: normalizedData,
      };
    } catch (error) {
      console.error(`Error en API de cursos ${api.name}:`, error);
      apiErrors.push({ api: api.name, error: error.message });
      return { source: api.name, data: [] };
    }
  });

  // Esperar todas las peticiones de APIs
  const apiResults = await Promise.all(apiPromises);

  // Combinar resultados de APIs
  apiResults.forEach(result => {
    result.data.forEach(course => {
      course.source = result.source;
      allResults.push(course);
    });
  });

  // Realizar peticiones a RSS feeds habilitados
  const rssPromises = enabledRss.map(async (rss) => {
    try {
      console.log(`Processing Course RSS: ${rss.name}, URL: ${rss.url}`);
      const items = await fetchFromRSS(rss.url, `buscar feed ${rss.name}`);
      
      // Normalizar items de RSS a formato de cursos
      const normalizedItems = items.map(item => ({
        id: item.link || Math.random().toString(36).substr(2, 9),
        title: item.title || 'Sin título',
        provider: rss.name,
        category: item.category || 'Sin categoría',
        level: 'No especificado',
        duration: 'No especificado',
        language: 'es',
        price: 'No especificado',
        rating: 0,
        reviews: 0,
        students: 0,
        description: stripHtml(item.description) || 'Sin descripción',
        requirements: [],
        learningOutcomes: [],
        syllabus: [],
        imageUrl: '',
        url: item.link || '#',
        certificate: false,
        lastUpdated: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        location: '',
        mode: 'online',
        source: rss.name,
      }));
      
      return {
        source: rss.name,
        data: normalizedItems,
      };
    } catch (error) {
      console.error(`Error en RSS de cursos ${rss.name}:`, error);
      apiErrors.push({ api: rss.name, error: error.message });
      return { source: rss.name, data: [] };
    }
  });

  // Esperar todas las peticiones de RSS
  const rssResults = await Promise.all(rssPromises);

  // Combinar resultados de RSS
  rssResults.forEach(result => {
    result.data.forEach(course => {
      allResults.push(course);
    });
  });

  // Log de errores si existen
  if (apiErrors.length > 0) {
    console.warn('Errores en algunas fuentes de cursos:', apiErrors);
  }

  // Aplicar límite total a resultados combinados
  return allResults.slice(0, limit);
};

/**
 * Verifica la conexión con tu Backend Laboria
 * @returns {Promise<Object>} Estado de conexión del backend
 */
export const checkLaboriaBackendConnection = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos timeout
    
    const response = await fetch(`${LABORIA_API_URL}/`, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      return {
        connected: true,
        message: data.message || 'Backend Laboria conectado',
        url: LABORIA_API_URL,
      };
    } else {
      return {
        connected: false,
        error: `HTTP ${response.status}`,
        url: LABORIA_API_URL,
      };
    }
  } catch (error) {
    let errorMessage = error.message;
    if (error.name === 'AbortError') {
      errorMessage = 'Timeout - backend no responde en 5 segundos';
    } else if (error.message.includes('Failed to fetch')) {
      errorMessage = 'Backend no accesible - ¿Está corriendo en el puerto 3000?';
    }
    
    return {
      connected: false,
      error: errorMessage,
      url: LABORIA_API_URL,
    };
  }
};

/**
 * Verifica la conexión con las APIs externas y tu backend
 * @returns {Promise<Object>} Estado de conexión de cada API individual
 */
export const checkApiConnection = async () => {
  const status = {
    laboria: null,
    jobs: [],
    courses: [],
  };
  
  // Verificar conexión con tu backend Laboria primero
  status.laboria = await checkLaboriaBackendConnection();

  // Verificar conexión con cada API de empleo habilitada
  for (const api of API_CONFIG.JOBS_APIS) {
    if (!api.enabled || !api.url) {
      status.jobs.push({
        name: api.name,
        connected: false,
        error: 'No habilitada o sin URL',
      });
      continue;
    }

    try {
      // Usar URL directa con timeout
      let url = api.url;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(api.apiKey),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      status.jobs.push({
        name: api.name,
        connected: response.ok,
        error: response.ok ? null : `HTTP ${response.status}`,
        note: response.ok ? 'Conexión exitosa' : 'Error en respuesta',
      });
    } catch (error) {
      let errorMessage = error.message;
      if (error.name === 'AbortError') {
        errorMessage = 'Timeout - no respondió en 10 segundos';
      } else if (error.message.includes('CORS')) {
        errorMessage = 'Error CORS - API no permite llamadas desde navegador';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Error de red - posiblemente bloqueada por CORS';
      }
      
      status.jobs.push({
        name: api.name,
        connected: false,
        error: errorMessage,
      });
    }
  }

  // Verificar conexión con cada API de cursos habilitada
  for (const api of API_CONFIG.COURSES_APIS) {
    if (!api.enabled || !api.url) {
      status.courses.push({
        name: api.name,
        connected: false,
        error: 'No habilitada o sin URL',
      });
      continue;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(api.url, {
        method: 'GET',
        headers: getHeaders(api.apiKey),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      status.courses.push({
        name: api.name,
        connected: response.ok,
        error: response.ok ? null : `HTTP ${response.status}`,
        note: response.ok ? 'Conexión exitosa' : 'Error en respuesta',
      });
    } catch (error) {
      let errorMessage = error.message;
      if (error.name === 'AbortError') {
        errorMessage = 'Timeout - no respondió en 10 segundos';
      } else if (error.message.includes('CORS')) {
        errorMessage = 'Error CORS - API no permite llamadas desde navegador';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Error de red - posiblemente bloqueada por CORS';
      }
      
      status.courses.push({
        name: api.name,
        connected: false,
        error: errorMessage,
      });
    }
  }

  return status;
};

/**
 * Obtiene el total de ofertas de empleo disponibles de todas las APIs
 * @returns {Promise<number>} Total de ofertas de empleo
 */
export const getTotalJobsCount = async () => {
  let totalCount = 0;

  for (const api of API_CONFIG.JOBS_APIS) {
    if (!api.enabled || !api.url) {
      continue;
    }

    try {
      let url = api.url;
      const params = new URLSearchParams();

      // Para APIs que requieren parámetros específicos
      if (api.name === 'Junta Castilla y León Empleo') {
        params.append('rows', '0'); // Solo obtener count
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}${params.toString()}`;
      } else if (api.name === 'SerpApi Google Jobs') {
        if (!api.apiKey) continue;
        params.append('engine', 'google_jobs');
        params.append('q', 'empleo España');
        params.append('api_key', api.apiKey);
        params.append('num', '10'); // Obtener una muestra para estimar
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}${params.toString()}`;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(api.apiKey),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        
        // Extraer el count según la estructura de cada API
        if (api.name === 'Junta Castilla y León Empleo') {
          totalCount += data.nhits || 0;
        } else if (api.name === 'SerpApi Google Jobs') {
          // SerpApi no devuelve total, usamos una estimación basada en los resultados
          const jobsArray = data.jobs_results || [];
          totalCount += jobsArray.length * 10; // Estimación conservadora
        } else if (Array.isArray(data)) {
          totalCount += data.length;
        } else {
          const jobsArray = data.jobs || data.results || data.data || data.items || data.records || [];
          totalCount += jobsArray.length;
        }
      }
    } catch (error) {
      console.error(`Error al contar ofertas de ${api.name}:`, error);
      continue;
    }
  }

  return totalCount;
};

/**
 * Obtiene el total de cursos disponibles de todas las APIs
 * @returns {Promise<number>} Total de cursos
 */
export const getTotalCoursesCount = async () => {
  let totalCount = 0;

  for (const api of API_CONFIG.COURSES_APIS) {
    if (!api.enabled || !api.url) {
      continue;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(api.url, {
        method: 'GET',
        headers: getHeaders(api.apiKey),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        
        // Extraer el count según la estructura de cada API
        if (Array.isArray(data)) {
          totalCount += data.length;
        } else {
          const coursesArray = data.courses || data.results || data.data || data.items || data.records || [];
          totalCount += coursesArray.length;
        }
      }
    } catch (error) {
      console.error(`Error al contar cursos de ${api.name}:`, error);
      continue;
    }
  }

  return totalCount;
};

// =====================================================
// LABORIA BACKEND API - Tu API propia
// =====================================================

const LABORIA_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Busca empleos en tu backend Laboria
 * @param {Object} filters - Filtros de búsqueda
 * @returns {Promise<Array>} Lista de empleos de tu backend
 */
export const searchLaboriaJobs = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.query) params.append('search', filters.query);
    if (filters.location) params.append('location', filters.location);
    if (filters.category) params.append('category', filters.category);
    if (filters.workMode) params.append('mode', filters.workMode);
    
    const url = `${LABORIA_API_URL}/api/jobs?${params}`;
    console.log(`[Laboria API] Buscando empleos: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[Laboria API] Empleos encontrados:`, data.length);
    
    // Normalizar datos del backend al formato del frontend
    return data.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location || 'No especificado',
      workMode: job.mode === 'REMOTE' ? 'Remoto' : job.mode === 'HYBRID' ? 'Híbrido' : 'Presencial',
      schedule: 'Completa',
      experienceLevel: 'No especificado',
      salary: job.salary || 'No especificado',
      contractType: 'No especificado',
      sector: job.category || 'No especificado',
      technology: job.requirements || 'No especificado',
      description: job.description || 'Sin descripción',
      requirements: job.requirements ? job.requirements.split(',').map(r => r.trim()) : [],
      benefits: [],
      postedDate: job.createdAt ? job.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
      url: `#/empleos/${job.id}`,
      remote: job.mode === 'REMOTE',
      logo: '',
      source: 'Laboria',
    }));
  } catch (error) {
    console.error('[Laboria API] Error:', error);
    return []; // Devolver array vacío para que pase al siguiente origen
  }
};

/**
 * Busca cursos en tu backend Laboria
 * @param {Object} filters - Filtros de búsqueda
 * @returns {Promise<Array>} Lista de cursos de tu backend
 */
export const searchLaboriaCourses = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.query) params.append('search', filters.query);
    if (filters.category) params.append('category', filters.category);
    if (filters.level) params.append('level', filters.level);
    
    const url = `${LABORIA_API_URL}/api/courses?${params}`;
    console.log(`[Laboria API] Buscando cursos: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[Laboria API] Cursos encontrados:`, data.length);
    
    // Normalizar datos del backend al formato del frontend
    return data.map(course => ({
      id: course.id,
      title: course.title,
      provider: course.provider,
      category: course.category || 'No especificado',
      level: course.level === 'BEGINNER' ? 'Principiante' : 
             course.level === 'INTERMEDIATE' ? 'Intermedio' : 
             course.level === 'ADVANCED' ? 'Avanzado' : 'No especificado',
      duration: course.duration || 'No especificado',
      language: 'es',
      price: course.price || 'No especificado',
      rating: 0,
      reviews: 0,
      students: 0,
      description: course.description || 'Sin descripción',
      requirements: [],
      learningOutcomes: [],
      syllabus: [],
      imageUrl: course.image || '',
      url: course.url || `#/cursos/${course.id}`,
      certificate: false,
      lastUpdated: course.updatedAt || course.createdAt || new Date().toISOString(),
      location: '',
      mode: 'online',
      source: 'Laboria',
    }));
  } catch (error) {
    console.error('[Laboria API] Error:', error);
    return []; // Devolver array vacío para que pase al siguiente origen
  }
};

// =====================================================
// FUNCIÓN COMBINADA: Prioridad Laboria → Externas → Local
// =====================================================

/**
 * Busca empleos combinando: Laboria (tu backend) → APIs externas → Datos locales
 * @param {Object} filters - Filtros de búsqueda
 * @returns {Promise<Array>} Lista combinada de empleos
 */
export const searchAllJobs = async (filters = {}) => {
  const limit = filters.limit || 50;
  const allResults = [];
  
  // 1. Intentar tu backend Laboria primero
  const laboriaResults = await searchLaboriaJobs(filters);
  allResults.push(...laboriaResults);
  
  // 2. Si no hay suficientes resultados, buscar en APIs externas
  if (allResults.length < limit) {
    const externalResults = await searchJobs(filters);
    // Agregar solo los que no existan ya (por ID)
    const existingIds = new Set(allResults.map(j => j.id));
    const newExternal = externalResults.filter(j => !existingIds.has(j.id));
    allResults.push(...newExternal);
  }
  
  // 3. Si sigue sin haber suficientes, usar datos locales
  if (allResults.length < limit / 2) {
    console.warn('[searchAllJobs] Pocos resultados, usando fallback local');
    // Este fallback se maneja en los componentes
  }
  
  return allResults.slice(0, limit);
};

/**
 * Busca cursos combinando: Laboria (tu backend) → APIs externas → Datos locales
 * @param {Object} filters - Filtros de búsqueda
 * @returns {Promise<Array>} Lista combinada de cursos
 */
export const searchAllCourses = async (filters = {}) => {
  const limit = filters.limit || 50;
  const allResults = [];
  
  // 1. Intentar tu backend Laboria primero
  const laboriaResults = await searchLaboriaCourses(filters);
  allResults.push(...laboriaResults);
  
  // 2. Si no hay suficientes resultados, buscar en APIs externas
  if (allResults.length < limit) {
    const externalResults = await searchCourses(filters);
    // Agregar solo los que no existan ya (por ID)
    const existingIds = new Set(allResults.map(c => c.id));
    const newExternal = externalResults.filter(c => !existingIds.has(c.id));
    allResults.push(...newExternal);
  }
  
  return allResults.slice(0, limit);
};

// Exportar configuración para uso en otros componentes
export { API_CONFIG };
