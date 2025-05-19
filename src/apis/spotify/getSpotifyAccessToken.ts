import axios from "axios";

const GRANT_TYPE = "client_credentials";

interface TokenCache {
  accessToken: string;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;

/**
 * Spotify API 접근하기 위한 accesstoken 가져오는 함수
 * 1시간 유효시간 있어서 유효한 토큰이 있으면 return 없으면 토큰 재생성
 */
export const getSpotifyAccessToken = async (): Promise<string> => {
  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt > now) {
    return tokenCache.accessToken;
  }

  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

  const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Spotify 인증 정보가 없습니다");
  }

  const basicToken = btoa(`${clientId}:${clientSecret}`);

  try {
    const res = await axios.post(
      import.meta.env.VITE_SPOTIFY_TOKEN_URL,
      new URLSearchParams({ grant_type: GRANT_TYPE }),
      {
        headers: {
          Authorization: `Basic ${basicToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const expireTime = res.data.expires_in * 1000;
    tokenCache = {
      accessToken: res.data.access_token,
      expiresAt: now + expireTime - 60000,
    };
    return tokenCache.accessToken;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Spotify 토큰 발급 실패:");
      throw new Error(`Spotify 인증 실패: ${error.message}`);
    }
    console.error("AccessToken 발급 중 예상치 못한 오류:", error);
    throw error;
  }
};

export const refreshSpotifyToken = async (): Promise<string> => {
  tokenCache = null;
  return getSpotifyAccessToken();
};
