import { create } from 'zustand';

type LoginStore = {
  isLoggedIn: boolean;
  refetch: boolean;
  setRefetch: () => void;
  login: () => void;
  logout: () => void;
};

export const useLoginStore = create<LoginStore>((set) => ({
  isLoggedIn: !!localStorage.getItem('accessToken'),
  refetch: false,
  setRefetch: () => set((state) => ({ refetch: !state.refetch })),
  login: () => {
    set({ isLoggedIn: true });
  },
  logout: () => {
    set({ isLoggedIn: false });
  },
}));
