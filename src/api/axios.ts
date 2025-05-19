import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

export const axiosInstance = axios.create({
  baseURL:
    window.location.hostname === 'localhost'
      ? import.meta.env.VITE_API_URL
      : '/api',
});

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    return Promise.reject(error);
  }
);
