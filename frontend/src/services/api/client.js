import axios from 'axios';
import { config } from '../../app/config/env';

const API_BASE_URL =
  config?.API_BASE_URL ??
  import.meta?.env?.VITE_API_URL ??
  'http://localhost:8080';

const TOKEN_KEY = 'token';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (cfg) => {
    const url = cfg.url || '';
    const isAuthRoute = url.startsWith('/auth/');
    if (isAuthRoute) {
      // login/register isteklerinde Authorization gönderme
      if (cfg.headers?.Authorization) delete cfg.headers.Authorization;
      return cfg;
    }
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem(TOKEN_KEY);
      // auth sayfasında değilsek login'e yönlendir
      if (!location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default apiClient;