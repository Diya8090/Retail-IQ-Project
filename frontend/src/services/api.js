import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

/**
 * Pre-configured Axios client for RetailIQ.
 * When real NestJS backend is connected, requests will route through this client.
 * Handles Bearer token attachment and response interceptors.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT auth token once backend authentication is enabled
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('retailiq_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Auto-logout if token is expired in future backend
      localStorage.removeItem('retailiq_token');
      localStorage.removeItem('retailiq_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
