import { create } from "zustand";
import { Channel } from "../types/postType";

type ChannelStore = {
  channels: Channel[];
  setChannel: (channelId: string, name: string) => void;
  getChannelName: (id: string) => string | undefined;
};

export const useChannelStore = create<ChannelStore>((set, get) => ({
  channels: [],
  refetch: false,
  setChannel: (channelId: string, name: string) =>
    set((state): ChannelStore | Partial<ChannelStore> => ({
      channels: [
        ...state.channels.filter((ch) => ch._id !== channelId),
        { _id: channelId, name } as Channel,
      ],
    })),
  getChannelName: (id: string) => get().channels.find((ch) => ch._id === id)?.name,
}));
