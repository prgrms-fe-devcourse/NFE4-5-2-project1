import { create } from "zustand";

export const usePlaylistStore = create<PlaylistState>((set) => ({
  tracks: [],
  setTracks: (tracks) => set(() => ({ tracks })),
}));
