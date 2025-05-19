import { useEffect, useState } from "react";
import SendMessageForm from "./SendMessageForm";
import { MessageProps } from "../../types/messageType";
import MessageChatView from "./MessageChatView";
import { userStore } from "../../stores/userStore";
import { useLocation } from "react-router";
import { ExtendedUser } from "../../types/postType";
import EmptyMessage from "./EmptyMessage";
import { getMessages } from "../../api/message";

export default function MessageContainer() {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const myId = userStore.getState().getUser()?._id;
  const location = useLocation();
  const selectedUser = location.state?.selectedUser as ExtendedUser;
  const selectedUserId = selectedUser._id;

  const fetchMessages = async () => {
    try {
      const res = await getMessages(selectedUserId);

      const sorted = res.sort(
        (a: MessageProps, b: MessageProps) =>
          new Date(a.createdAt ?? "").getTime() -
          new Date(b.createdAt ?? "").getTime()
      );
      setMessages(sorted);
    } catch (err) {
      console.error("메세지 불러오기 실패", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedUserId]);

  return (
    <>
      <div className="w-full mt-6 h-[75vh] relative">
        <div className="flex ml-[150px] text-2xl font-semibold my-4 text-gray-800 dark:text-white">
          {selectedUser.username ? selectedUser.username : "익명의 유저"} 님과의
          쪽지
        </div>
        {messages.length === 0 ? (
          <EmptyMessage message="쪽지를 보내고 대화를 시작해보세요" />
        ) : (
          <div className="flex overflow-hidden h-2/3 justify-center">
            <MessageChatView messages={messages} myId={myId} />
          </div>
        )}
        <div className="w-[75%] absolute justify-center md:ml-[10%] sm:ml-10 bottom-[-10px]">
          <SendMessageForm
            selectedUserId={selectedUserId}
            onSend={fetchMessages}
          />
        </div>
      </div>
    </>
  );
}
