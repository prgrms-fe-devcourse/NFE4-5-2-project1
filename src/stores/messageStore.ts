import { create } from 'zustand';
import messageIcon from '../assets/images/message/message-icon.svg';

interface Message {
  messageIcon: string;
  newNotiCount: number;
  setMessageIcon: (icon: string) => void;
  setNewNotiCount: (newCount: number) => void;
}

export const useMessageStore = create<Message>((set) => ({
  messageIcon: messageIcon,
  newNotiCount: 0,
  setMessageIcon: (icon) => set({ messageIcon: icon }),
  setNewNotiCount: (newCount) => set({ newNotiCount: newCount }),
}));
