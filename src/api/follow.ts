import { axiosInstance } from "./axiosInstance";

const follow = async (userId: string) => {
  try {
    const response = await axiosInstance.post("/follow/create", {
      userId,
    });
    return response.data;
  } catch (error) {
    console.error("팔로우 실패", error);
  }
};

const unfollow = async (userId: string) => {
  try {
    const response = await axiosInstance.delete("/follow/delete", {
      data: {
        id: userId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("언팔로우 실패", error);
  }
};

export { follow, unfollow };
