export const parseBopTitle = (title: string) => {
  try {
    return JSON.parse(title);
  } catch (e) {
    console.error("JSON 파싱 실패", e);
    return { track: "", genre: "", text: "" };
  }
};
