import { axiosInstance } from "./axios";

export const getChannels = async () => {
	const { data } = await axiosInstance.get("/channels");
	return data;
};

export const getChannelInfo = async (name: string) => {
	const { data } = await axiosInstance.get(`/channels/${name}`);
	return data;
};

export const createChannel = async (
	role: string,
	description: string,
	name: string
) => {
	if (role !== "SuperAdmin") {
		throw Error("Not Authorized");
	}
	const { data } = await axiosInstance.post("/channels/create", {
		authRequired: true,
		description,
		name
	});
	return data;
};

export const deleteChannel = async (id: string) => {
	const { data } = await axiosInstance.delete("/channels/delete", {
		data: { id }
	});
	return data;
};
