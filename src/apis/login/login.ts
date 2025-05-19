import { axiosInstance } from "../axiosInstance";

/**
 * @param name            사용자 이름
 * @param email           사용자 이메일
 * @param password        사용자 비밀번호
 * @param favoriteGenre   좋아하는 장르
 * @param favoriteArtist  좋아하는 아티스트
 * @returns               서버 응답 데이터
 */
export const signupUser = async (
  name: string,
  email: string,
  password: string,
  favoriteGenre: string,
  favoriteArtist?: string
) => {
  try {
    const customData = JSON.stringify({
      name,
      favoriteGenre,
      favoriteArtist,
    });

    const res = await axiosInstance.post("/signup", {
      fullName: customData,
      email,
      password,
    });

    return res.data;
  } catch (error) {
    console.error("회원가입 실패:", error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const res = await axiosInstance.post("/login", {
      email,
      password,
    });

    return res.data;
  } catch (error) {
    console.error("로그인 실패:", error);
    throw error;
  }
};
