import { axiosInstance } from "./axios";

export const getUsers = async () => {
	const { data } = await axiosInstance.get("/users/get-users");
	return data;
};

export const getOnlineUsers = async () => {
	const { data } = await axiosInstance.get("/users/online-users");
	return data;
};

export const getUserInfo = async (id: string) => {
	const { data } = await axiosInstance.get(`/users/${id}`);
	return data;
};

export const uploadPhoto = async (image: File) => {
	const formData = new FormData();
	formData.append("isCover", "false");
	formData.append("image", image);

	const { data } = await axiosInstance.post("/users/upload-photo", formData, {
		headers: { "Content-Type": "multipart/form-data" }
	});
	return data;
};

export const deletePhoto = async (isCover: boolean) => {
	const { data } = await axiosInstance.post("/users/delete-photo", {
		isCover
	});
	return data;
};

export const updateUserPwd = async (newPwd: string) => {
	const { data } = await axiosInstance.put("/settings/update-password", {
		password: newPwd
	});
	return data;
};

// userSearch
export const searchUsers = async (query: string) => {
	const encoded = encodeURIComponent(query);
	const { data } = await axiosInstance.get(`/search/users/${encoded}`);
	return data as UserData[];
};

// export const updateUserInfo = async ({ profile }: UpdatedUserData) => {
// 	const userInfo: { fullName?: string; username?: string } = {};
// 	if (profile) {
// 		userInfo.fullName = JSON.stringify(profile);
// 	}

// 	const { data } = await axiosInstance.put("/settings/update-user", userInfo);
// 	return data;
// };
