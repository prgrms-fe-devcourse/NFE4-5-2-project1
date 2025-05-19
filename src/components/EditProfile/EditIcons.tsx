import { useEffect, useRef, useState } from "react";
import { getNotifications } from "../../api/notification";
import { CgBell } from "react-icons/cg";
import { MdDarkMode, MdSearch, MdLightMode } from "react-icons/md";
import { useDarkMode } from "../../hooks/useDarkMode";

import NoticeBox from "../Header/NoticeBox";
import SearchBox from "../Header/SearchBox";
import { userStore } from "../../stores/userStore";
import { BaseUser, ExtendedUser } from "../../types/postType";

const iconDiv =
  "w-[30px] h-[30px] bg-white rounded-2xl relative flex justify-center items-center";
const iconStyle = "w-5 h-5 text-[#002779] cursor-pointer dark:text-[#16171B]";

export type Boxtype = "userMenu" | "notice" | "search" | null;

export type Alert = {
  _id: string;
  seen: boolean;
  author: {
    _id: string;
    username: string;
    fullname: string;
  };
  user: BaseUser;
  post: string;
  like?: {
    _id: string;
    user: string;
    post: {
      _id: string;
      channel: string;
    };
    createdAt: string;
    updatedAt: string;
  };
  comment?: {
    _id: string;
    author: string;
    post: {
      _id: string;
      channel: string;
    };
    createdAt: string;
    updatedAt: string;
  };
  follow?: boolean;
  username: ExtendedUser;
  message?: string;
};

export default function EditIcons() {
  const { isDark, toggleDarkMode } = useDarkMode();
  const [activeBox, setActiveBox] = useState<Boxtype>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const UnRead = alerts.some((a) => !a.seen);
  const isLoggedin = !!userStore.getState().getUser();

  const toggleBox = (type: "userMenu" | "notice" | "search" | null) => {
    setActiveBox((prev) => (prev === type ? null : type));
  };

  useEffect(() => {
    const mouseDownHandler = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setActiveBox(null);
      }
    };

    document.addEventListener("mousedown", mouseDownHandler);
    return () => {
      document.removeEventListener("mousedown", mouseDownHandler);
    };
  }, []);

  useEffect(() => {
    const fetchAlert = async () => {
      try {
        const res = await getNotifications();
        setAlerts(res);
      } catch (err) {
        console.error("알림 목록 불러오기 실패", err);
      }
    };
    fetchAlert();
  }, []);

  return (
    <>
      <div className="w-full flex justify-end gap-[7px] max-w-[650px] min-w-[500px]">
        <div className={iconDiv}>
          <MdSearch className={iconStyle} onClick={() => toggleBox("search")} />
          {activeBox === "search" && (
            <div className="absolute top-full z-[100]">
              {activeBox && <SearchBox onClose={() => toggleBox(null)} />}
            </div>
          )}
        </div>
        {isLoggedin && (
          <div className={iconDiv}>
            <CgBell className={iconStyle} onClick={() => toggleBox("notice")} />
            {UnRead && (
              <span className="absolute text-red-600 top-[-3px] right-[-1px] text-[9px]">
                ●
              </span>
            )}
            {activeBox === "notice" && (
              <div
                ref={boxRef}
                className="absolute top-full -left-38 mt-2 z-[100] "
              >
                {activeBox && (
                  <NoticeBox
                    onClose={() => toggleBox(null)}
                    alerts={alerts}
                    setAlerts={setAlerts}
                  />
                )}
              </div>
            )}
          </div>
        )}
        <div className={iconDiv}>
          {isDark ? (
            <MdLightMode className={iconStyle} onClick={toggleDarkMode} />
          ) : (
            <MdDarkMode className={iconStyle} onClick={toggleDarkMode} />
          )}
        </div>
      </div>
    </>
  );
}
