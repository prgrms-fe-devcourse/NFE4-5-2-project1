import { create } from "zustand";
import { Post, NewAndHotPost } from "../types/postType";

export const useNewAndHotPostStore = create<NewAndHotPost>((set, get) => ({
  newPostList: [],
  hotPostList: [],
  setNewPostList: (newPostList: Post[]) => set({ newPostList }),
  setHotPostList: (hotPostList: Post[]) => set({ hotPostList }),
  getNewPostList: () => get().newPostList,
  getHotPostList: () => get().hotPostList,
}));
