import { axiosInstance } from "./axiosInstance";
import { userStore } from "../stores/userStore";

interface SignUpFormData {
  email: string;
  fullName: string;
  username: string;
  password: string;
}

const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axiosInstance.post("/login", {
      email,
      password,
    });

    if (response.status === 200) {
      userStore.getState().setToken(response.data.token);
      userStore.getState().setUser(response.data.user);
      return response.data;
    } else {
      throw new Error("로그인 실패");
    }
  } catch (error) {
    console.log(error);
  }
};

const logout = async () => {
  try {
    const response = await axiosInstance.post("/logout");
    if (response.status === 200) {
      userStore.getState().logout();
      return response.data;
    } else {
      throw new Error("로그아웃 실패");
    }
  } catch (error) {
    console.log(error);
  }
};

const checkLogin = async () => {
  try {
    const response = await axiosInstance.get("/auth-user");
    if (response.status === 200) {
      userStore.getState().setUser(response.data);
      return response.data;
    } else {
      await logout();
      throw new Error("로그인 상태가 아닙니다.");
    }
  } catch (error) {
    console.log(error);
  }
};

const signUp = async (formData: SignUpFormData) => {
  const response = await axiosInstance.post("/signup", formData);
  return response;
};

export { signUp, login, logout, checkLogin };
