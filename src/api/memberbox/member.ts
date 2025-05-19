import { axiosInstance } from '../axios';

export const getAllUsersData = () => {
  return axiosInstance.get<User[]>(`/users/get-users`);
};
