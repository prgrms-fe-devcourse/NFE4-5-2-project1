interface ParsedPost {
  postTitle: string;
  postContent: string;
}

// 제목, 내용
export const safeParsePost = (rawTitle: string): ParsedPost => {
  try {
    const parsed = JSON.parse(rawTitle);
    return {
      postTitle: parsed?.[0]?.postTitle ?? "",
      postContent: parsed?.[0]?.postContent ?? "",
    };
  } catch (e) {
    console.error("post 파싱 실패:", e);
    return {
      postTitle: "",
      postContent: "",
    };
  }
};
