import { axiosInstance } from '../axios';

export const getUserData = (userId: string) => {
  return axiosInstance.get<User>(`/users/${userId}`);
};
