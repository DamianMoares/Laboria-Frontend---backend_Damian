import API_URL from '../config/api';
import toast from 'react-hot-toast';

const BASE_URL = `${API_URL}/api`;

const handleResponse = async (response) => {
  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData?.error) message = errorData.error;
      else if (errorData?.message) message = errorData.message;
    } catch (e) {}

    if (response.status === 401 && localStorage.getItem('token')) {
      toast.error('Sesión expirada. Redirigiendo al inicio de sesión...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setTimeout(() => { window.location.href = '/login'; }, 2000);
    }

    throw new Error(message);
  }
  return { data: await response.json() };
};

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const { headers: extraHeaders, ...fetchOptions } = options;
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...extraHeaders
    },
    ...fetchOptions
  });
  return handleResponse(response);
};

const api = {
  get: async (endpoint) => request(endpoint),

  post: async (endpoint, body) =>
    request(endpoint, { method: 'POST', body: JSON.stringify(body) }),

  put: async (endpoint, body) =>
    request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),

  delete: async (endpoint) =>
    request(endpoint, { method: 'DELETE' })
};

export default api;