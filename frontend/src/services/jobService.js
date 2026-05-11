import api from './api';

export const jobService = {
  // Listar empleos (público)
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/jobs?${params}`);
    return response.data;
  },

  // Detalle de empleo (público)
  getById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  // Crear empleo (requiere auth - empresa)
  create: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  // Actualizar empleo (requiere auth - autor)
  update: async (id, jobData) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  // Eliminar empleo (requiere auth - autor/admin)
  delete: async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  }
};
