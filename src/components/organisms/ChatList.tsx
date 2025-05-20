// src/components/organisms/ChatList.tsx
import { useEffect, useState } from 'react';
import {
  getConversations,
  markMessagesSeen,
  getMessages,
} from '../../api/messages'; // getMessages 추가
import ChattingListItem from '../atoms/ChattingListItem';

export interface Conversation {
  chatRoomId: string;
  partner: {
    _id: string;
    fullName: string;
    image?: string;
    status?: 'online' | 'offline';
  };
  lastMessage: { timestamp: string | number | Date };
  unreadCount: number;
}

// API에서 받아오는 “raw” 데이터 형태
interface RawConversation {
  _id: string;
  createdAt: string;
  seen: boolean;
  sender: {
    _id: string;
    fullName: string;
    image?: string;
    isOnline?: boolean;
  };
  receiver: {
    _id: string;
    fullName: string;
    image?: string;
    isOnline?: boolean;
  };
}

interface Message {
  _id: string;
  message: string;
  seen: boolean;
  sender: { _id: string };
  receiver: { _id: string };
  createdAt: string;
}

interface ChatListProps {
  onSelect: (conv: Conversation) => void;
  initialConversation?: Conversation;
}

export default function ChatList({
  onSelect,
  initialConversation,
}: ChatListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConvs() {
      try {
        // 1) 원본 대화 목록 조회
        const raw: RawConversation[] = await getConversations();
        const meId = localStorage.getItem('myId');

        // 2) raw → 기본 Conversation[] 매핑 (unreadCount는 placeholder)
        const base: Conversation[] = raw.map((r) => {
          const isSender = r.sender._id === meId;
          const partnerUser = isSender ? r.receiver : r.sender;
          return {
            chatRoomId: r._id,
            partner: {
              _id: partnerUser._id,
              fullName: partnerUser.fullName,
              image: partnerUser.image,
              status: partnerUser.isOnline ? 'online' : 'offline',
            },
            lastMessage: { timestamp: r.createdAt },
            unreadCount: 0, // 나중에 계산
          };
        });

        // 3) initialConversation 머지
        let merged = initialConversation
          ? [initialConversation, ...base]
          : base;
        // 4) 중복 제거
        merged = Array.from(
          new Map(merged.map((c) => [c.chatRoomId, c])).values(),
        );

        // 5) 각 대화에 대해 getMessages 호출하여 실제 unreadCount 계산
        const detailed = await Promise.all(
          merged.map(async (conv) => {
            // 모든 메시지를 조회
            const msgs: Message[] = await getMessages(conv.partner._id);
            // 파트너가 보낸, 아직 읽지 않은 메시지 수
            const unread = msgs.filter(
              (m) => m.sender._id === conv.partner._id && !m.seen,
            ).length;
            return { ...conv, unreadCount: unread };
          }),
        );

        setConversations(detailed);
      } catch (e) {
        console.error('대화 목록 불러오기 실패', e);
      } finally {
        setLoading(false);
      }
    }
    fetchConvs();
  }, [initialConversation]);

  const handleClick = async (conv: Conversation) => {
    if (conv.unreadCount > 0) {
      try {
        await markMessagesSeen(conv.chatRoomId);
        // 로컬에서도 업데이트
        setConversations((prev) =>
          prev.map((c) =>
            c.chatRoomId === conv.chatRoomId ? { ...c, unreadCount: 0 } : c,
          ),
        );
      } catch (e) {
        console.error('메시지 읽음 처리 실패', e);
      }
    }
    onSelect(conv);
  };

  if (loading) return <p className="p-4 text-center">로딩 중…</p>;
  if (conversations.length === 0)
    return <p className="p-4 text-center">대화가 없습니다.</p>;

  return (
    <div className="h-full overflow-y-auto pl-[10px]">
      {conversations.map((conv) => (
        <ChattingListItem
          key={conv.chatRoomId}
          onClick={() => handleClick(conv)}
          chatRoomId={conv.chatRoomId}
          imageUrl={conv.partner.image || ''}
          size={50}
          status={conv.partner.status}
          statusSize={12}
          name={conv.partner.fullName}
          timestamp={conv.lastMessage.timestamp}
          unreadCount={conv.unreadCount}
        />
      ))}
    </div>
  );
}
