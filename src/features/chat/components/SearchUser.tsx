import { useNavigate } from "react-router";
import defaultProfile from "../../../assets/images/default-profile-logo.svg";
import onlineIcon from "../../../assets/images/icon_online.svg";

export default function SearchUser({
  name,
  userId,
  isOnline,
  image,
  clear,
}: {
  name: string;
  userId: string;
  isOnline: boolean;
  image: string;
  clear?: () => void;
}) {
  const navigate = useNavigate();

  return (
    <>
      <div
        onClick={() => {
          navigate(`/chat/${userId}`);
          clear?.();
        }}
        className="w-full h-auto p-2 flex gap-4 rounded-xl hover:bg-[var(--grey-500)] cursor-pointer items-center"
      >
        <div className="relative">
          <img
            src={image ? image : defaultProfile}
            alt={`${name} 유저 프로필`}
            className="rounded-full size-[32px]"
          />
          {isOnline && (
            <img
              src={onlineIcon}
              alt="온라인 표시"
              className="absolute left-6 bottom-0"
            />
          )}
        </div>

        <div className="flex flex-1 items-center justify-between p-0.5 gap-2 w-[10%]">
          <div className="flex gap-2 items-center">
            <div className="text-sm font-medium truncate flex-1">{name}</div>
          </div>
        </div>
      </div>
    </>
  );
}
