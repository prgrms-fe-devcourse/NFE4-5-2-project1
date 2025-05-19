import { axiosInstance } from "../axiosInstance";

export const getPostsByUser = async (authorId: string) => {
  const res = await axiosInstance.get(`/posts/author/${authorId}`);
  return res.data;
};
