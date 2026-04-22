import axios from 'axios';

const isProduction = import.meta.env.MODE === 'production';
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (isProduction ? '/api' : 'http://localhost:5000/api'),
  headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('mz_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('mz_token');
      localStorage.removeItem('mz_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;
