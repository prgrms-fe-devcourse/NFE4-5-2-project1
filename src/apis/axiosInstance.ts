import axios from "axios";

import { useAuthStore } from "../stores/authStore";
import { getLoginStorage } from "./login/getLoginStorage";

export const axiosInstance = axios.create({
  baseURL:
    window.location.hostname === "localhost"
      ? import.meta.env.VITE_PROGRAMMERS
      : "/api",
  withCredentials: false,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getLoginStorage();

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

let retry = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 403 && !retry) {
      retry = true;
      try {
        const { data } = await axiosInstance.post("/token");
        useAuthStore.setState({
          accessToken: data.accessToken,
          isLoggedIn: true,
        });
        retry = false;
        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (error) {
        console.error(error);
      }
    }
    if (error.response?.status === 400) {
      console.error("Bad Request: 잘못된 요청입니다.");
    }
    if (error.response?.status === 401) {
      console.error("Unathorized: 로그인이 필요합니다.");
    }
    if (error.response?.status === 404) {
      console.error("Not Found: 요청한 리소스를 찾을 수 없습니다.");
    }
    if (error.response?.status === 500) {
      console.error("Network Error: 네트워크 에러");
    }
    return Promise.reject(error);
  }
);
