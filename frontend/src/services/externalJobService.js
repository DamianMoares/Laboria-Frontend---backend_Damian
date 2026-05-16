import api from './api';

export const externalJobService = {
  getSources: async () => {
    const response = await api.get('/job-scraper/sources');
    return response.data;
  },

  runAll: async () => {
    const response = await api.post('/job-scraper/run-all');
    return response.data;
  },

  runSource: async (sourceName) => {
    const response = await api.post(`/job-scraper/run/${encodeURIComponent(sourceName)}`);
    return response.data;
  },

  getJobs: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.source) params.append('source', filters.source);
    if (filters.category) params.append('category', filters.category);
    if (filters.contractType) params.append('contractType', filters.contractType);
    if (filters.workMode) params.append('workMode', filters.workMode);
    if (filters.location) params.append('location', filters.location);
    if (filters.search) params.append('search', filters.search);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset) params.append('offset', filters.offset);
    const response = await api.get(`/job-scraper/jobs?${params.toString()}`);
    return response.data;
  }
};
