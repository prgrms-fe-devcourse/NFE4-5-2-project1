export const parseUserName = (fullName: string) => {
  try {
    return JSON.parse(fullName);
  } catch (e) {
    console.error("JSON 파싱 실패", e);
    return { name: "", favoriteGenre: "", favoriteArtist: "" };
  }
};
