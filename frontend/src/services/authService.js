import API_URL from '../config/api';

const BASE_URL = `${API_URL}/api`;

// Helper para hacer requests con auth
const fetchWithAuth = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  };
  
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }
  
  const response = await fetch(url, config);
  
  if (!response.ok) {
    // Intentar obtener mensaje de error del servidor
    let errorMessage = `Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.error) {
        errorMessage = errorData.error;
      } else if (errorData && errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (e) {
      // Si no se puede parsear JSON, usar el statusText
    }
    const error = new Error(errorMessage);
    error.response = response;
    throw error;
  }
  
  return response.json();
};

export const authService = {
  // Registro
  register: async (userData) => {
    return fetchWithAuth('/users/register', {
      method: 'POST',
      body: userData
    });
  },

  // Login
  login: async (credentials) => {
    const data = await fetchWithAuth('/users/login', {
      method: 'POST',
      body: credentials
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obtener perfil
  getProfile: async () => {
    return fetchWithAuth('/users/profile/me');
  },

  // Actualizar perfil
  updateProfile: async (profileData) => {
    const data = await fetchWithAuth('/users/profile/me', {
      method: 'PUT',
      body: profileData
    });
    // Actualizar usuario en localStorage
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default fetchWithAuth;
