import { Bell, ChevronLeft } from "lucide-react";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { useNavigate } from "react-router";
import defaultProfile from "../../../assets/images/defaultProfile.svg";

export default function NotificationPanel({
  notifications,
  isLoading,
  onClose,
  onMarkAllAsSeen,
  unseenCount,
  toggleMenu,
}: NotificationPanelProps) {
  const navigate = useNavigate();

  const getAuthorName = (notification: Notification) => {
    try {
      if (notification.author && notification.author.fullName) {
        const parsedName = JSON.parse(notification.author.fullName);
        return parsedName.name || "POPCON";
      }
      return "알 수 없는 사용자";
    } catch (error) {
      console.error("작성자 이름 파싱 오류:", error);
      return "알 수 없는 사용자";
    }
  };

  const getNotificationMessage = (notification: Notification) => {
    const authorName = getAuthorName(notification);
    if (notification.like) {
      return `${authorName}님이 내 게시물을 좋아합니다.`;
    }

    if (notification.comment) {
      return `${authorName}님이 내 게시물에 댓글을 남겼습니다.`;
    }

    if (notification.message) {
      return `${authorName}님이 메시지를 보냈습니다.`;
    }

    return "새로운 알림이 있습니다.";
  };

  const handleNavigate = (notification: Notification) => {
    if (notification.like) {
      if (notification.like?.post.channel === "681e2fbc7380bb759ecc6367") {
        navigate(`/community/bops-community/post/${notification.post}`);
      } else if (
        notification.like?.post.channel === "681e2fdd7380bb759ecc636d"
      ) {
        navigate(`/community/concert-community/post/${notification.post}`);
      } else if (
        notification.like?.post.channel === "681e2fee7380bb759ecc6371"
      ) {
        navigate(`/community/open-community/post/${notification.post}`);
      }
    } else if (notification.comment) {
      if (notification.comment?.post.channel === "681e2fbc7380bb759ecc6367") {
        navigate(`/community/bops-community/post/${notification.post}`);
      } else if (
        notification.comment?.post.channel === "681e2fdd7380bb759ecc636d"
      ) {
        navigate(`/community/concert-community/post/${notification.post}`);
      } else if (
        notification.comment?.post.channel === "681e2fee7380bb759ecc6371"
      ) {
        navigate(`/community/open-community/post/${notification.post}`);
      }
    } else {
      navigate(`/chat/${notification.author._id}`, {
        state: { from: location.pathname },
      });
    }
    toggleMenu();
  };

  return (
    <div className="flex flex-col h-full">
      <ChevronLeft
        onClick={onClose}
        strokeWidth={1.5}
        className="fixed top-12 left-5 text-[color:var(--white)] cursor-pointer mr-2"
      />
      <div className="flex justify-between items-center mt-[32px] mb-6">
        <div className="flex items-center">
          <h2 className="text-[color:var(--white)] text-[18px] font-medium cursor-default">
            Notifications
          </h2>
        </div>
        {unseenCount > 0 && (
          <button
            onClick={onMarkAllAsSeen}
            className="text-[color:var(--white-80)] text-[12px] font-light hover:text-[color:var(--primary-300)] cursor-pointer"
          >
            전체 삭제
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : notifications.filter((noti) => !noti.seen).length > 0 ? (
        <div className="flex flex-col overflow-y-auto scrollbar-hide ">
          {notifications
            .filter((noti) => !noti.seen)
            .map((notification) => (
              <div
                key={notification._id}
                className="p-2 mb-2 rounded-[8px] hover:bg-[color:var(--grey-500)] cursor-pointer"
                onClick={() => handleNavigate(notification)}
              >
                <div className="flex gap-4 justify-center items-center">
                  <img
                    src={
                      notification.author.image
                        ? notification.author.image
                        : defaultProfile
                    }
                    alt=""
                    className="w-6 h-6 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-[color:var(--white)] text-[11px]">
                      {getNotificationMessage(notification)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="flex flex-col h-full items-center justify-start pt-24 gap-[10px] ">
          <Bell />
          <p className="text-[color:var(--white-80)]">No notifications.</p>
        </div>
      )}
    </div>
  );
}
