import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/users/logout');
    } catch {
      // si falla la API, igual limpiamos localStorage
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    const response = await api.get('/users/profile/me');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile/me', profileData);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  deleteAccount: async () => {
    const response = await api.delete('/users/account');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/users/change-password', { currentPassword, newPassword });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/users/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, password) => {
    const response = await api.post('/users/reset-password', { token, password });
    return response.data;
  },

  isAuthenticated: () => !!localStorage.getItem('token'),

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};