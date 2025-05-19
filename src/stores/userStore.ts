import { create } from "zustand";
import { UserStore } from "../types/userTypes";
import { BaseUser } from "../types/postType";
import { persist, createJSONStorage } from "zustand/middleware";

export const userStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: sessionStorage.getItem("user")
        ? JSON.parse(sessionStorage.getItem("user")!).state.token
        : "",
      setUser: (user: BaseUser) => set({ user }),
      setToken: (token: string) => set({ token }),
      getToken: () => get().token,
      getUser: () => get().user,
      logout: () => set({ token: "", user: null }),
    }),
    {
      name: "user",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
