import { useEffect, useState } from "react";
import { MessageProps, Sender } from "../../types/messageType";
import { userStore } from "../../stores/userStore";
import { useNavigate } from "react-router";
import { useMessageStore } from "../../stores/messageStore";
import { messageConversations, updateMessageSeen } from "../../api/message";

export default function SideMessageList() {
  const [lists, setLists] = useState<MessageProps[]>([]);
  const myId = userStore.getState().getUser()?._id;
  const navigate = useNavigate();
  const { refetch } = useMessageStore();

  const fetchMessageList = async () => {
    try {
      const res = await messageConversations();

      const sorted = res.sort(
        (a: MessageProps, b: MessageProps) =>
          new Date(b.createdAt ?? "").getTime() -
          new Date(a.createdAt ?? "").getTime()
      );
      setLists(sorted);
    } catch (err) {
      console.error("메세지 목록 불러오기 실패", err);
    }
  };

  const clickMessage = async (
    selectedUser: Sender,
    fetchMessageList: () => void,
    navigate: ReturnType<typeof useNavigate>
  ) => {
    try {
      await updateMessageSeen(selectedUser._id);
      await fetchMessageList();
    } catch (err) {
      console.log("읽음 처리 실패", err);
    }

    navigate(`/message/${selectedUser._id}`, {
      state: { selectedUser },
    });
  };

  useEffect(() => {
    fetchMessageList();
  }, [refetch]);

  return (
    <>
      <ul className="mt-10 w-[258px] h-[calc(100vh-300px)] overflow-y-auto">
        {lists.map((list) => {
          const selectedUser = (
            list.sender?._id === myId ? list.receiver : list.sender
          ) as Sender;
          return (
            <li
              key={list._id}
              className="h-18 px-3 pb-2 pt-1 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer overflow-y-auto"
              onClick={() => {
                clickMessage(selectedUser, fetchMessageList, navigate);
              }}
            >
              <div className="flex justify-between mt-1">
                <div className="text-md dark:text-white">
                  {selectedUser.username
                    ? selectedUser.username
                    : "익명의 유저"}
                </div>
                <div className="text-xs text-right text-gray-400 dark:text-gray-400">
                  {list.createdAt &&
                    new Date(list.createdAt).toLocaleString("ko-KR", {
                      month: "long",
                      day: "numeric",
                    })}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2 justify-between">
                <span className="text-md line-clamp-1 text-gray-400 dark:text-gray-500">
                  {list.message}
                </span>
                {list.receiver?._id === myId && !list.seen && (
                  <span className="text-red-600 text-[9px]">●</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
