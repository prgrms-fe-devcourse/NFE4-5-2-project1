import TimeAgo from '../atoms/TimeAgo';
import UserAvatar from '../atoms/UserAvatar';

interface ChattingListItemProps {
  chatRoomId: string;
  imageUrl?: string;
  size?: number;
  status?: 'online' | 'offline';
  statusSize?: number;
  name: string;
  timestamp: string | number | Date;
  unreadCount?: number;
  onClick?: () => void; // 변경: 클릭 핸들러 prop 추가
}

export default function ChattingListItem({
  imageUrl,
  size = 50,
  status,
  statusSize = 12,
  name,
  timestamp,
  unreadCount = 0,
  onClick, // 변경: 디스트럭처링
}: ChattingListItemProps) {
  const displayCount =
    unreadCount > 300 ? '300+' : unreadCount > 0 ? String(unreadCount) : '';

  return (
    <div
      onClick={onClick} // 변경: Link 대신 div 클릭
      className="dark:border:[#505050] dark:bg-dark-card dark:text-dark-text dark:hover:bg-dark-bg block w-[268px] cursor-pointer duration-200 hover:bg-gray-50"
    >
      <div className="flex h-[70px] w-[268px] items-center justify-between border-t border-b border-[#D9D9D9] px-4">
        <div className="flex items-center space-x-2">
          <UserAvatar
            imageUrl={imageUrl}
            size={size}
            status={status}
            statusSize={statusSize}
          />
          <span className="nanum-gothic-bold max-w-[12ch] truncate text-[16px]">
            {name}
          </span>
        </div>

        <div className="flex flex-col items-end space-y-1">
          {displayCount && (
            <span className="flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-[#C62E2E] px-1 text-[12px] font-semibold text-white">
              {displayCount}
            </span>
          )}
          <TimeAgo timestamp={timestamp} />
        </div>
      </div>
    </div>
  );
}
