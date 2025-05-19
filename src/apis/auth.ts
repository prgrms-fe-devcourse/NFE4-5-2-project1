import { axiosInstance } from "./axios";

export const registerUser = async (userInfo: UserInfo) => {
	const { email, fullName, password } = userInfo;
	const { data } = await axiosInstance.post("/signup", {
		email,
		fullName: JSON.stringify(fullName),
		password
	});
	return data.user;
};

export const loginUser = async (email: string, password: string) => {
	const { data } = await axiosInstance.post("/login", {
		email,
		password
	});
	return data;
};

export const logoutUser = async () => {
	const { data } = await axiosInstance.post("/logout");
	console.log(data);
};

export const fetchAuthUser = async () => {
	const { data } = await axiosInstance.get("/auth-user");
	return data;
};
