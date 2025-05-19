import MessageIcon from '../assets/images/message/message-icon.svg';
import { useMessageStore } from '../stores/messageStore';

export default function useChatClose(setIsOpen: (v: boolean) => void) {
  const changeMessageIcon = useMessageStore((state) => state.setMessageIcon);

  return () => {
    setIsOpen(false);
    changeMessageIcon(MessageIcon);
  };
}
