import { create } from 'zustand';

type LikeStore = {
  likes: number;
  increaseLikes: () => void;
};

export const useLikeStore = create<LikeStore>((set) => ({
  likes: 0,
  increaseLikes: () => set((state) => ({ likes: state.likes + 1 })),
}));
