import api from './api';

export const applicationService = {
  // Crear aplicación (requiere auth - candidato)
  create: async (applicationData) => {
    const response = await api.post('/applications', applicationData);
    return response.data;
  },

  // Mis aplicaciones (requiere auth - candidato)
  getMyApplications: async () => {
    const response = await api.get('/applications/my');
    return response.data;
  },

  // Aplicaciones a un empleo (requiere auth - empresa)
  getJobApplications: async (jobId) => {
    const response = await api.get(`/applications/job/${jobId}`);
    return response.data;
  },

  // Actualizar estado (requiere auth - empresa)
  updateStatus: async (id, status) => {
    const response = await api.put(`/applications/${id}/status`, { status });
    return response.data;
  },

  // Cancelar aplicación (requiere auth - candidato)
  cancel: async (id) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  }
};
