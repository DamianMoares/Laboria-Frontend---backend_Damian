import api from './api';

export const externalCourseService = {
  getSources: async () => {
    const response = await api.get('/scraper/sources');
    return response.data;
  },

  runAll: async () => {
    const response = await api.post('/scraper/run-all');
    return response.data;
  },

  runSource: async (sourceName) => {
    const response = await api.post(`/scraper/run/${encodeURIComponent(sourceName)}`);
    return response.data;
  },

  getCourses: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.source) params.append('source', filters.source);
    if (filters.category) params.append('category', filters.category);
    if (filters.priceType) params.append('priceType', filters.priceType);
    if (filters.search) params.append('search', filters.search);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset) params.append('offset', filters.offset);
    const response = await api.get(`/scraper/courses?${params.toString()}`);
    return response.data;
  }
};
