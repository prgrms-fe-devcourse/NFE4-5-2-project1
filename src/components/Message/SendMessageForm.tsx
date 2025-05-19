import { useState } from "react";
import SendButton from "./SendButton";
import { useMessageStore } from "../../stores/messageStore";
import { createMessage } from "../../api/message";
import { createNotification } from "../../api/notification";

export default function SendMessageForm({
  selectedUserId,
  onSend,
}: {
  selectedUserId: string | undefined;
  onSend: () => void;
}) {
  const [content, setContent] = useState("");
  const sendHandler = async () => {
    if (!content.trim()) return;
    try {
      const res = await createMessage(content, selectedUserId ?? "");

      const messageId = res._id;

      await createNotification({
        notificationType: "MESSAGE",
        notificationTypeId: messageId,
        userId: selectedUserId || "",
        postId: null,
      });
      setContent("");
      onSend();
      useMessageStore.getState().setRefetch();
    } catch (err) {
      console.error("메세지 보내기 실패", err);
    }
  };
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="flex border-1 border-gray-200 rounded-2xl relative dark:border-gray-600"
      >
        <textarea
          className="p-4 h-32 w-[80%] my-2 border-gray-300 resize-none focus:outline-none"
          placeholder="내용을 입력하세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) {
              return;
            }
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendHandler();
            }
          }}
        ></textarea>
        <SendButton onClick={sendHandler} />
      </form>
    </>
  );
}
