import { axiosInstance } from "./axiosInstance";

const searchAll = async (keyword: string) => {
  try {
    const response = await axiosInstance.get(`/search/all/${keyword}`);
    return response.data;
  } catch (error) {
    console.error("검색 실패", error);
  }
};

const searchUsers = async (keyword: string) => {
  try {
    const response = await axiosInstance.get(`/search/users/${keyword}`);
    return response.data;
  } catch (error) {
    console.error("유저 검색 실패", error);
  }
};

export { searchAll, searchUsers };
