import { create } from "zustand";
import { getLoginStorage } from "../apis/login/getLoginStorage";

interface AuthStore {
  isLoggedIn: boolean;
  accessToken: string | null;
  login: (accessToken: string) => void;
  logout: () => void;
  initAuth: () => void;
}

const initialToken = getLoginStorage();

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: !!initialToken,
  accessToken: initialToken,

  login: (accessToken: string) => set({ isLoggedIn: true, accessToken }),
  logout: () => set({ isLoggedIn: false, accessToken: null }),

  initAuth: () => {
    const token = getLoginStorage();
    if (token) {
      set({ isLoggedIn: true, accessToken: token });
      return true;
    }
    return false;
  },
}));

useAuthStore.getState().initAuth();
