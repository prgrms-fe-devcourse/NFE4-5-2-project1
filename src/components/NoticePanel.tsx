import React, { useState, useEffect, useCallback } from 'react';
import { axiosInstance } from '../api/axios';
import profile from '../assets/images/profile.svg';
import { useDarkModeStore } from '../stores/darkModeStore';
import { useNotificationStore } from '../stores/notificationStore';
import { toast } from 'react-toastify';

interface NotificationUser {
  _id: string;
  fullName: string;
  image?: string;
}

interface NotificationPost {
  _id: string;
  title?: string;
}

interface NotificationLike {
  _id: string;
}

interface NotificationComment {
  _id: string;
  content?: string;
}

interface Notification {
  _id: string;
  seen: boolean;
  author: NotificationUser;
  user: NotificationUser;
  post?: NotificationPost;
  like?: NotificationLike;
  comment?: NotificationComment;
  notificationType?: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'MESSAGE';
  createdAt: string;
  updatedAt: string;
}

interface NoticePanelProps {
  onClose: () => void;
  isOpen?: boolean;
}

export default function NoticePanel({
  onClose,
  isOpen,
}: NoticePanelProps): React.ReactElement {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false); // 초기 로딩 false
  const [error, setError] = useState<string | null>(null);
  // const navigate = useNavigate(); // 페이지 이동 시 필요
  const { isDarkMode } = useDarkModeStore();
  const { setHasUnread } = useNotificationStore();

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<Notification[]>(
        '/notifications'
      );
      console.log('API Response Data:', JSON.stringify(response.data, null, 2));
      setNotifications(response.data);
    } catch (err: any) {
      console.error('알림 목록을 가져오는 데 실패했습니다:', err);
      setError(
        err.response?.data?.message ||
          err.message ||
          '알림을 불러올 수 없습니다.'
      );
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  // 알림 불러오기 이후, 안 읽은 알림이 있는지 확인
  useEffect(() => {
    const hasUnread = notifications.some((n) => !n.seen);
    setHasUnread(hasUnread);
  }, [notifications]);

  const handleMarkAllAsSeen = async () => {
    const hasUnseenNotifications = notifications.some((n) => !n.seen);
    if (!hasUnseenNotifications && notifications.length > 0) {
      return;
    }
    if (notifications.length === 0) {
      return;
    }

    try {
      await axiosInstance.put('/notifications/seen');
      // 프론트엔드 상태를 즉시 모두 읽음으로 변경
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) => ({ ...n, seen: true }))
      );
      setHasUnread(false);
    } catch (err) {
      toast.error('모든 알림을 읽음 처리하는 중 오류가 발생했습니다.');
    }
  };

  const getNotificationMessage = (notice: Notification): string => {
    const actor = notice.author;

    let message = `${actor?.fullName || '누군가'}님의 새로운 활동이 있습니다.`;

    if (notice.notificationType) {
      switch (notice.notificationType) {
        case 'LIKE':
          message = `${
            actor?.fullName || '누군가'
          }님이 회원님의 게시글을 좋아합니다.`;
          break;
        case 'COMMENT':
          const commentContent = notice.comment?.content;
          if (commentContent) {
            message = `${
              actor?.fullName || '누군가'
            }님이 댓글을 남겼습니다: "${commentContent.substring(0, 20)}${
              commentContent.length > 20 ? '...' : ''
            }"`;
          } else {
            message = `${
              actor?.fullName || '누군가'
            }님이 회원님의 게시글에 댓글을 남겼습니다.`;
          }
          break;
        case 'FOLLOW':
          message = `${
            actor?.fullName || '누군가'
          }님이 회원님을 팔로우하기 시작했습니다.`;
          break;
      }
    } else if (notice.like) {
      message = `${
        actor?.fullName || '누군가'
      }님이 회원님의 게시글을 좋아합니다.`;
    } else if (notice.comment) {
      const commentContent = notice.comment?.content;
      if (commentContent) {
        message = `${
          actor?.fullName || '누군가'
        }님이 댓글을 남겼습니다: "${commentContent.substring(0, 20)}${
          commentContent.length > 20 ? '...' : ''
        }"`;
      } else {
        message = `${
          actor?.fullName || '누군가'
        }님이 회원님의 게시글에 댓글을 남겼습니다.`;
      }
    }

    return message;
  };

  if (isOpen && loading && notifications.length === 0) {
    return (
      <div className="px-4 flex flex-col text-sm bg-[var(--color-notice-bg)] rounded-lg shadow-[4px_0_6px_rgba(0,0,0,0.15)] h-full w-[360px] items-center justify-center">
        <p className="text-[var(--color-notice-text)]">알림을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div
      className="px-4 flex flex-col text-sm bg-[var(--color-notice-bg)] shadow-md h-full w-[360px]"
      style={{ boxShadow: '4px 0 6px rgba(0, 0, 0, 0.15)' }}
    >
      <div className="flex justify-between items-center mb-2 pt-4">
        <h2 className="text-xl font-bold text-[var(--color-notice-text)]">
          알림
        </h2>
        {notifications.some((n) => !n.seen) && (
          <button
            onClick={handleMarkAllAsSeen}
            className="text-xs text-[var(--color-notice-text)] hover:text-blue-800 px-2 py-1 rounded"
          >
            모두 읽음
          </button>
        )}
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-2xl ml-2"
        >
          ✕
        </button>
      </div>

      {error && !loading && (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-red-500 px-4 text-center">{error}</p>
        </div>
      )}
      {!error && notifications.length === 0 && !loading && (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-center text-gray-500">새 알림이 없습니다.</p>
        </div>
      )}

      {!error && notifications.length > 0 && (
        <ul className="flex-grow overflow-y-auto space-y-1 pb-4 pt-2">
          {notifications.map((notice) => (
            <li
              key={notice._id}
              className={`flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer ${
                !notice.seen ? 'bg-sky-50' : 'bg-white'
              }`}
            >
              <img
                src={notice.author?.image || profile}
                alt={notice.author?.fullName || '알림 발생자'}
                className="w-10 h-10 rounded-full flex-shrink-0 mt-1 object-cover"
              />
              <div className="flex-grow text-xs">
                <p
                  className={`text-gray-800 leading-relaxed ${
                    !notice.seen ? 'font-semibold' : ''
                  }`}
                >
                  {getNotificationMessage(notice)}
                  {!notice.seen && (
                    <span className="inline-block w-2 h-2 bg-sky-500 rounded-full ml-2 align-middle"></span>
                  )}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">
                  {new Date(notice.createdAt).toLocaleDateString('ko-KR', {
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
