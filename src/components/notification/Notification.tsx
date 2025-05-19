// import readAllImg from '../../assets/images/header/notifi.svg';
import { useNavigate } from 'react-router-dom';
import close from '../../assets/images/header/close.svg';
import closeWhite from '../../assets/images/header/close-white.svg';
import alarm from '../../assets/images/header/alarm.svg';
import alarmWhite from '../../assets/images/header/alarm-white.svg';
import redDot from '../../assets/images/header/red-dot-icon.svg';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getNotificationsData,
  putNotificationSeenData,
} from '../../api/notification/notification';
import { useChannelItemStore } from '../../stores/channelStore';
import { twMerge } from 'tailwind-merge';
import { useAuthStore } from '../../stores/authStore';
import { Theme } from '../../types/darkModeTypes';
import { dark } from '../../utils/darkModeUtils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import { getElapsedNotificationTime } from '../../utils/getDatetime';
dayjs.extend(relativeTime);
dayjs.locale('ko');

export default function Notification({ theme }: { theme: Theme }) {
  const { user } = useAuthStore();
  const { channels } = useChannelItemStore();
  const [notifiOpen, setNotifiOpen] = useState(false);

  const [originNotifications, setOriginNotifications] = useState<
    NotificationType[]
  >([]);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [countData, setCountData] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const userId = user?._id;

  const fetchNotifications = async () => {
    try {
      const result = await getNotificationsData();
      setOriginNotifications(result.data);
    } catch (error) {
      console.log('알림 데이터 요청 오류', error);
    }
  };

  const notificationHandler = useCallback(() => {
    // api에 가져오 실시간 값
    const originDatas: NotificationType[] = originNotifications;

    //sessionStorage에 값이 있으면 가져오는 값
    const sessionResult = sessionStorage.getItem(`notification-${userId}`);
    const sessionDatas: NotificationType[] =
      sessionResult && sessionResult !== '[]'
        ? JSON.parse(sessionResult)
        : originDatas;

    // 실시간 값과 session값 가져와서 비교해서 seen 값 변경
    originDatas.forEach((origin) => {
      const match = sessionDatas.find(
        (data) =>
          data._id === origin._id && data.seen != origin.seen && !origin.seen
      );
      if (match && !origin.seen) {
        origin.seen = match.seen;
      }
    });

    //filter링 및 정렬하기
    const filterResult = originDatas
      .filter(
        (d) =>
          ((d.like != null && d.like !== undefined) ||
            (d.comment != null && d.comment !== undefined) ||
            (d.follow != null && d.follow !== undefined)) &&
          d.author['_id'] !== userId &&
          dayjs(d.createdAt).isAfter(dayjs().subtract(2, 'day'))
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    setNotifications(filterResult);
  }, [userId, originNotifications]);
  // 알림 api 요청, 실시간 알림 감지를 위해 10초마다 요청
  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    notificationHandler();
  }, [originNotifications, notificationHandler]);
  // 개별 알림에 변화가 있으면 새로운 카운트
  useEffect(() => {
    setCountData(
      notifications.reduce((sum, n) => (!n.seen ? sum + 1 : sum), 0)
    );
  }, [notifications]);

  // 알림글 누르면 해당 포스트로 이동하는 navigate
  const navigateHandler = (notifi: NotificationType) => {
    // 클릭한 norifi의 seen 정보만 목록에서 갱신
    const update = notifications.map((notification) =>
      notification._id === notifi._id ? { ...notifi, seen: true } : notification
    );
    setNotifications(update);

    // 알림이 눌렸을때 개별 읽기 반영을 위해 sessionStorage 저장
    sessionStorage.setItem(`notification-${user?._id}`, JSON.stringify(update));
    closeModalHandler();

    channels.map((channel) => {
      if (notifi.like !== undefined) {
        if (channel.id === notifi.like['post']['channel']) {
          navigate(`${channel.to}/post/${notifi.like['post']['_id']}`);
        }
      } else if (notifi.comment !== undefined) {
        if (channel.id === notifi.comment['post']['channel']) {
          navigate(`${channel.to}/post/${notifi.comment['post']['_id']}`);
        }
      }
    });

    if (notifi.follow !== undefined && notifi.follow !== null) {
      console.log(notifi.follow);
      navigate('/profile', {
        state: { userid: notifi.follow.follower },
      });
    }
  };

  // 알림닫힘
  const closeModalHandler = () => {
    setNotifiOpen(false);
  };

  // 알림 전체확인 api 보내기
  const readHandler = async () => {
    await putNotificationSeenData();
    fetchNotifications();

    sessionStorage.setItem(
      `notification-${user?._id}`,
      JSON.stringify(notifications)
    );
  };

  // 알림 modal 외의 외부 영역 누르면 모달이 닫히도록
  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        closeModalHandler();
      }
    };
    window.addEventListener('mousedown', clickHandler);
    return () => window.removeEventListener('mousedown', clickHandler);
  }, [modalRef]);

  return (
    <>
      <button
        className='relative cursor-pointer block'
        onClick={(e) => {
          e.preventDefault();
          setNotifiOpen(!notifiOpen);
        }}
      >
        <img src={dark(theme) ? alarmWhite : alarm} />
        {countData > 0 && (
          <span className='block w-3.5 h-3.5 rounded-2xl bg-[#FF0000] absolute -right-1 top-0 text-[11px] text-white leading-3'>
            {countData}
          </span>
        )}
      </button>
      {notifiOpen && (
        <div
          ref={modalRef}
          className={`absolute gap-3 rounded-[10px] py-4 px-5 shadow-md w-[360px] border  z-10 -right-5 top-8.5 ${
            dark(theme)
              ? 'bg-[#2d2d2d] text-[#ffffff] border-[#4a4a4a]'
              : 'bg-[#ffffff] text-[#111111] border-[#eee]'
          }`}
        >
          <span
            className={`w-[12px] h-[12px] rounded-[2px] absolute rotate-135 -top-1.5 right-6 -z-2 border-b border-l  ${
              dark(theme)
                ? 'bg-[#2d2d2d] border-[#4a4a4a]'
                : 'bg-[#ffffff] border-[#eee]'
            }`}
          ></span>
          <div
            className={`border-b  flex justify-between pb-3 ${
              dark(theme) ? 'border-[#484848]' : 'border-[#cccccc]'
            }`}
          >
            <h3
              className={`text-[#4D4D4D] text-base font-medium flex items-end gap-x-2 ${
                dark(theme) ? 'text-[#ffffff]' : 'text-[#4D4D4D]'
              }`}
            >
              Notifications
            </h3>
          </div>
          <div
            className={`scroll-custom ${
              dark(theme) ? 'dark-scroll-custom' : ''
            } notiList py-1 px-2 h-[200px] overflow-y-auto relative`}
          >
            {notifications.length === 0 ? (
              <p
                className={`absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-sm ${
                  dark(theme) ? 'text-[#acacaa]' : ''
                }`}
              >
                알림이 없습니다.
              </p>
            ) : (
              notifications.map((notifi) => {
                return (
                  <div
                    key={notifi._id}
                    className='w-full flex justify-between items-start py-2.5'
                  >
                    <button
                      onClick={() => {
                        navigateHandler(notifi);
                      }}
                      className='block relative pl-3.5 text-[13px] cursor-pointer text-left leading-4'
                    >
                      <img
                        className={twMerge(
                          'absolute -left-0.5 top-2',
                          notifi.seen ? 'opacity-40 grayscale' : 'opacity-100'
                        )}
                        src={redDot}
                      />
                      {notifi.like !== undefined &&
                        `[${notifi.author['fullName']}] 님이 당신의 게시물을 좋아합니다.`}
                      {notifi.comment !== undefined &&
                        `[${notifi.author['fullName']}] 님이 당신의 게시물에 댓글을 달았습니다.`}
                      {notifi.follow !== undefined &&
                        `[${notifi.author['fullName']}] 님이 당신을 팔로우 합니다.`}
                    </button>

                    <span className='w-12 text-[11px] text-zinc-400 shrink-0 text-right whitespace-nowrap -mt-[1px]'>
                      {/* {dayjs(notifi.createdAt).fromNow()} */}
                      {getElapsedNotificationTime(notifi.createdAt)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
          <div
            className={`text-right border-t ${
              dark(theme) ? 'border-[#484848]' : 'border-[#cccccc]'
            }`}
          >
            <button
              className='text-xs text-zinc-500 cursor-pointer'
              onClick={readHandler}
            >
              전체읽기
            </button>
          </div>
          <div className='absolute right-5 top-4'>
            <button
              className='text-sm text-[#bbbbbb] cursor-pointer'
              onClick={() => {
                closeModalHandler();
              }}
            >
              <img
                src={dark(theme) ? closeWhite : close}
                className='opacity-60'
              />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
