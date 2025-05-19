import axios from "axios";
import { userStore } from "../stores/userStore";

const baseURL = import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
  baseURL: window.location.hostname === "localhost" ? baseURL : "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = userStore.getState().getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const axiosFileInstance = axios.create({
  baseURL: window.location.hostname === "localhost" ? baseURL : "/api",
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

axiosFileInstance.interceptors.request.use((config) => {
  const token = userStore.getState().getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
