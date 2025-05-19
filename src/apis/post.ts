import { axiosInstance } from "./axios";

export const getPosts = async (channelId: string) => {
	const { data } = await axiosInstance.get(`/posts/channel/${channelId}`);
	return data;
};

export const getPostById = async (postId: string) => {
	const { data } = await axiosInstance.get(`/posts/${postId}`);
	return data;
};

export const getPostsByAuthor = async (AuthorId: string) => {
	const { data } = await axiosInstance.get(`/posts/author/${AuthorId}`);
	return data;
};

export const createPost = async (post: FormData) => {
	const { data } = await axiosInstance.post("/posts/create", post, {
		headers: {
			"Content-Type": "multipart/form-data"
		}
	});
	return data._id;
};

export const updatePost = async (post: FormData) => {
	await axiosInstance.put("/posts/update", post, {
		headers: {
			"Content-Type": "multipart/form-data"
		}
	});
};

export const deletePost = async (postId: string) => {
	await axiosInstance.delete("/posts/delete", {
		data: { id: postId }
	});
};
