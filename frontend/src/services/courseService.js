import api from './api';

export const courseService = {
  // Listar cursos (público)
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/courses?${params}`);
    return response.data;
  },

  // Detalle de curso (público)
  getById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  // Crear curso (requiere auth - empresa)
  create: async (courseData) => {
    const response = await api.post('/courses', courseData);
    return response.data;
  },

  // Actualizar curso (requiere auth - autor)
  update: async (id, courseData) => {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
  },

  // Eliminar curso (requiere auth - autor/admin)
  delete: async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  }
};
