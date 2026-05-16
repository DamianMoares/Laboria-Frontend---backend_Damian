import api from './api';

/**
 * Servicio para funcionalidades de administración
 * Todas las rutas requieren autenticación y rol ADMIN
 */

export const adminService = {
  // ==========================================
  // DASHBOARD - Estadísticas
  // ==========================================
  
  /**
   * Obtener estadísticas del dashboard
   * @returns {Promise<Object>} Estadísticas del sistema
   */
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // ==========================================
  // GESTIÓN DE USUARIOS
  // ==========================================
  
  /**
   * Listar todos los usuarios
   * @param {Object} params - Filtros y paginación
   * @returns {Promise<Object>} Lista de usuarios con paginación
   */
  getAllUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/admin/users?${queryString}`);
    return response.data;
  },

  /**
   * Obtener detalles de un usuario específico
   * @param {string} id - ID del usuario
   * @returns {Promise<Object>} Detalles del usuario
   */
  getUserDetails: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  /**
   * Actualizar rol de usuario
   * @param {string} id - ID del usuario
   * @param {string} role - Nuevo rol
   * @returns {Promise<Object>} Usuario actualizado
   */
  updateUserRole: async (id, role) => {
    const response = await api.put(`/admin/users/${id}/role`, { role });
    return response.data;
  },

  /**
   * Eliminar usuario
   * @param {string} id - ID del usuario
   * @returns {Promise<Object>} Confirmación
   */
  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // ==========================================
  // GESTIÓN DE EMPLEOS
  // ==========================================
  
  /**
   * Listar todos los empleos
   * @param {Object} params - Filtros y paginación
   * @returns {Promise<Object>} Lista de empleos con paginación
   */
  getAllJobs: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/admin/jobs?${queryString}`);
    return response.data;
  },

  /**
   * Actualizar cualquier empleo como admin
   * @param {string} id - ID del empleo
   * @param {Object} jobData - Datos a actualizar
   * @returns {Promise<Object>} Empleo actualizado
   */
  updateJob: async (id, jobData) => {
    const response = await api.put(`/admin/jobs/${id}`, jobData);
    return response.data;
  },

  /**
   * Eliminar cualquier empleo como admin
   * @param {string} id - ID del empleo
   * @returns {Promise<Object>} Confirmación
   */
  deleteJob: async (id) => {
    const response = await api.delete(`/admin/jobs/${id}`);
    return response.data;
  },

  // ==========================================
  // GESTIÓN DE CURSOS
  // ==========================================
  
  /**
   * Listar todos los cursos
   * @param {Object} params - Filtros y paginación
   * @returns {Promise<Object>} Lista de cursos con paginación
   */
  getAllCourses: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/admin/courses?${queryString}`);
    return response.data;
  },

  /**
   * Actualizar cualquier curso como admin
   * @param {string} id - ID del curso
   * @param {Object} courseData - Datos a actualizar
   * @returns {Promise<Object>} Curso actualizado
   */
  updateCourse: async (id, courseData) => {
    const response = await api.put(`/admin/courses/${id}`, courseData);
    return response.data;
  },

  /**
   * Eliminar cualquier curso como admin
   * @param {string} id - ID del curso
   * @returns {Promise<Object>} Confirmación
   */
  deleteCourse: async (id) => {
    const response = await api.delete(`/admin/courses/${id}`);
    return response.data;
  },

  // ==========================================
  // GESTIÓN DE APLICACIONES
  // ==========================================
  
  /**
   * Listar todas las aplicaciones
   * @param {Object} params - Filtros y paginación
   * @returns {Promise<Object>} Lista de aplicaciones con paginación
   */
  getAllApplications: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/admin/applications?${queryString}`);
    return response.data;
  },

  /**
   * Actualizar estado de cualquier aplicación como admin
   * @param {string} id - ID de la aplicación
   * @param {string} status - Nuevo estado
   * @returns {Promise<Object>} Aplicación actualizada
   */
  updateApplicationStatus: async (id, status) => {
    const response = await api.put(`/admin/applications/${id}/status`, { status });
    return response.data;
  }
};
