import { Bell, Calendar, Globe, Headphones, User, Users } from "lucide-react";
import { NavigateOptions, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import chat from "../../../assets/images/icon-chat.svg";
import { getCurrentTheme } from "../../../utils/theme";

export default function NavigationMenu({
  isLoggedIn,
  toggleMenu,
  toggleNotifications,
  unseenCount,
}: NavigationMenuProps) {
  const navigate = useNavigate();

  const handleNavigation = (path: string, state?: { from: string }) => {
    const options: NavigateOptions | undefined = state ? { state } : undefined;
    navigate(path, options);
    toggleMenu();
  };

  return (
    <div className="flex flex-col gap-6 py-6">
      {isLoggedIn && (
        <UserNavItems
          handleNavigation={handleNavigation}
          toggleNotifications={toggleNotifications}
          unseenCount={unseenCount}
        />
      )}

      <h2 className="text-[14px] font-medium text-[color:var(--white)]">
        Menu
      </h2>

      <MenuItems isLoggedIn={isLoggedIn} handleNavigation={handleNavigation} />
    </div>
  );
}

function UserNavItems({
  handleNavigation,
  toggleNotifications,
  unseenCount,
}: NavItemsProps) {
  const location = useLocation();
  const [theme, setTheme] = useState(getCurrentTheme());
  
  useEffect(() => {
    setTheme(getCurrentTheme());
    const handleThemeChange = () => {
      setTheme(getCurrentTheme());
    };
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        handleThemeChange();
      });
    });
    
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <nav className="flex flex-col gap-2 text-lg">
      <button
        className="text-left flex gap-4 cursor-pointer hover:bg-[color:var(--grey-500)] py-1.5 px-3 rounded-lg items-center"
        onClick={() => handleNavigation("/chat", { from: location.pathname })}
      >
        <img
          src={chat}
          alt="메시지"
          className={`w-4 ${theme === "light" ? "invert" : ""}`}
        />
        <p className="text-[14px]">Chat</p>
      </button>

      <button
        className="text-left flex gap-4 cursor-pointer hover:bg-[color:var(--grey-500)] py-1.5 px-3 rounded-lg items-center relative"
        onClick={toggleNotifications}
      >
        <div className="relative">
          <Bell className="w-[18px]" strokeWidth={1.5} />
          {unseenCount > 0 && (
            <div className="absolute top-1 right-1 h-1 w-1 bg-[color:var(--red)] rounded-full"></div>
          )}
        </div>
        <p className="text-[14px]">Notification</p>
      </button>

      <button
        className="text-left flex gap-4 cursor-pointer hover:bg-[color:var(--grey-500)] py-1.5 px-3 rounded-lg items-center"
        onClick={() => handleNavigation("/mypage")}
      >
        <User className="w-[18px]" strokeWidth={1.5} />
        <p className="text-[14px]">My Page</p>
      </button>
    </nav>
  );
}

function MenuItems({ isLoggedIn, handleNavigation }: MenuItemsProps) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <button
          className="text-left flex text-[14px] gap-4 cursor-pointer hover:bg-[color:var(--grey-500)] py-1.5 px-3 rounded-lg items-center"
          onClick={() => handleNavigation("/upcoming-concerts")}
        >
          <Calendar className="w-[18px] " strokeWidth={1.5} />
          <p>Upcoming Concert</p>
        </button>
        {isLoggedIn ? (
          <button
            className="text-left flex text-[14px] gap-4 cursor-pointer hover:bg-[color:var(--grey-500)] py-1.5 px-3 rounded-lg items-center"
            onClick={() => handleNavigation("/playlist")}
          >
            <Headphones className="w-[18px]" strokeWidth={1.5} />
            <p>Playlist</p>
          </button>
        ) : (
          <button
            className="text-left flex text-[14px] gap-4 cursor-pointer hover:bg-[color:var(--grey-500)] py-1.5 px-3 rounded-lg items-center"
            onClick={() => handleNavigation("/login")}
          >
            <Headphones className="w-[18px]" strokeWidth={1.5} />
            <p>Playlist</p>
          </button>
        )}
        <button
          className="text-left flex text-[14px] gap-4 cursor-pointer hover:bg-[color:var(--grey-500)] py-1.5 px-3 rounded-lg items-center"
          onClick={() => handleNavigation("/community")}
        >
          <Globe className="w-[18px]" strokeWidth={1.5} />
          <p>Community</p>
        </button>
        <button
          className="text-left flex text-[14px] gap-4 cursor-pointer hover:bg-[color:var(--grey-500)] py-1.5 px-3 rounded-lg items-center"
          onClick={() => handleNavigation("/aboutus")}
        >
          <Users className="w-[18px]" strokeWidth={1.5} />
          <p>About Us</p>
        </button>
      </div>
    </>
  );
}