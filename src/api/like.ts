import { axiosInstance } from "./axiosInstance";

const createLike = async (postId: string) => {
  try {
    const response = await axiosInstance.post("/likes/create", {
      postId,
    });
    return response.data;
  } catch (error) {
    console.error("좋아요 생성 실패", error);
  }
};

const deleteLike = async (likeId: string) => {
  try {
    const response = await axiosInstance.delete("/likes/delete", {
      data: {
        id: likeId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("좋아요 삭제 실패", error);
  }
};

export { createLike, deleteLike };
