import { useNavigate, useParams } from "react-router";
import { ConversationProps } from "../types/ConversationProps";
import { useMemo } from "react";
import defaultProfile from "../../../assets/images/default-profile-logo.svg";
import onlineIcon from "../../../assets/images/icon_online.svg";

export default function ChatUser({
  sender,
  loginId,
  receiver,
  senderId,
  receiverId,
  s_isOnline,
  r_isOnline,
  s_image,
  r_image,
  message,
  time,
  from,
}: ConversationProps) {
  const navigate = useNavigate();
  const { userId } = useParams();

  const userName = useMemo(() => {
    return loginId === senderId ? receiver : sender;
  }, [loginId, senderId, receiver, sender]);

  const otherUserId = useMemo(() => {
    return loginId === senderId ? receiverId : senderId;
  }, [loginId, senderId, receiverId]);

  const userImage = useMemo(() => {
    return loginId === senderId ? r_image : s_image;
  }, [loginId, senderId, r_image, s_image]);

  const userIsOnline = useMemo(() => {
    return loginId === senderId ? r_isOnline : s_isOnline;
  }, [loginId, senderId, r_isOnline, s_isOnline]);

  const isSelected = userId === otherUserId;

  return (
    <>
      <div
        onClick={() => navigate(`/chat/${otherUserId}`, { state: { from } })}
        className={`w-full h-auto p-2 flex gap-4 rounded-xl hover:bg-[var(--grey-500)] cursor-pointer items-center my-2 md:my-0 ${
          isSelected && "bg-[var(--grey-500)]"
        }`}
      >
        <div className="relative">
          <img
            src={userImage ? userImage : defaultProfile}
            alt={`${userName} 유저 프로필`}
            className="rounded-full size-[32px]"
          />
          {userIsOnline && (
            <img
              src={onlineIcon}
              alt="온라인 표시"
              className="absolute left-6 bottom-0"
            />
          )}
        </div>

        <div className="flex flex-col flex-1 p-0.5 w-[50%]">
          <div className="text-base font-medium flex gap-2 items-center">
            {userName}
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="text-[0.75rem] font-regular text-[var(--white-80)] truncate flex-1">
              {message}
            </div>
            <div className="text-[0.75rem] font-light text-[var(--white-80)]">
              {time}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
