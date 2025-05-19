import { useCallback, useEffect, useState } from "react";
import { axiosInstance } from "../../../apis/axiosInstance";
import { Message } from "../types/Message";

type SimpleMsg = {
  id: string;
  message: string;
  sender: { name: string; favoriteGenre: string; favoriteArtist: string };
  s_isOnline: boolean;
  s_id: string;
  s_img: string;
  receiver: { name: string; favoriteGenre: string; favoriteArtist: string };
  r_id: string;
  r_isOnline: boolean;
  r_img: string;
  createdAt: string;
};

export default function useGetMessages(userId: string) {
  const [messages, setMessages] = useState<SimpleMsg[]>([]);
  const [loading, setLoading] = useState(true);

  const formatTime = (date: Date) => {
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getMessages = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/messages", {
        params: { userId: userId },
      });

      const msgData = data.map((msg: Message) => ({
        id: msg._id,
        message: msg.message,
        sender: JSON.parse(msg.sender.fullName),
        s_isOnline: msg.sender.isOnline,
        s_id: msg.sender._id,
        s_img: msg.sender.image,
        receiver: JSON.parse(msg.receiver.fullName),
        r_isOnline: msg.receiver.isOnline,
        r_id: msg.receiver._id,
        r_img: msg.receiver.image,
        createdAt: formatTime(new Date(msg.createdAt)),
      }));

      setMessages([...msgData]);
    } catch {
      throw new Error();
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    setMessages([]);
    setLoading(true);
    getMessages();
  }, [getMessages]);

  return { messages, loading, refresh: getMessages };
}
