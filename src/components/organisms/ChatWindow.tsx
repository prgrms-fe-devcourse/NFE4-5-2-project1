// src/components/organisms/ChatWindow.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import XIcon from '../../assets/images/close.png';
import ChatList, { Conversation } from './ChatList';
import ChatRoom from './ChatRoom';
import chaticon from '../../assets/images/chatIcon.png';
import { createMessage } from '../../api/messages';
import UserAvatar from '../atoms/UserAvatar';
import ArrowLeftIcon from '../../assets/images/arrow_left_icon.svg';

interface ChatWindowProps {
  onClose: () => void;
  initialConversation?: Conversation;
}

export default function ChatWindow({
  onClose,
  initialConversation,
}: ChatWindowProps) {
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(
    initialConversation || null,
  );
  const [draft, setDraft] = useState<string>('');
  const [reloadTrigger, setReloadTrigger] = useState(0);

  useEffect(() => {
    if (initialConversation) setSelectedChat(initialConversation);
  }, [initialConversation]);

  const handleSelectChat = (conv: Conversation) => setSelectedChat(conv);
  const handleBack = () => setSelectedChat(null);

  const handleSend = async () => {
    if (!draft.trim() || !selectedChat) return;
    try {
      await createMessage(draft, selectedChat.partner._id);
      setDraft('');
      setReloadTrigger((t) => t + 1);
    } catch (error) {
      console.error('메시지 전송 실패', error);
    }
  };

  return (
    <motion.div
      key="chat-window"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="nanum-gothic-regular dark:bg-dark-card dark:text-dark-text fixed right-5 bottom-5 z-50 flex h-[471px] w-[318px] flex-col rounded-lg bg-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5),0_4px_6px_-2px_rgba(0,0,0,0.3)]"
    >
      <header className="flex items-center justify-between border-b border-[#D9D9D9] px-4 py-2">
        {selectedChat ? (
          <>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBack}
                className="cursor-pointer dark:contrast-75 dark:invert"
              >
                <img src={ArrowLeftIcon} alt="뒤로가기" />
              </button>
              <UserAvatar
                imageUrl={selectedChat.partner.image}
                size={50}
                status={selectedChat.partner.status}
                statusSize={12}
              />
              <h4 className="text-lg font-medium">
                {selectedChat.partner.fullName}
              </h4>
            </div>
            <button
              onClick={onClose}
              className="cursor-pointer dark:contrast-75 dark:invert"
            >
              <img src={XIcon} alt="닫기" />
            </button>
          </>
        ) : (
          <>
            <h4 className="text-lg font-bold">채팅 목록</h4>
            <button
              onClick={onClose}
              className="cursor-pointer dark:contrast-70 dark:invert"
            >
              <img src={XIcon} alt="닫기" />
            </button>
          </>
        )}
      </header>

      <div className="flex-1 overflow-auto p-4">
        {selectedChat ? (
          <ChatRoom
            chatId={selectedChat.partner._id}
            reloadTrigger={reloadTrigger}
          />
        ) : (
          <ChatList onSelect={handleSelectChat} />
        )}
      </div>

      {selectedChat && (
        <footer className="mr-[15px] p-2">
          <div className="relative w-full px-1">
            <input
              type="text"
              placeholder="메시지를 입력하세요"
              className="w-full rounded border border-[#D7CAB9] px-2 py-1 pr-10 focus:outline-none"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer dark:contrast-75 dark:invert"
              onClick={handleSend}
            >
              <img src={chaticon} alt="전송" className="h-6 w-6" />
            </button>
          </div>
        </footer>
      )}
    </motion.div>
  );
}
