import {useNotification} from "../hooks/useNotification";
import NotificationItem from "./NotificationItem";
import {Bell} from "lucide-react";
import {readNotifications} from "../apis/readNotifications";
import {useEffect, useRef} from "react";
import {getNotification} from "../apis/getNotification";

type NotificationListProps = {
  closeNotifications: () => void;
};

export default function NotificationList({closeNotifications}: NotificationListProps) {
  const {notifications, setNotifications} = useNotification();
  const notificationListRef = useRef<HTMLDivElement | null>(null);
  const unseenCount = notifications.filter((noti) => !noti.seen).length;

  const updateNoti = async () => {
    try {
      await readNotifications();
      const updated = await getNotification();
      const unseenOnly = updated.filter((noti) => !noti.seen);
      setNotifications(unseenOnly);
    } catch (error) {
      console.error("알림 읽음 처리 실패:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationListRef.current && !notificationListRef.current.contains(e.target as Node)) {
        closeNotifications();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [closeNotifications]);

  return (
    <div className='absolute z-[9999] flex justify-center items-center top-[100%] right-[-3px] mt-[-5px]'>
      <div
        ref={notificationListRef}
        className='p-4 rounded-[20px] w-[320px] h-[320px] bg-[color:var(--grey-600)] shadow-md overflow-y-auto scrollbar-hide'
        onClick={(e) => e.stopPropagation()} // 알림창 내부 클릭 시 닫히지 않도록
      >
        <div className='flex justify-between items-center mx-2 my-3'>
          <h2 className='font-semibold text-[18px] h-[21px]'>Notification</h2>
          {unseenCount > 0 && (
            <p className='text-[var(--white-80)] cursor-pointer text-[10px] ' onClick={updateNoti}>
              전체 삭제
            </p>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className='w-full h-full flex flex-col justify-center items-center mt-[-25px]'>
            <Bell strokeWidth={1.5} className='text-[color:var(--white-80)]' />
            <p className='pt-[10px] text-xs text-center text-[color:var(--white-80)]'>
              No Notification
            </p>
          </div>
        ) : (
          <ul className='space-y-2'>
            {notifications.map((noti) => (
              <NotificationItem
                key={noti._id}
                noti={noti}
                updateNotifications={updateNoti}
                closeNotifications={closeNotifications}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
