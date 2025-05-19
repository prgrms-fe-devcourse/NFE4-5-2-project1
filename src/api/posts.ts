import { axiosInstance, axiosFileInstance } from "./axiosInstance";
import { useChannelStore } from "../stores/channelStore";

type Channel = {
  _id: string;
  name: string;
};

const getChannel = async () => {
  try {
    const response = await axiosInstance.get(`/channels`);
    response.data.forEach((channel: Channel) => {
      useChannelStore.getState().setChannel(channel._id, channel.name);
    });
    return response.data;
  } catch (error) {
    console.error("채널 정보 불러오기 실패", error);
  }
};

const setComments = async (formData: { comment: string; postId: string }) => {
  try {
    const response = await axiosInstance.post("/comments/create", formData);
    return response.data;
  } catch (error) {
    console.error("댓글 생성 실패", error);
  }
};

const deleteComments = async (commentId: string) => {
  try {
    const response = await axiosInstance.delete("/comments/delete", {
      data: {
        id: commentId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("댓글 삭제 실패", error);
  }
};

const getAuthorPosts = async (authorId: string) => {
  try {
    const response = await axiosInstance.get(`/posts/author/${authorId}`);
    return response.data;
  } catch (error) {
    console.error("게시글 목록 불러오기 실패", error);
  }
};

const getPosts = async (postId: string) => {
  try {
    const response = await axiosInstance.get(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error("게시글 목록 불러오기 실패", error);
  }
};

const createPost = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post("/posts/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("게시글 생성 실패", error);
  }
};

const deletePost = async (postId: string) => {
  try {
    const response = await axiosInstance.delete("/posts/delete", {
      data: { id: postId },
    });
    return response.data;
  } catch (error) {
    console.error("게시글 삭제 실패", error);
  }
};

const getChannelPosts = async (channelId: string, limit = 0, offset = 0) => {
  try {
    let url = `/posts/channel/${channelId}`;
    if (limit !== 0 || offset !== 0) {
      url += `?limit=${limit}&offset=${offset}`;
    }
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("채널 게시글 목록 불러오기 실패", error);
  }
};

const updatePost = async (formData: FormData) => {
  try {
    const response = await axiosFileInstance.put("/posts/update", formData);
    return response.data;
  } catch (error) {
    console.error("게시글 수정 실패", error);
  }
};

export {
  setComments,
  getPosts,
  deleteComments,
  getChannelPosts,
  deletePost,
  createPost,
  getAuthorPosts,
  getChannel,
  updatePost,
};
