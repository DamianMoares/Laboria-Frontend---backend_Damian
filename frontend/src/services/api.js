import API_URL from '../config/api';
import toast from 'react-hot-toast';

const BASE_URL = `${API_URL}/api`;
let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach(cb => cb(newToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (cb) => {
  refreshSubscribers.push(cb);
};

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return null;
  try {
    const response = await fetch(`${BASE_URL}/users/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    if (!response.ok) return null;
    const data = await response.json();
    localStorage.setItem('token', data.token);
    if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
    return data.token;
  } catch {
    return null;
  }
};

const handleResponse = async (response, endpoint, options) => {
  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData?.error) message = errorData.error;
      else if (errorData?.message) message = errorData.message;
    } catch (e) {}

    if (response.status === 401 && localStorage.getItem('refreshToken')) {
      if (!isRefreshing) {
        isRefreshing = true;
        const newToken = await refreshAccessToken();
        isRefreshing = false;
        if (newToken) {
          onRefreshed(newToken);
          return request(endpoint, options, true);
        }
      } else {
        return new Promise(resolve => {
          addRefreshSubscriber((token) => {
            resolve(request(endpoint, options, true));
          });
        });
      }
    }

    if (response.status === 401 && localStorage.getItem('token')) {
      toast.error('Sesión expirada. Redirigiendo al inicio de sesión...');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setTimeout(() => { window.location.href = '/login'; }, 2000);
    }

    throw new Error(message);
  }
  return { data: await response.json() };
};

const request = async (endpoint, options = {}, isRetry = false) => {
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
  return handleResponse(response, endpoint, options);
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
