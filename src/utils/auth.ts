import { getUserInfo } from "../apis/playlist/userService";

export const getCurrentUserId = async () => {
  try {
    const data = await getUserInfo();
    return data._id;
  } catch (error) {
    console.error(error);
    return null;
  }
};
