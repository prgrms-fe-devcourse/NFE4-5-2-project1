import { useNavigate, NavLink } from "react-router";
import { useEffect, useState } from "react";
import bell from "../../assets/images/icon-bell.svg";
import bellLight from "../../assets/images/icon-bell-light.svg";
import bellActive from "../../assets/images/icon-bell-active.svg";
import bellActiveLight from "../../assets/images/icon-bell-active-light.svg";
import chat from "../../assets/images/icon-chat.svg";
import chatActive from "../../assets/images/icon-chat-active.svg";
import chatActiveLight from "../../assets/images/icon-chat-active-light.svg";
import chatLight from "../../assets/images/icon-chat-light.svg";
import { useAuthStore } from "../../stores/authStore";
import DropdownMenu from "../../components/common/DropdownMenu";
import { useNotificationModal } from "../../features/notification/hooks/useNotificationModal";
import NotificationList from "../../features/notification/components/NotificationList";
import { getCurrentTheme } from "../../utils/theme";
import { getUserInfo } from "../../apis/playlist/userService";
import popcon from "../../assets/images/icon_popcon1.svg";
import popconLight from "../../assets/images/icon_popcon6.svg";

export default function UserSection() {
  const { isShowNotifications, showNotifications, closeNotifications } =
    useNotificationModal();
  const { isLoggedIn } = useAuthStore();
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState(getCurrentTheme());
  const [user, setUser] = useState();

  useEffect(() => {
    const getUserData = async () => {
      const data = await getUserInfo();
      setUser(data.image);
    };
    getUserData();
  }, [isLoggedIn]);

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(getCurrentTheme());
    };

    document.addEventListener("themeChanged", handleThemeChange);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          setTheme(getCurrentTheme());
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      document.removeEventListener("themeChanged", handleThemeChange);
      observer.disconnect();
    };
  }, []);

  const menuItems = [
    {
      label: "마이페이지",
      onClick: () => {
        setIsOpen(false);
        navigate("/mypage");
      },
    },
    {
      label: "로그아웃",
      onClick: () => {
        setIsOpen(false);
        localStorage.removeItem("app_state");
        navigate("/");
        logout();
      },
      danger: true,
    },
  ];

  const getImageSrc = (
    darkImage: string,
    lightImage: string,
    activeImage: string,
    activeLightImage: string,
    isActive: boolean
  ) => {
    if (isActive && theme === "light") return activeLightImage;
    else if (isActive && theme === "dark") return activeImage;
    return theme === "light" ? lightImage : darkImage;
  };

  return (
    <>
      {!isLoggedIn ? (
        <div className="flex h-[68px] items-center gap-4">
          <button
            onClick={() => navigate("/SignupAgree")}
            className="px-5 py-1 border border-[color:var(--white)] hover:text-[color:var(--primary-100)] hover:border-[color:var(--primary-100)] rounded-[20px] text-[12px] 2xl:text-[14px] cursor-pointer"
          >
            회원가입
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-1 border border-[color:var(--white)] hover:text-[color:var(--primary-100)] hover:border-[color:var(--primary-100)] rounded-[20px] w-[84px] text-[12px] 2xl:text-[14px] cursor-pointer 2xl:w-[90px]"
          >
            로그인
          </button>
        </div>
      ) : (
        <div className="relative flex h-[68px] items-center gap-6">
          <NavLink to="/chat" state={{ from: location.pathname }}>
            {({ isActive }) => (
              <div className="w-4 h-4 2xl:w-4.5 2xl:h-4.5">
                <img
                  src={getImageSrc(
                    chat,
                    chatLight,
                    chatActive,
                    chatActiveLight,
                    isActive
                  )}
                  alt="채팅"
                  className="w-full h-full cursor-pointer"
                />
              </div>
            )}
          </NavLink>

          <div
            className="w-4.5 h-4.5 2xl:w-5 2xl:h-5"
            onClick={(e) => {
              e.stopPropagation();
              if (isShowNotifications) {
                closeNotifications();
              } else {
                showNotifications();
              }
            }}
          >
            <img
              src={getImageSrc(
                bell,
                bellLight,
                bellActive,
                bellActiveLight,
                isShowNotifications
              )}
              alt="알림함"
              className="w-6 h-6 cursor-pointer"
            />
            {isShowNotifications && (
              <NotificationList closeNotifications={closeNotifications} />
            )}
          </div>

          <div
            className="w-5.5 h-5.5 2xl:w-6 2xl:h-6"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="relative w-full">
              <img
                src={user ? user : theme === "dark" ? popcon : popconLight}
                alt="유저액션"
                className="w-6 h-6 cursor-pointer rounded-full"
              />

              <div className="mt-2">
                <DropdownMenu
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  menuItems={menuItems}
                  isToggle={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
