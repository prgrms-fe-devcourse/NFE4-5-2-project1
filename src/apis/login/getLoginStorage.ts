export const getLoginStorage = (): string | null => {
  try {
    const storage = localStorage.getItem("app_state");
    if (!storage) return null;

    const parsed = JSON.parse(storage);
    const encodedToken = parsed.login_session;
    if (!encodedToken) return null;

    const decoded = atob(atob(encodedToken));
    return decoded;
  } catch (error) {
    console.error("토큰 불러오기 실패:", error);
    return null;
  }
};
