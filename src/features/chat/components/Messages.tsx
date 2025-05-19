import { useParams } from "react-router";
import MessageList from "./MessageList";
import NoMessages from "./NoMessages";
import { useMsgVersionStore } from "../stores/msgVersionStore";

export default function Messages() {
  const { userId } = useParams();
  const version = useMsgVersionStore((state) => state.m_version);

  return (
    <>
      <div className="w-full h-full md:p-8 rounded-4xl md:border border-[var(--primary-300)] flex justify-center items-center">
        {userId ? (
          <MessageList key={`${userId}-${version}`} userId={userId} />
        ) : (
          <NoMessages />
        )}
      </div>
    </>
  );
}
