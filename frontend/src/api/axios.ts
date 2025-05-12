// src/api/axios.ts
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000', // заменишь при необходимости
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Можно добавить автоматический выход
      console.warn('Unauthorized');
    }
    return Promise.reject(err);
  }
);

export default instance;
