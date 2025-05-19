import { axiosInstance, axiosFileInstance } from "./axiosInstance";

const getUser = async (id: string) => {
  try {
    const response = await axiosInstance.get(`users/${id}`);
    return response.data;
  } catch (error) {
    console.error("유저 정보 불러오기 실패", error);
  }
};

const deleteUserImage = async (formData: FormData) => {
  try {
    const response = await axiosFileInstance.delete("/users/delete-photo", {
      data: formData,
    });
    return response.data;
  } catch (error) {
    console.error("유저 이미지 삭제 실패", error);
  }
};

const updateUserImage = async (formData: FormData) => {
  try {
    const response = await axiosFileInstance.post(
      "/users/upload-photo",
      formData
    );
    return response.data;
  } catch (error) {
    console.error("유저 이미지 업데이트 실패", error);
  }
};

const updateUserInfo = async (fullName: string, username: string) => {
  try {
    const response = await axiosInstance.put("settings/update-user", {
      fullName,
      username,
    });
    return response;
  } catch (error) {
    console.error("유저 정보 업데이트 실패", error);
  }
};

const updateUserPassword = async (password: string) => {
  try {
    const response = await axiosInstance.put("settings/update-password", {
      password,
    });
    return response;
  } catch (error) {
    console.error("유저 정보 업데이트 실패", error);
  }
};

const getUserInfo = async () => {
  try {
    const response = await axiosInstance.get("/users/get-users");
    return response.data;
  } catch (error) {
    console.error("유저 정보 불러오기 실패", error);
  }
};

export {
  getUser,
  deleteUserImage,
  updateUserImage,
  updateUserInfo,
  updateUserPassword,
  getUserInfo,
};
