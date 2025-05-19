import { axiosInstance } from '../axios';

export const postFollow = (userId: string) => {
  return axiosInstance.post<Follow>('/follow/create', { userId });
};

export const postUnfollow = (followId: string) => {
  return axiosInstance.delete<Follow>('/follow/delete', {
    data: { id: followId },
  });
};
