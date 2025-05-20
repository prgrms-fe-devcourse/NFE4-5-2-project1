import { useEffect, useRef, useState } from 'react';
import {
  getNotifications,
  markNotificationsSeen,
} from '../../api/notifications';
import AlarmListItem from '../atoms/AlarmListItem';
import Icon from '../atoms/Icon';

export default function AlarmIcon() {
  const [ismodalOpen, setIsmodalOpen] = useState(false);
  const [alarms, setAlarms] = useState<Notification[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  const fetchAlarms = async () => {
    const res: Notification[] = await getNotifications();
    setAlarms(
      res
        ? res.filter(
            (alarm) =>
              !alarm.seen &&
              alarm.author !== null &&
              alarm.follow !== null &&
              alarm.like !== null &&
              alarm.comment !== null &&
              !alarm.message &&
              alarm.author._id !== localStorage.getItem('myId'),
          )
        : [],
    );
  };

  useEffect(() => {
    fetchAlarms();
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node))
        setIsmodalOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const deleteAlarms = async () => {
    await markNotificationsSeen();
    fetchAlarms();
  };

  return (
    <div className="relative inline-block" ref={modalRef}>
      <div className="relative mt-[5px]">
        <div className="duration-200 hover:scale-110 dark:contrast-75 dark:invert">
          <Icon
            size={40}
            name="alarmIcon"
            onClick={() => setIsmodalOpen(!ismodalOpen)}
          />
        </div>
        {alarms.length > 0 && (
          <>
            <div className="absolute top-0 right-0 h-[10px] w-[10px] animate-ping rounded-full bg-red-500" />
            <div className="absolute top-0 right-0 h-[10px] w-[10px] rounded-full bg-red-600" />
          </>
        )}
      </div>

      <div
        className={`dark:bg-dark-card dark:border-dark-border dark:text-dark-text absolute right-0 z-50 mt-2 max-h-[400px] w-[300px] cursor-default rounded-md border border-[#d9d9d9] bg-white shadow-md duration-200 ${ismodalOpen ? 'visible' : 'invisible scale-95 opacity-0'} `}
      >
        <div className="mx-[15px] my-[5px] flex h-[50px] items-center justify-between border-b border-[#d9d9d9] px-[5px]">
          <span className="nanum-gothic-bold">알림</span>
          <button
            className="cursor-pointer text-sm duration-300 hover:text-[#4b4744]"
            onClick={deleteAlarms}
          >
            알림 읽기
          </button>
        </div>
        <div
          className="max-h-[330px] overflow-y-auto pr-[5px] pl-[20px]"
          style={{ scrollbarGutter: 'stable' }}
        >
          {alarms.length !== 0 ? (
            alarms.map((alarm) => (
              <AlarmListItem key={alarm._id} alarm={alarm} />
            ))
          ) : (
            <p className="nanum-gothic-regular mt-[10px] mb-[15px] text-sm text-[#ababab]">
              앗! 받은 알림이 없어요!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
