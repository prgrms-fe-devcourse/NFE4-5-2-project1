import { axiosInstance } from "./axios";

export const createLike = async (postId: string) => {
	const { data } = await axiosInstance.post("/likes/create", {
		postId
	});
	return data;
};

export const deleteLike = async (likeId: string) => {
	const { data } = await axiosInstance.delete("/likes/delete", {
		data: { id: likeId }
	});
	return data;
};
