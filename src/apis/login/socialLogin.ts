type Kakao = {
  init: (key: string) => void;
  isInitialized: () => boolean;
  Auth: {
    login: (opts: {
      success: () => void;
      fail: (err: unknown) => void;
    }) => void;
  };
  API: {
    request: (opts: {
      url: string;
      success: (res: KakaoUserResponse) => void;
      fail: (err: unknown) => void;
    }) => void;
  };
};

type KakaoUserResponse = {
  id: number;
  kakao_account: {
    profile: {
      nickname?: string;
      profile_image_url?: string;
    };
  };
};

export const loadKakaoSdk = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.getElementById("kakao-sdk")) return resolve();

    const script = document.createElement("script");
    script.id = "kakao-sdk";
    script.src = "https://developers.kakao.com/sdk/js/kakao.min.js";
    script.onload = () => resolve();
    script.onerror = () => reject("카카오 SDK 로딩 실패");
    document.head.appendChild(script);
  });
};

export const initKakaoSdk = (key: string): void => {
  const kakao = (window as unknown as { Kakao: Kakao }).Kakao;

  if (kakao && !kakao.isInitialized()) {
    kakao.init(key);
  }
};

export const loginWithKakao = (): Promise<KakaoUserResponse> => {
  return new Promise((resolve, reject) => {
    const kakao = (window as unknown as { Kakao: Kakao }).Kakao;

    if (
      !kakao ||
      typeof kakao !== "object" ||
      typeof kakao.Auth?.login !== "function" ||
      typeof kakao.API?.request !== "function"
    ) {
      return reject("Kakao SDK가 올바르게 로드되지 않았습니다.");
    }

    kakao.Auth.login({
      success: () => {
        kakao.API.request({
          url: "/v2/user/me",
          success: (res) => {
            const id = res.id;
            const nickname =
              res.kakao_account?.profile?.nickname ?? "kakao_user";

            if (!id || !nickname) {
              return reject("사용자 정보를 가져오지 못했습니다.");
            }

            resolve(res);
          },
          fail: (err) => reject(err),
        });
      },
      fail: (err) => reject(err),
    });
  });
};
