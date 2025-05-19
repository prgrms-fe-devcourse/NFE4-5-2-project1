import axios from "axios";

/**
 * @param query 검색어
 * @param accessToken getSpotifyAccessToken로 token값 받아서 매개변수로 전달해야함
 */
export const searchArtist = async (query: string, accessToken: string) => {
  try {
    const res = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        q: query,
        type: "artist",
        limit: 10,
      },
    });

    return res.data.artists.items;
  } catch (error) {
    console.error("가수 검색 실패:", error);
    throw error;
  }
};

/**
 * Spotify API로 트랙(노래) 검색
 * @param query 검색어
 * @param accessToken getSpotifyAccessToken로 token값 받아서 매개변수로 전달해야함
 */
export const searchTrack = async (query: string, accessToken: string) => {
  try {
    const res = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        q: query,
        type: "track",
        limit: 10,
      },
    });

    return res.data.tracks.items;
  } catch (error) {
    console.error("노래 검색 실패:", error);
    throw error;
  }
};

export const searchMultipleTracks = async (
  tracks: TrackPrompt[],
  token: string
) => {
  const results = await Promise.all(
    tracks.map((track) =>
      searchTrack(`${track.name} ${track.artist}`, token).then((res) => res[0])
    )
  );

  return results.filter(Boolean);
};
