import { axiosInstance } from "../axiosInstance";

export const getUserDetail = async (userId: string) => {
  try {
    const res = await axiosInstance.get(`/users/${userId}`);
    return res.data;
  } catch (error) {
    console.error("유저 상세 정보 가져오기 실패:", error);
    return null;
  }
};
