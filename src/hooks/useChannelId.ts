import { useEffect, useState } from "react";
import { axiosInstance } from "../apis/axiosInstance";

interface Channel {
  _id: string;
  name: string;
}

export function useChannelId(channelName: string) {
  const [channelId, setChannelId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChannelId = async () => {
      try {
        const response = await axiosInstance.get<Channel[]>(`/channels`);
        const channels = response.data;

        const matchChannel = channels.find(
          (channel) => channel.name === channelName
        );
        if (matchChannel) {
          setChannelId(matchChannel._id);
        }
      } catch (e) {
        console.error("Failed to Fetch Channel Id:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchChannelId();
  }, [channelName]);

  return { channelId, loading };
}
