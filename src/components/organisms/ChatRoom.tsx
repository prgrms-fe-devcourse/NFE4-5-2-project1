// src/components/organisms/ChatRoom.tsx
import { useEffect, useState, useRef } from 'react';
import { getMessages } from '../../api/messages';
import ChattingBubble from '../atoms/ChattingBubble';

interface Message {
  _id: string;
  message: string;
  sender: { _id: string };
  createdAt: string;
}

interface ChatRoomProps {
  chatId: string;
  reloadTrigger?: number;
}

export default function ChatRoom({ chatId, reloadTrigger = 0 }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const myId = localStorage.getItem('myId');
  const endRef = useRef<HTMLDivElement>(null);

  // 이전 메시지 개수 저장용
  const prevLengthRef = useRef(0);

  useEffect(() => {
    let isMounted = true;
    const fetch = async () => {
      const data = await getMessages(chatId);
      if (isMounted) setMessages(data);
    };

    fetch();
    const interval = setInterval(fetch, 800);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [chatId, reloadTrigger]);

  // 메시지 length가 이전보다 커졌을 때만 스크롤
  useEffect(() => {
    if (messages.length > prevLengthRef.current) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevLengthRef.current = messages.length;
  }, [messages]);

  return (
    <div className="space-y-2">
      {messages.map((msg) => (
        <ChattingBubble
          key={msg._id}
          sender={msg.sender._id === myId ? 'me' : 'user'}
          timestamp={msg.createdAt}
        >
          {msg.message}
        </ChattingBubble>
      ))}
      <div ref={endRef} />
    </div>
  );
}
