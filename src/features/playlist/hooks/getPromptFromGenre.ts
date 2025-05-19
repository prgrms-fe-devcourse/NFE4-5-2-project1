export const getPromptFromGenre = (genre?: string): string => {
  if (!genre) {
    throw new Error("추천 실패");
  }

  return `
    사용자가 ${genre} 장르를 즐겨 듣는다고 가정할 때,  
    이 장르 중에서 최근 1~2년 사이에 유행한 해외 음악 4곡을 추천해주세요.
    x
    예시 형식: 
    [
        {
      "name": "노래 제목",
      "artist": "가수 이름"
        },
    ...
    ]
    `.trim();
};
