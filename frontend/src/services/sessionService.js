import api from './api';

export const sessionService = {
  getStats: async () => {
    const response = await api.get('/users/session-stats');
    return response.data;
  },

  logout: async () => {
    await api.post('/users/logout');
  }
};
