import { useEffect } from 'react';
import { getMessageList, getMessages } from '../api/message/message';
import { useAuthStore } from '../stores/authStore';
import { useMessageStore } from '../stores/messageStore';

export default function useNewMessageUpdate() {
  const user = useAuthStore((state) => state.user);
  const setNewNotiCount = useMessageStore((state) => state.setNewNotiCount);

  useEffect(() => {
    if (!user) return;

    const getNewMessageCount = async () => {
      try {
        const { data: conversations } = await getMessageList();
        let totalCount = 0;

        await Promise.all(
          conversations.map(async (con: Conversation) => {
            const opponentId = con._id.find((id: string) => id !== user._id) || '';
            if (!opponentId) return;

            const { data: messages } = await getMessages(opponentId);
            const count = messages.filter((msg: Message) => msg.sender._id === opponentId && !msg.seen).length;
            totalCount += count;
          })
        );

        setNewNotiCount(totalCount);
      } catch (e) {
        console.log(e instanceof Error && e.message);
      }
    };

    getNewMessageCount();
    const interval = setInterval(getNewMessageCount, 10000);

    return () => clearInterval(interval);
  }, [user, setNewNotiCount]);
}
