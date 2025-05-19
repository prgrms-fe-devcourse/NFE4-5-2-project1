export const searchYoutubeVideo = async (
  query: string
): Promise<string | null> => {
  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&topicId=/m/04rlf&videoCategoryId=10&maxResults=1&q=${encodeURIComponent(
        query
      )}&key=${API_KEY}`
    );
    const data = await res.json();
    return data.items?.[0]?.id?.videoId ?? null;
  } catch (e) {
    console.error("Youtube 검색 실패", e);
    return null;
  }
};
