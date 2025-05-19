import { axiosInstance } from "./axios";

export const getMessageList = async (userId: string) => {
	const { data } = await axiosInstance.get("/messages", {
		params: { userId }
	});
	return data;
};

export const createMessage = async (message: string, receiver: string) => {
	const { data } = await axiosInstance.post("/messages/create", {
		message,
		receiver
	});
	return data;
};

export const getConversations = async () => {
	const { data } = await axiosInstance.get("/messages/conversations");
	return data;
};

export const readMessage = async (sender: string) => {
	axiosInstance.put("/messages/update-seen", {
		sender
	});
};
