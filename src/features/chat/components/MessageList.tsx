import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import LeftMessageBox from "./LeftMessageBox";
import RightMessageBox from "./RightMessageBox";
import TextBox from "./TextBox";
import DateSeparator from "./DateSeparator";
import groupMessages, { GroupedMessage } from "../../../utils/groupMessages";
import useGetMessages from "../hooks/useGetMessages";
import { useRefreshStore } from "../stores/refreshStore";
import useGetUser from "../hooks/useGetUser";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import defaultProfile from "../../../assets/images/default-profile-logo.svg";
import onlineIcon from "../../../assets/images/icon_online.svg";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function MessageList({ userId }: { userId: string }) {
  const navigate = useNavigate();
  const [chatInput, setChatInput] = useState("");

  const { messages, loading, refresh } = useGetMessages(userId);
  const { userInfo } = useGetUser(userId);

  const setRefreshMsg = useRefreshStore((state) => state.setRefreshMessages);
  const groupedMessages: GroupedMessage[] = useMemo(() => {
    return groupMessages(messages);
  }, [messages]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const container = bottomRef.current?.parentElement;
    if (!container) return;
    const isOverflowing = container.scrollHeight > container.clientHeight;

    if (isOverflowing) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  useEffect(() => {
    setRefreshMsg(refresh);
  }, [refresh, setRefreshMsg]);

  return (
    <>
      <div className="flex flex-col h-full w-full">
        <div className="px-3 pb-4 border-b border-[var(---white-80)] flex gap-4 items-center box-border">
          <button
            className="md:hidden cursor-pointer"
            onClick={() => navigate("/chat")}
          >
            <ChevronLeft />
          </button>
          <div className="relative">
            <img
              src={userInfo?.image ? userInfo?.image : defaultProfile}
              alt={`${userInfo?.userName} 유저 프로필`}
              className="rounded-full size-[32px]"
            />
            {userInfo?.isOnline && (
              <img
                src={onlineIcon}
                alt="온라인 표시"
                className="absolute left-6 bottom-0"
              />
            )}
          </div>

          <div className="md:text-lg lg:text-xl text-base font-medium">
            {userInfo?.userName}
          </div>
        </div>

        <div className="flex flex-col py-4 gap-2 overflow-y-auto scrollbar-hide flex-1">
          {loading ? (
            <div className="w-full h-full flex justify-center items-center">
              <LoadingSpinner />
            </div>
          ) : (
            groupedMessages.map((message, index) => {
              const time = new Date(message.createdAt).toLocaleTimeString(
                "ko-KR",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }
              );

              const borderRadiusClass = {
                single: "rounded-t",
                first: "rounded-t",
                middle: "",
                last: "rounded-b",
              }[message.groupPosition];

              const showDateSeparator =
                index === 0 ||
                message.groupDate !== groupedMessages[index - 1]?.groupDate;

              return (
                <React.Fragment key={message.id}>
                  {showDateSeparator && (
                    <DateSeparator date={message.groupDate} />
                  )}
                  {message.s_id === userId ? (
                    <LeftMessageBox
                      text={message.message}
                      time={time}
                      className={borderRadiusClass}
                    />
                  ) : (
                    <RightMessageBox
                      text={message.message}
                      time={time}
                      className={borderRadiusClass}
                    />
                  )}
                </React.Fragment>
              );
            })
          )}

          <div ref={bottomRef} />
        </div>

        <TextBox
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onClear={() => setChatInput("")}
          userId={userId}
        />
      </div>
    </>
  );
}
