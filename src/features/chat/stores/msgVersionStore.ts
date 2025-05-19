import { create } from "zustand";

type MsgVersionStore = {
  c_version: number;
  m_version: number;
  c_increment: () => void;
  m_increment: () => void;
  reset: () => void;
};

export const useMsgVersionStore = create<MsgVersionStore>((set) => ({
  c_version: 0,
  m_version: 0,
  c_increment: () => set((state) => ({ c_version: state.c_version + 1 })),
  m_increment: () => set((state) => ({ m_version: state.m_version + 1 })),
  reset: () => set({ c_version: 0, m_version: 0 }),
}));
