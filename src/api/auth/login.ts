import { axiosInstance } from '../../api/axios';

export const login = (email: string, password: string) => {
  return axiosInstance.post('/login', {
    email,
    password,
  });
};
