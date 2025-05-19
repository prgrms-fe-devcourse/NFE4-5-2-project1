import { axiosInstance } from "../apis/axiosInstance";

interface CreatePostParams {
  title: object;
  channelId: string;
  image?: File;
}

interface UpdatePostParams {
  postId: string;
  title: object;
  image?: File;
  imageToDeletePublicId?: string;
  channelId: string;
}

export const createPost = async ({
  title,
  channelId,
  image,
}: CreatePostParams) => {
  const formData = new FormData();
  formData.append("title", JSON.stringify(title));
  formData.append("channelId", channelId);
  if (image) {
    formData.append("image", image);
  }

  try {
    const res = await axiosInstance.post("/posts/create", formData);
    return res;
  } catch (e) {
    console.error("게시물 생성 실패 : ", e);
    throw e;
  }
};

export const getPost = async (postId: string) => {
  try {
    const res = await axiosInstance.get(`/posts/${postId}`);
    return res.data;
  } catch (e) {
    console.error("게시물 가져오기 실패 : ", e);
    throw e;
  }
};

export const deletePost = async (postId: string) => {
  try {
    await axiosInstance.delete(`/posts/delete`, {
      data: { id: postId },
    });
  } catch (e) {
    console.error("게시물 삭제 실패:", e);
  }
};

export const updatePost = async ({
  postId,
  title,
  image,
  imageToDeletePublicId,
  channelId,
}: UpdatePostParams) => {
  const formData = new FormData();
  formData.append("postId", postId);
  formData.append("title", JSON.stringify(title));
  formData.append("channelId", channelId);
  if (image) {
    formData.append("image", image);
  }
  if (imageToDeletePublicId) {
    formData.append("imageToDeletePublicId", imageToDeletePublicId);
  }

  try {
    const res = await axiosInstance.put("/posts/update", formData);
    return res;
  } catch (e) {
    console.error("게시물 수정 실패 : ", e);
    throw e;
  }
};
