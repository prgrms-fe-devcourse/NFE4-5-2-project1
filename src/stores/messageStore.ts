import { create } from "zustand";

type MessageStore = {
  refetch: boolean;
  setRefetch: () => void;
};
export const useMessageStore = create<MessageStore>((set) => ({
  refetch: false,
  setRefetch: () =>
    set((state) => ({
      refetch: !state.refetch,
    })),
}));
