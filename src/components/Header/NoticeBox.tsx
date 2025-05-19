import { useEffect } from "react";
import { MdClose } from "react-icons/md";
import { Alert } from "./HeaderIcon";
import { useNavigate } from "react-router";
import { useChannelStore } from "../../stores/channelStore";
import { userStore } from "../../stores/userStore";
import { seenNotifications } from "../../api/notification";

const alertList =
  "border-b border-gray-200 last:border-0 w-76 py-1 cursor-pointer hover:underline hover:underline-offset-2 relative";

export default function NoticeBox({
  onClose,
  alerts,
  setAlerts,
}: {
  onClose: () => void;
  alerts: Alert[];
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
}) {
  const navigate = useNavigate();
  const myId = userStore.getState().getUser()?._id;

  const getAlertMessage = (a: Alert) => {
    const authorName = a.author.username;
    if (!a) return;

    const sender = authorName ? authorName : "익명의 유저";

    if (a.message) return `${sender}님이 쪽지를 보냈습니다.`;
    if (a.follow) return `${sender}님이 당신을 팔로우 했습니다.`;
    if (a.comment) return `${sender}님이 댓글을 달았습니다.`;
    if (a.like) return `${sender}님이 게시글에 좋아요를 눌렀습니다.`;
  };

  const handleAlertClick = async (alert: Alert) => {
    if (!alert.author) return;

    const prev = JSON.parse(localStorage.getItem("alertId") || "[]");
    const updated = [...new Set([...prev, alert._id])];
    localStorage.setItem("alertId", JSON.stringify(updated));
    setAlerts((prev) =>
      prev.map((a) => (a._id === alert._id ? { ...a, seen: true } : a))
    );

    if (alert.message) {
      navigate(`/message/${alert.author._id}`, {
        state: {
          selectedUser: alert.author,
        },
      });
    }
    if (alert.like) {
      const channelId = alert.like?.post.channel;
      const teamName = useChannelStore
        .getState()
        .getChannelName(channelId as string);
      const postId = alert.like.post._id;

      navigate(`/fanpage/${teamName}/${channelId}/${postId}`);
    }
    if (alert.comment) {
      const channelId = alert.comment?.post.channel;
      const teamName = useChannelStore.getState().getChannelName(channelId);
      const postId = alert.comment?.post._id;

      navigate(`/fanpage/${teamName}/${channelId}/${postId}`);
    }
    if (alert.follow) {
      navigate(`/profile/${alert.author._id}/posts`);
    }
  };

  useEffect(() => {
    const allSeen = alerts.length > 0 && alerts.every((a) => a.seen);
    if (!allSeen) {
      seenNotifications();
    }
  }, [alerts]);
  return (
    <>
      <div className="w-86 h-auto pb-1.5 bg-white border border-gray-200 rounded-md ">
        <button>
          <MdClose
            onClick={onClose}
            className="absolute w-5 h-5 right-2 top-2 cursor-pointer"
          />
        </button>
        {alerts.length === 0 ? (
          <div className="mx-4">
            <p>새로운 알림이 없습니다.</p>
          </div>
        ) : (
          <div className="mx-4">
            {alerts
              .filter(
                (a) =>
                  a.author?._id !== myId &&
                  (a.message || a.follow || a.comment || a.like)
              )
              .slice(0, 6)
              .map((a) => (
                <div
                  key={a._id}
                  className={alertList}
                  onClick={() => handleAlertClick(a)}
                >
                  <div className="truncate pr-5">{getAlertMessage(a)}</div>
                  {!a.seen && (
                    <span className="absolute top-2.5 right-1 text-red-500 text-[8px]">
                      ●
                    </span>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
}
