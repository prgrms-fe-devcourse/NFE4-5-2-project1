import { create } from "zustand";

type RefreshStore = {
  refreshConversations: () => void;
  refreshMessages: () => void;
  setRefreshConversations: (fn: () => void) => void;
  setRefreshMessages: (fn: () => void) => void;
};

export const useRefreshStore = create<RefreshStore>((set) => ({
  refreshConversations: () => {},
  refreshMessages: () => {},
  setRefreshConversations: (fn) => set({ refreshConversations: fn }),
  setRefreshMessages: (fn) => set({ refreshMessages: fn }),
}));
