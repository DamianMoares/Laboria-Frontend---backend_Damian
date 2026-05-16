import api from './api';

export const curriculumService = {
  get: async () => {
    const response = await api.get('/users/curriculum');
    return response.data;
  },

  save: async (data) => {
    const response = await api.put('/users/curriculum', { data });
    return response.data;
  }
};
