import { useEffect, useState } from "react";
import SearchBar from "../../../components/common/SearchBar";
import ChatUser from "./ChatUser";
import useGetConversation from "../hooks/useGetConversation";
import UserList from "./UserList";
import { RotateCcw } from "lucide-react";
import { useRefreshStore } from "../stores/refreshStore";
import { useMsgVersionStore } from "../stores/msgVersionStore";

export default function Conversations({
  loginId,
  from,
}: {
  loginId: string;
  from: string;
}) {
  const [searchInput, setSearchInput] = useState("");
  const { conversations, refresh } = useGetConversation();
  const setRefreshConv = useRefreshStore(
    (state) => state.setRefreshConversations
  );

  const updateCversion = useMsgVersionStore((state) => state.c_increment);
  const updateMVersion = useMsgVersionStore((state) => state.m_increment);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  useEffect(() => {
    setRefreshConv(refresh);
  }, [refresh, setRefreshConv]);

  const refreshHandler = () => {
    updateCversion();
    updateMVersion();
  };

  return (
    <>
      <div className="w-full h-full md:py-8 md:px-5 rounded-4xl md:border md:border-[color:var(--grey-100-90)] flex flex-col md:min-w-50">
        <div className="md:font-semibold text-xl mb-4 cursor-default flex justify-between items-center">
          <div className="hidden md:block my-3 px-2">Message</div>
          <div className="md:hidden font-[MonumentExtended] text-[var(--primary-300)] text-xl pt-2 pb-4">
            CHAT
          </div>
          <RotateCcw
            size={18}
            color="var(--white-80)"
            className="cursor-pointer"
            onClick={refreshHandler}
          />
        </div>

        <SearchBar
          placeholder="사용자 검색"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full"
        />

        <div className="flex flex-col gap-2 w-full overflow-y-auto flex-1 scrollbar-hide h-full">
          {searchInput.trim().length > 0 ? (
            <UserList keyword={searchInput} clear={() => setSearchInput("")} />
          ) : (
            conversations &&
            conversations.map((conv) => {
              const parsedSender = JSON.parse(conv.sender.fullName);
              const parsedReceiver = JSON.parse(conv.receiver.fullName);

              return (
                <ChatUser
                  key={conv._id}
                  loginId={loginId}
                  sender={parsedSender.name}
                  receiver={parsedReceiver.name}
                  senderId={conv.sender._id}
                  receiverId={conv.receiver._id}
                  s_isOnline={conv.sender.isOnline}
                  r_isOnline={conv.receiver.isOnline}
                  s_image={conv.sender.image}
                  r_image={conv.receiver.image}
                  message={conv.message}
                  time={formatTime(new Date(conv.createdAt))}
                  from={from}
                />
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
