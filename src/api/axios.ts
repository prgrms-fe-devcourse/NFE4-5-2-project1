import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'react-toastify';

// Axios 인스턴스 생성
export const axiosInstance = axios.create({
  baseURL:
    window.location.hostname === 'localhost'
      ? 'http://13.125.208.179:5001'
      : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    // 상태에서 토큰 가져오기
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (e) => {
    return Promise.reject(e);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (res) => res,
  async (e) => {
    if (e.response?.status === 403) {
      console.error('403 에러 발생: 토큰 만료 또는 권한 없음');
      // 자동 로그아웃 처리
      useAuthStore.getState().logout();
      // 로그인전 유저에게 알려주기
      toast('세션이 만료되어 다시 로그인해주세요.');
      // 로그인 페이지로 이동
      window.location.href = '/login';
    }

    return Promise.reject(e);
  }
);
