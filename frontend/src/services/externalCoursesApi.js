import API_CONFIG from '../config/externalApis';
import { buildAuthUrl, getHeaders, fetchFromApi, fetchFromRSS, stripHtml } from './apiUtils';

export const searchCourses = async (filters = {}) => {
  const { query = '', category = '', level = '', mode = '', page = 1, limit = 20 } = filters;
  const enabledApis = API_CONFIG.COURSES_APIS.filter(api => api.enabled && api.url);
  const enabledRss = API_CONFIG.COURSES_RSS.filter(rss => rss.enabled && rss.url);
  const allResults = [];
  const apiErrors = [];

  const apiPromises = enabledApis.map(async (api) => {
    try {
      let url = api.url;
      const params = new URLSearchParams();

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

      const headers = getHeaders(api.apiKey);
      if (api.name === 'Bing Search API') {
        headers['Ocp-Apim-Subscription-Key'] = api.apiKey;
        delete headers['Authorization'];
      }

      const data = await fetchFromApi(url, headers, `buscar cursos en ${api.name}`);
      let coursesData = data;
      if (api.name === 'YouTube Data API') coursesData = data.items || [];
      else if (api.name === 'Google Custom Search') coursesData = data.items || [];
      else if (api.name === 'Bing Search API') coursesData = data.webPages?.value || [];

      const normalizedData = normalizeCoursesData(coursesData);
      return { source: api.name, data: normalizedData };
    } catch (error) {
      console.error(`Error en API de cursos ${api.name}:`, error);
      apiErrors.push({ api: api.name, error: error.message });
      return { source: api.name, data: [] };
    }
  });

  const apiResults = await Promise.all(apiPromises);
  apiResults.forEach(result => {
    result.data.forEach(course => { course.source = result.source; allResults.push(course); });
  });

  const rssPromises = enabledRss.map(async (rss) => {
    try {
      const items = await fetchFromRSS(rss.url, `buscar feed ${rss.name}`);
      const normalizedItems = items.map(item => ({
        id: item.link || Math.random().toString(36).substr(2, 9),
        title: item.title || 'Sin título', provider: rss.name,
        category: item.category || 'Sin categoría', level: 'No especificado',
        duration: 'No especificado', language: 'es', price: 'No especificado',
        rating: 0, reviews: 0, students: 0, description: stripHtml(item.description) || 'Sin descripción',
        requirements: [], learningOutcomes: [], syllabus: [], imageUrl: '',
        url: item.link || '#', certificate: false,
        lastUpdated: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        location: '', mode: 'online', source: rss.name,
      }));
      return { source: rss.name, data: normalizedItems };
    } catch (error) {
      console.error(`Error en RSS de cursos ${rss.name}:`, error);
      apiErrors.push({ api: rss.name, error: error.message });
      return { source: rss.name, data: [] };
    }
  });

  const rssResults = await Promise.all(rssPromises);
  rssResults.forEach(result => {
    result.data.forEach(course => { allResults.push(course); });
  });

  if (apiErrors.length > 0) console.warn('Errores en algunas fuentes de cursos:', apiErrors);
  return allResults.slice(0, limit);
};

export const getCourseDetails = async (courseId, source = null) => {
  if (source) {
    const api = API_CONFIG.COURSES_APIS.find(api => api.name === source && api.enabled);
    if (!api) { console.error(`API ${source} no encontrada o no habilitada`); return null; }
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

const normalizeCoursesData = (apiData) => {
  if (Array.isArray(apiData)) return apiData.map(course => normalizeCourseDetails(course));
  const coursesArray = apiData.courses || apiData.results || apiData.data || apiData.items || [];
  return coursesArray.map(course => normalizeCourseDetails(course));
};

const normalizeCourseDetails = (course) => {
  if (course.id && course.snippet && course.snippet.title) {
    return {
      id: course.id.videoId || course.id, title: course.snippet.title,
      provider: course.snippet.channelTitle || 'YouTube', category: course.snippet.categoryId || 'Educación',
      level: 'No especificado', duration: 'No especificado', language: course.snippet.defaultLanguage || 'es',
      price: 'Gratis', rating: 0, reviews: 0, students: 0, description: course.snippet.description || 'Sin descripción',
      requirements: [], learningOutcomes: [], syllabus: [],
      imageUrl: course.snippet.thumbnails?.high?.url || course.snippet.thumbnails?.medium?.url || '',
      url: `https://www.youtube.com/watch?v=${course.id.videoId || course.id}`,
      certificate: false, lastUpdated: course.snippet.publishedAt || new Date().toISOString(), location: '', mode: 'online',
    };
  }
  if (course.title && course.link && course.snippet) {
    return {
      id: course.cacheId || course.link, title: course.title, provider: course.displayLink || 'Google Search',
      category: 'No especificado', level: 'No especificado', duration: 'No especificado', language: 'es',
      price: 'No especificado', rating: 0, reviews: 0, students: 0, description: course.snippet || 'Sin descripción',
      requirements: [], learningOutcomes: [], syllabus: [],
      imageUrl: course.pagemap?.cse_image?.[0]?.src || '', url: course.link,
      certificate: false, lastUpdated: new Date().toISOString(), location: '', mode: 'online',
    };
  }
  if (course.name && course.url && course.snippet) {
    return {
      id: course.id || course.url, title: course.name, provider: course.displayUrl || 'Bing Search',
      category: 'No especificado', level: 'No especificado', duration: 'No especificado', language: 'es',
      price: 'No especificado', rating: 0, reviews: 0, students: 0, description: course.snippet || 'Sin descripción',
      requirements: [], learningOutcomes: [], syllabus: [],
      imageUrl: course.image?.thumbnailUrl || '', url: course.url,
      certificate: false, lastUpdated: course.dateLastCrawled || new Date().toISOString(), location: '', mode: 'online',
    };
  }
  if (course.title && course.link && course.description) {
    return {
      id: course.link, title: course.title, provider: course.source || 'Blog Educativo',
      category: course.category || 'No especificado', level: 'No especificado', duration: 'No especificado',
      language: 'es', price: 'No especificado', rating: 0, reviews: 0, students: 0,
      description: stripHtml(course.description) || 'Sin descripción',
      requirements: [], learningOutcomes: [], syllabus: [], imageUrl: '', url: course.link,
      certificate: false, lastUpdated: course.pubDate || new Date().toISOString(), location: '', mode: 'online',
    };
  }
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
    certificate: course.certificate || course.has_certificate || false,
    lastUpdated: course.last_updated || course.updated_at || new Date().toISOString(),
    location: course.location || course.country || course.city || '',
    mode: course.mode || course.delivery_mode || (course.is_online !== undefined ? (course.is_online ? 'online' : 'presencial') : 'no especificado'),
  };
};
