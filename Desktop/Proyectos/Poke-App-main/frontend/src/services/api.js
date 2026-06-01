import axios from 'axios';

// Instancia central de axios para nuestro backend.
export const API_URL = 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL });

// Inyecta automáticamente el token JWT (si existe) en cada petición.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pokeapp_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
