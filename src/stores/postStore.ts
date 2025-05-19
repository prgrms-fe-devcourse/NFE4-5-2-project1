import { create } from 'zustand';

interface PostStore {
  channelIdList: string[];
}

export const usePostStore = create<PostStore>(() => ({
  channelIdList: [
    '68285819a30514258740f206',
    '68285835a30514258740f216',
    '68285844a30514258740f220',
  ],
}));
