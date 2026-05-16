import api from './api';

export const courseApplicationService = {
  apply: async (courseId, message) => {
    const response = await api.post('/course-applications', { courseId, message });
    return response.data;
  },

  getMyApplications: async () => {
    const response = await api.get('/course-applications/my');
    return response.data;
  },

  cancel: async (id) => {
    const response = await api.delete(`/course-applications/${id}`);
    return response.data;
  }
};
