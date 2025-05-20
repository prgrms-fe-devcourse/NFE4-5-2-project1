import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL:
    window.location.hostname === 'localhost'
      ? 'http://13.125.208.179:5010'
      : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 보낼 때 자동으로 JWT 토큰 붙이기
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); // 저장된 토큰 불러오기
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: toast로 에러 메시지 띄우기
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const msg = err.response?.data || err.message;

    // 회원탈퇴 요청은 401 토스트 띄우지 않음
    if (
      err.response?.status === 401 &&
      err.config?.url !== '/users/delete-user'
    ) {
      toast.error('로그인 후 이용해주세요');
    } else if (status >= 500) {
      console.log('서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } else if (status === 400) {
      console.log(`잘못된 요청입니다: ${msg}`);
    } else {
      console.log(`에러가 발생했습니다: ${msg}`);
    }

    return Promise.reject(err);
  },
);

export default api;
