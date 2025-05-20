import defaultAvatar from '../../assets/images/User.jpg';

interface UserAvatarProps {
  imageUrl?: string;
  size?: number; // Avatar 크기(px)
  status?: 'online' | 'offline'; // optional: 상태 표시 여부
  statusSize?: number; // optional: 상태 dot 크기(px)
}

export default function UserAvatar({
  imageUrl,
  size = 24, // 아바타 기본사이즈
  status, // 온라인 오프라인 상태값
  statusSize = 8, // 기본 상태 dot 크기
}: UserAvatarProps) {
  // 색상 맵: online → 초록, offline → 회색
  const statusColor =
    status === 'online'
      ? '#9AD75D'
      : status === 'offline'
        ? '#D9D9D9'
        : undefined;

  return (
    <div
      className="relative inline-block"
      style={{ width: size, height: size }}
    >
      <img
        src={imageUrl || defaultAvatar}
        alt="유저 아바타"
        className="h-full w-full rounded-full object-cover"
      />

      {statusColor && (
        <span
          className="absolute rounded-full border-2 border-white"
          style={{
            width: statusSize,
            height: statusSize,
            backgroundColor: statusColor,
            bottom: 0,
            right: 0,
          }}
        />
      )}
    </div>
  );
}
