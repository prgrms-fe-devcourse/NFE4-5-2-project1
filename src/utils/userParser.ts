import { isJSONString } from "./stringUtils";

export interface ParsedUser {
  id: string;
  fullName: string;
  isOnline: boolean;
  favoriteArtist?: string;
}

export const parseUser = (user: UserType): ParsedUser => {
  if (isJSONString(user.fullName)) {
    const parsedData = JSON.parse(user.fullName);
    return {
      id: user._id,
      fullName: parsedData.name,
      isOnline: user.isOnline,
      favoriteArtist: parsedData.favoriteArtist,
    };
  }

  return {
    id: user._id,
    fullName: user.fullName,
    isOnline: user.isOnline,
  };
};
