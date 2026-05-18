import { logger } from '../utils/logger';
import API_CONFIG from '../config/externalApis';
import { buildAuthUrl, getHeaders, fetchFromApi, fetchFromRSS, stripHtml } from './apiUtils';

export const searchJobs = async (filters = {}) => {
  const { query = '', location = '', category = '', workMode = '', page = 1, limit = 20 } = filters;
  const enabledApis = API_CONFIG.JOBS_APIS.filter(api => api.enabled && api.url);
  const enabledRss = API_CONFIG.JOBS_RSS.filter(rss => rss.enabled && rss.url);
  const allResults = [];
  const apiErrors = [];

  const apiPromises = enabledApis.map(async (api) => {
    try {
      let url = buildAuthUrl(api.url, api.appId, api.apiKey);
      const params = new URLSearchParams();

      if (api.name === 'RemoteOK') {
      } else if (api.name === 'Remotive Remote Jobs') {
        if (query) params.append('search', query);
        if (category) params.append('category', category);
        params.append('limit', limit);
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}${params.toString()}`;
      } else if (api.name === 'Jobicy Remote Jobs') {
        params.append('count', limit);
        if (location) params.append('geo', location);
        else params.append('geo', 'spain');
        if (query) params.append('tag', query);
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}${params.toString()}`;
      } else if (api.name === 'Himalayas Remote Jobs') {
        if (query) params.append('q', query);
        if (location) params.append('country', location);
        else params.append('country', 'Spain');
        params.append('limit', limit);
        params.append('offset', (page - 1) * limit);
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}${params.toString()}`;
      } else if (api.name === 'Arbeitnow Job Board') {
      } else if (api.name === 'Junta Castilla y León Empleo') {
        params.append('rows', limit);
        params.append('start', (page - 1) * limit);
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}${params.toString()}`;
      } else if (api.name === 'SerpApi Google Jobs') {
        params.append('engine', 'google_jobs');
        if (query) params.append('q', query);
        else params.append('q', 'empleo España');
        if (location) params.append('location', location);
        else params.append('location', 'Spain');
        params.append('api_key', api.apiKey);
        params.append('num', limit);
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}${params.toString()}`;
      }

      const headers = getHeaders(api.apiKey);
      const data = await fetchFromApi(url, headers, `buscar ofertas en ${api.name}`);
      const normalizedData = normalizeJobsData(data);
      return { source: api.name, data: normalizedData };
    } catch (error) {
      logger.error(`Error en API ${api.name}:`, error);
      apiErrors.push({ api: api.name, error: error.message });
      return { source: api.name, data: [] };
    }
  });

  const apiResults = await Promise.all(apiPromises);
  apiResults.forEach(result => {
    result.data.forEach(job => { job.source = result.source; allResults.push(job); });
  });

  const rssPromises = enabledRss.map(async (rss) => {
    try {
      const items = await fetchFromRSS(rss.url, `buscar feed ${rss.name}`);
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
        requirements: [], benefits: [],
        postedDate: item.pubDate ? new Date(item.pubDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        url: item.link || '#', remote: false, logo: '', source: rss.name,
      }));
      return { source: rss.name, data: normalizedItems };
    } catch (error) {
      logger.error(`Error en RSS ${rss.name}:`, error);
      apiErrors.push({ api: rss.name, error: error.message });
      return { source: rss.name, data: [] };
    }
  });

  const rssResults = await Promise.all(rssPromises);
  rssResults.forEach(result => {
    result.data.forEach(job => { allResults.push(job); });
  });

  if (apiErrors.length > 0) logger.warn('Errores en algunas fuentes de empleo:', apiErrors);

  const filteredResults = allResults.filter(job => {
    let locationMatch = true;
    if (location && (location.toLowerCase().includes('españa') || location.toLowerCase().includes('spain'))) {
      const jobLocation = (job.location || '').toLowerCase();
      locationMatch = jobLocation.includes('españa') || jobLocation.includes('spain') || jobLocation.includes('es') || jobLocation === 'remoto' || jobLocation === 'no especificado';
    }
    let workModeMatch = true;
    if (workMode) {
      const jobWorkMode = (job.workMode || '').toLowerCase();
      if (workMode.toLowerCase() === 'remoto') workModeMatch = jobWorkMode === 'remoto' || job.remote === true;
      else if (workMode.toLowerCase() === 'híbrido') workModeMatch = jobWorkMode === 'híbrido' || jobWorkMode === 'hybrid';
      else if (workMode.toLowerCase() === 'presencial') workModeMatch = jobWorkMode === 'presencial' || jobWorkMode === 'on-site' || jobWorkMode === 'onsite';
    }
    let searchMatch = true;
    if (query && query.trim() !== '') {
      const searchLower = query.toLowerCase();
      searchMatch = (job.title || '').toLowerCase().includes(searchLower) || (job.company || '').toLowerCase().includes(searchLower) || (job.sector || '').toLowerCase().includes(searchLower) || (job.technology || '').toLowerCase().includes(searchLower) || (job.description || '').toLowerCase().includes(searchLower) || (job.location || '').toLowerCase().includes(searchLower);
    }
    return locationMatch && workModeMatch && searchMatch;
  });

  return filteredResults.slice(0, limit);
};

export const getJobDetails = async (jobId, source = null) => {
  if (source) {
    const api = API_CONFIG.JOBS_APIS.find(api => api.name === source && api.enabled);
    if (!api) { console.error(`API ${source} no encontrada o no habilitada`); return null; }
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

const normalizeJobsData = (apiData) => {
  if (Array.isArray(apiData)) return apiData.map(job => normalizeJobDetails(job));
  const jobsArray = apiData.jobs || apiData.results || apiData.data || apiData.items || apiData.records || apiData.jobs_results || [];
  return jobsArray.map(job => normalizeJobDetails(job));
};

const workModeMap = { 'remote': 'Remoto', 'hybrid': 'Híbrido', 'on-site': 'Presencial', 'onsite': 'Presencial', 'full-time': 'Tiempo completo', 'part-time': 'Tiempo parcial', 'contractor': 'Autónomo', 'freelance': 'Freelance' };
const experienceMap = { 'entry': 'Junior', 'junior': 'Junior', 'mid': 'Intermedio', 'mid-level': 'Intermedio', 'intermediate': 'Intermedio', 'senior': 'Senior', 'lead': 'Liderazgo', 'manager': 'Manager', 'director': 'Director', 'executive': 'Ejecutivo' };
const contractMap = { 'full-time': 'Indefinido', 'part-time': 'Parcial', 'contract': 'Temporal', 'temporary': 'Temporal', 'internship': 'Prácticas', 'freelance': 'Freelance', 'volunteer': 'Voluntario', 'indefinido': 'Indefinido', 'temporal': 'Temporal' };
const scheduleMap = { 'full-time': 'Completa', 'part-time': 'Parcial', 'flexible': 'Flexible', 'completa': 'Completa', 'parcial': 'Parcial' };

const canHandle = (predicate) => (job) => predicate(job);

const normalizeRemoteOK = (job) => ({
  id: job.slug || job.id, title: job.position || job.title || 'Sin título',
  company: job.company || 'Empresa no especificada', location: job.location || 'Remoto',
  workMode: 'Remoto', schedule: scheduleMap[job.time?.toLowerCase()] || job.time || 'Completa',
  experienceLevel: experienceMap[job.seniority?.toLowerCase()] || job.seniority || 'No especificado',
  salary: job.salary_min || job.salary_max ? `${job.salary_min || ''} - ${job.salary_max || ''}` : 'No especificado',
  contractType: contractMap[job.job_type?.toLowerCase()] || job.job_type || 'No especificado',
  sector: job.tags?.[0] || 'No especificado', technology: job.tags?.join(', ') || 'No especificado',
  description: stripHtml(job.description) || 'Sin descripción disponible', requirements: job.tags || [], benefits: [],
  postedDate: job.epoch ? new Date(job.epoch * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  url: job.url || job.apply_url || '#', remote: true, logo: job.company_logo || '',
});

const normalizeRemotive = (job) => ({
  id: job.id || job.slug, title: job.title || 'Sin título', company: job.company_name || 'Empresa no especificada',
  location: job.candidate_required_location || 'Remoto', workMode: 'Remoto',
  schedule: scheduleMap[job.job_type?.toLowerCase()] || job.job_type || 'Completa',
  experienceLevel: experienceMap[job.experience?.toLowerCase()] || job.experience || 'No especificado',
  salary: job.salary || 'No especificado',
  contractType: contractMap[job.job_type?.toLowerCase()] || job.job_type || 'No especificado',
  sector: job.categories?.[0]?.name || 'No especificado', technology: job.tags?.join(', ') || 'No especificado',
  description: stripHtml(job.description) || 'Sin descripción disponible', requirements: job.tags || [], benefits: [],
  postedDate: job.publication_date || new Date().toISOString().split('T')[0],
  url: job.url || '#', remote: true, logo: job.company_logo || '',
});

const normalizeSerpApi = (job) => {
  const scheduleType = job.detected_extensions?.schedule_type || 'No especificado';
  const postedAt = job.detected_extensions?.posted_at || job.extensions?.[0] || '';
  let workMode = 'Presencial';
  if (job.detected_extensions?.schedule_type?.toLowerCase().includes('remote') || job.location?.toLowerCase().includes('remote')) workMode = 'Remoto';
  else if (job.location?.toLowerCase().includes('hybrid')) workMode = 'Híbrido';
  let salary = 'No especificado';
  if (job.detected_extensions?.salary) salary = job.detected_extensions.salary;
  else { const salaryExt = job.extensions?.find(ext => ext.includes('$') || ext.includes('€') || ext.includes('hour') || ext.includes('year')); if (salaryExt) salary = salaryExt; }
  return {
    id: job.job_id || job.share_link, title: job.title || 'Sin título',
    company: job.company_name || 'Empresa no especificada', location: job.location || 'No especificado',
    workMode, schedule: scheduleMap[scheduleType?.toLowerCase()] || scheduleType || 'Completa',
    experienceLevel: job.detected_extensions?.qualifications || 'No especificado', salary,
    contractType: 'No especificado', sector: job.via || 'No especificado', technology: 'No especificado',
    description: stripHtml(job.description) || 'Sin descripción disponible',
    requirements: job.extensions || [], benefits: job.extensions?.filter(ext => ext.includes('insurance') || ext.includes('benefit') || ext.includes('paid')) || [],
    postedDate: postedAt || new Date().toISOString().split('T')[0], url: job.source_link || job.share_link || '#',
    remote: workMode === 'Remoto', logo: job.thumbnail || '',
  };
};

const normalizeJCYL = (job) => {
  const f = job.fields;
  return {
    id: f.identificador || job.recordid, title: f.titulo || 'Sin título',
    company: 'Servicio Público de Empleo Castilla y León',
    location: f.localidad ? `${f.localidad}, ${f.provincia}` : f.provincia || 'Castilla y León',
    workMode: 'Presencial', schedule: 'Completa', experienceLevel: 'No especificado', salary: 'No especificado',
    contractType: contractMap[f.tipo_contrato?.toLowerCase()] || f.tipo_contrato || 'No especificado',
    sector: 'Empleo Público', technology: 'No especificado',
    description: stripHtml(f.descripcion) || 'Sin descripción disponible',
    requirements: [], benefits: [], postedDate: f.fecha_publicacion || new Date().toISOString().split('T')[0],
    url: f.enlace_al_contenido || '#', remote: false, logo: '',
  };
};

const normalizeArbeitnow = (job) => ({
  id: job.job_id, title: job.title || 'Sin título', company: job.company_name || 'Empresa no especificada',
  location: job.location || 'No especificado',
  workMode: job.detected_extensions.schedule_type === 'REMOTE' ? 'Remoto' : job.detected_extensions.schedule_type === 'HYBRID' ? 'Híbrido' : 'Presencial',
  schedule: job.detected_extensions.schedule_type || 'Completa',
  experienceLevel: job.detected_extensions.experience_level || 'No especificado',
  salary: job.detected_extensions.salary || 'No especificado',
  contractType: job.detected_extensions.contract_type || 'No especificado',
  sector: job.detected_extensions.industry || 'No especificado',
  technology: job.detected_extensions.qualifications?.join(', ') || 'No especificado',
  description: stripHtml(job.description) || 'Sin descripción disponible',
  requirements: job.detected_extensions.qualifications || [], benefits: job.detected_extensions.benefits || [],
  postedDate: job.detected_extensions.posted_at || new Date().toISOString().split('T')[0],
  url: job.apply_options?.[0]?.link || job.share_link || '#',
  remote: job.detected_extensions.schedule_type === 'REMOTE', logo: job.company_logo || '',
});

const normalizeJobicy = (job) => ({
  id: job.codigo, title: job.puesto || 'Sin título', company: job.empresa || 'Empresa no especificada',
  location: job.provincia || 'No especificado',
  workMode: workModeMap[job.modalidad?.toLowerCase()] || job.modalidad || 'No especificado',
  schedule: job.jornada || 'Completa', experienceLevel: job.experiencia || 'No especificado',
  salary: job.salario || 'No especificado',
  contractType: contractMap[job.tipo_contrato?.toLowerCase()] || job.tipo_contrato || 'No especificado',
  sector: job.categoria || 'No especificado', technology: job.requisitos || 'No especificado',
  description: stripHtml(job.descripcion) || 'Sin descripción disponible',
  requirements: job.requisitos_minimos || [], benefits: job.prestaciones || [],
  postedDate: job.fecha_publicacion || new Date().toISOString().split('T')[0], url: job.url || '#',
  remote: job.teletrabajo || false, logo: job.logo_empresa || '',
});

const normalizeFallback = (job) => {
  const rawWorkMode = job.work_mode || job.workMode || job.employment_type || job.type || '';
  const rawExperience = job.experience_level || job.level || job.seniority || '';
  const rawContract = job.contract_type || job.employment_type || job.type || '';
  const rawSchedule = job.schedule || job.hours || '';
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
    remote: job.remote || job.is_remote || (rawWorkMode && rawWorkMode.toLowerCase().includes('remote')) || false,
    logo: job.logo || job.company_logo || job.company_logo_url || '',
  };
};

const normalizers = [
  { canHandle: (job) => job.slug && job.company && job.tags, normalize: normalizeRemoteOK },
  { canHandle: (job) => job.url && job.company_name && job.categories, normalize: normalizeRemotive },
  { canHandle: (job) => job.title && job.company_name && job.location, normalize: normalizeSerpApi },
  { canHandle: (job) => job.fields, normalize: normalizeJCYL },
  { canHandle: (job) => job.job_id && job.detected_extensions, normalize: normalizeArbeitnow },
  { canHandle: (job) => job.codigo && job.puesto, normalize: normalizeJobicy },
];

const normalizeJobDetails = (job) => {
  const normalizer = normalizers.find(n => n.canHandle(job));
  if (normalizer) return normalizer.normalize(job);
  return normalizeFallback(job);
};
