export const getPromptFromTracks = (tracks?: TrackInfo[]): string => {
  if (!tracks || tracks.length === 0) {
    throw new Error("추천 실패");
  }

  const list = tracks
    .map((track, i) => `${i + 1}. ${track.title.name} - ${track.title.artist}`)
    .join("\n");

  return `
다음은 사용자의 플레이리스트입니다. 이와 어울리는 새로운 해외 음악 4개를 추천해주세요.
반드시 JSON 배열 형식으로만 반환해주세요. 
x
예시 형식: 
[
  {
    "name": "노래 제목",
    "artist": "가수 이름"
  },
  ...
]

사용자 플레이리스트:
${list}
  `.trim();
};
