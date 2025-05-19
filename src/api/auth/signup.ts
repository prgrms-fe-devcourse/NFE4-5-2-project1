import { axiosInstance } from '../../api/axios';

export const signup = (fullName: string, email: string, password: string) => {
  return axiosInstance.post('/signup', {
    fullName,
    email,
    password,
  });
};
