import axios from 'axios';

// Configura la URL donde corre tu servidor de Spring Boot
const API_URL = 'http://localhost:8080/api'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Antes de hacer cualquier petición, si hay un token en el localStorage, lo añade
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // MENSAJE DE CONTROL EN CONSOLA:
    console.log(`[Axios] Petición enviada a: ${config.url}. Token encontrado:`, token);

    if (token && !config.url.includes('/auth')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
