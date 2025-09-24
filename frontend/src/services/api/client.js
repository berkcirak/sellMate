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
  (res) => {
    // Image URL'lerini tam URL'ye çevir
    if (res.data?.data) {
      const normalizeImageUrls = (obj) => {
        if (!obj || typeof obj !== 'object') return obj;

        // Kök nesne user ise veya herhangi bir objede profileImage varsa
        if (obj.profileImage && typeof obj.profileImage === 'string' && obj.profileImage.startsWith('/uploads/')) {
          obj.profileImage = `${API_BASE_URL}${obj.profileImage}`;
        }

        // Post görselleri
        if (Array.isArray(obj.imageUrls)) {
          obj.imageUrls = obj.imageUrls.map((url) =>
            typeof url === 'string' && url.startsWith('/uploads/') ? `${API_BASE_URL}${url}` : url
          );
        }
        // Post içindeki user
        if (obj.user?.profileImage && obj.user.profileImage.startsWith('/uploads/')) {
          obj.user.profileImage = `${API_BASE_URL}${obj.user.profileImage}`;
        }
        return obj;
      };

      if (Array.isArray(res.data.data)) {
        res.data.data = res.data.data.map(normalizeImageUrls);
      } else {
        res.data.data = normalizeImageUrls(res.data.data);
      }
    }
    return res;
  },
  (err) => {
    const status = err?.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem(TOKEN_KEY);
      if (!location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);


export default apiClient;