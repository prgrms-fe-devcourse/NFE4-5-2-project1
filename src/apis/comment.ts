import { axiosInstance } from "./axios";

export const createComment = async (postId: string, comment: string) => {
	const { data } = await axiosInstance.post("/comments/create", {
		postId,
		comment
	});
	return data;
};

export const deleteComment = async (commentId: string) => {
	const { data } = await axiosInstance.delete("/comments/delete", {
		data: { id: commentId }
	});
	return data;
};
