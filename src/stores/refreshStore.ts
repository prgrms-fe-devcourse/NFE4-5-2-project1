import { create } from "zustand";

type RefreshStore = {
  refresh: boolean;
  refetch: () => void;
};

export const refreshStore = create<RefreshStore>((set) => ({
  refresh: false,
  refetch: () => set((state) => ({ refresh: !state.refresh })),
}));
