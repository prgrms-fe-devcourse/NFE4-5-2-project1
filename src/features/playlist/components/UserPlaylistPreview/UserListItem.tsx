import { ChevronRight } from "lucide-react";
import defaultProfile from "../../../../assets/images/defaultProfile.svg";
import onlineIcon from "../../../../assets/images/icon_online.svg";

export default function UserListItem({
  fullName,
  coverImage,
  favoriteArtist,
  isOnline,
  id,
  setSelectedUserId,
}: UserListItemProps) {
  return (
    <div
      className="flex justify-between w-full p-[12px] border-b border-[color:var(--white-80)] cursor-pointer hover:border-[color:var(--primary-300)] group"
      onClick={() => {
        setSelectedUserId(id);
      }}
    >
      <div className="flex items-center gap-[24px]">
        <div className="relative">
          <img
            src={coverImage ? coverImage : defaultProfile}
            alt={`${fullName} 유저 프로필`}
            className="w-6 2xl:w-full"
          />
          {isOnline && (
            <img
              src={onlineIcon}
              alt="온라인 표시"
              className="absolute right-0 bottom-0"
            />
          )}
        </div>
        <p className="w-[140px] text-[12px] md:text-[14px] font-medium">
          {fullName}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <p className="w-full text-[10px] md:text-[12px] text-[color:var(--grey-200)] truncate">
          {favoriteArtist ? `좋아하는 가수 : ${favoriteArtist}` : ""}
        </p>
        <ChevronRight
          className="group-hover:text-[color:var(--primary-300)] min-w-4 md:min-w-6"
          strokeWidth={1}
        />
      </div>
    </div>
  );
}
