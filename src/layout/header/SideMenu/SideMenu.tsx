import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserInfo } from "../../../apis/playlist/userService";
import UserProfile from "./UserProfile";
import WelcomeSection from "./WelcomeSection";
import NavigationMenu from "./NavigationMenu";
import NotificationPanel from "./NotificationPanel";
import AuthButtons from "./AuthButtons";
import { useAuthStore } from "../../../stores/authStore";
import {
  getNotifications,
  markAllNotificationsAsSeen,
} from "../../../apis/alert/notificationService";
import ThemeToggle from "../../../components/common/ThemeToggle";

export default function SideMenu() {
  const [open, setOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserType>();
  const [parsedData, setParsedData] = useState<ParsedDataType>();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await getUserInfo();
        setUserInfo(data);
        if (data?.fullName) {
          setParsedData(JSON.parse(data.fullName));
        }
      } catch (error) {
        console.error("사용자 정보 가져오기 실패:", error);
      }
    };
    getUserData();
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!isLoggedIn) return;

      try {
        setIsLoadingNotifications(true);
        const data = await getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("알림 데이터 가져오기 실패:", error);
      } finally {
        setIsLoadingNotifications(false);
      }
    };

    if (isLoggedIn) {
      fetchNotifications();

      const intervalId = setInterval(fetchNotifications, 60000);
      return () => clearInterval(intervalId);
    }
  }, [isLoggedIn]);

  const toggleMenu = () => setOpen((prev) => !prev);

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);

    if (!showNotifications && isLoggedIn) {
      const fetchNewNotifications = async () => {
        try {
          setIsLoadingNotifications(true);
          const data = await getNotifications();
          setNotifications(data);
        } catch (error) {
          console.error("알림 데이터 가져오기 실패:", error);
        } finally {
          setIsLoadingNotifications(false);
        }
      };

      fetchNewNotifications();
    }
  };

  const handleMarkAllAsSeen = async () => {
    try {
      const success = await markAllNotificationsAsSeen();
      if (success) {
        const updated = await getNotifications();
        setNotifications(updated.filter((noti) => !noti.seen));
      }
    } catch (error) {
      console.error("알림 읽음 처리 실패:", error);
    }
  };

  const unseenCount = notifications.filter((noti) => !noti.seen).length;

  return (
    <>
      <Menu
        onClick={toggleMenu}
        className="md:hidden fixed top-9.5 right-5 z-50 text-[color:var(--white)] cursor-pointer"
        strokeWidth={1.5}
      />

      <aside
        className={`flex flex-col fixed top-0 right-0 h-full w-[320px] bg-[color:var(--grey-600)] shadow-lg z-50 transition-transform duration-300 transform ${
          open ? "translate-x-0" : "translate-x-full"
        } md:translate-x-0 md:static md:w-[20%] md:right-0`}
      >
        <div className="relative md:hidden">
          {!showNotifications && (
            <X
              onClick={toggleMenu}
              strokeWidth={1.5}
              className="absolute top-9.5 right-5 text-[color:var(--white)] cursor-pointer"
            />
          )}
        </div>

        <div className="flex flex-col h-full px-5 pt-23">
          {showNotifications ? (
            <NotificationPanel
              notifications={notifications}
              isLoading={isLoadingNotifications}
              onClose={toggleNotifications}
              onMarkAllAsSeen={handleMarkAllAsSeen}
              unseenCount={unseenCount}
              toggleMenu={toggleMenu}
            />
          ) : (
            <>
              {isLoggedIn ? (
                <UserProfile userInfo={userInfo} parsedData={parsedData} />
              ) : (
                <WelcomeSection />
              )}

              <NavigationMenu
                isLoggedIn={isLoggedIn}
                toggleMenu={toggleMenu}
                toggleNotifications={toggleNotifications}
                unseenCount={unseenCount}
              />
              <div className="flex flex-col items-center mt-auto gap-3">
                <ThemeToggle />
                <AuthButtons isLoggedIn={isLoggedIn} toggleMenu={toggleMenu} />
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
