import { axiosInstance } from "../axiosInstance";

export const myPageUserInfo = async () => {
  const res = await axiosInstance.get("/auth-user");
  return res.data;
};

export const myPageUserInfoUpdate = async (
  name: string,
  favoriteGenre: string,
  favoriteArtist: string
) => {
  try {
    const customData = JSON.stringify({ name, favoriteGenre, favoriteArtist });
    const response = await axiosInstance.put("/settings/update-user", {
      fullName: customData,
      username: "",
    });
    return response.data;
  } catch (err) {
    console.error("유저 정보 수정 실패:", err);
  }
};

export const myPageUpdatePhoto = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("isCover", "false");
    formData.append("image", file);

    const res = await axiosInstance.post("/users/upload-photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error("프로필 이미지 업로드 실패:", error);
  }
};

export const logoutUser = async () => {
  try {
    await axiosInstance.post("/logout");
    localStorage.removeItem("app_state");
  } catch (err) {
    console.error("로그아웃 실패:", err);
  }
};

export const updateUserPassword = async (newPassword: string) => {
  try {
    const res = await axiosInstance.put("/settings/update-password", {
      password: newPassword,
    });
    return res.data;
  } catch (error) {
    console.error("비밀번호 변경 실패:", error);
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const res = await axiosInstance.delete("/users/delete-user", {
      data: { id: userId },
    });
    return res.data;
  } catch (err) {
    console.error("회원 탈퇴 실패:", err);
  }
};

export const myPageDeletePhoto = async () => {
  try {
    const res = await axiosInstance.delete("/users/delete-photo", {
      data: { isCover: false },
    });
    return res.data;
  } catch (err) {
    console.error("프로필 이미지 삭제 실패:", err);
  }
};
