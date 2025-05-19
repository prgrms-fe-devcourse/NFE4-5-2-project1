import { NavLink, useLocation } from "react-router";

export default function MainNav() {
  const location = useLocation();

  const isCommunityActive = location.pathname.startsWith("/community");

  return (
    <nav className="flex gap-12 items-center h-[68px]">
      <NavLink
        to="/upcoming-concerts"
        className={({ isActive }) =>
          `text-[14px] 2xl:text-[16px] ${
            isActive
              ? "text-[color:var(--primary-300)]"
              : "text-[color:var(--white)]"
          }`
        }
      >
        <span className="hidden xl:inline">UPCOMING CONCERTS</span>
        <span className="xl:hidden">CONCERTS</span>
      </NavLink>
      <NavLink
        to="/playlist"
        className={({ isActive }) =>
          `text-[14px] 2xl:text-[16px] ${
            isActive
              ? "text-[color:var(--primary-300)]"
              : "text-[color:var(--white)]"
          }`
        }
      >
        PLAYLIST
      </NavLink>
      <NavLink
        to="/community/bops-community"
        className={() =>
          `text-[14px] 2xl:text-[16px] ${
            isCommunityActive
              ? "text-[color:var(--primary-300)]"
              : "text-[color:var(--white)]"
          }`
        }
      >
        COMMUNITY
      </NavLink>
      <NavLink
        to="/aboutus"
        className={({ isActive }) =>
          `text-[14px] 2xl:text-[16px] ${
            isActive
              ? "text-[color:var(--primary-300)]"
              : "text-[color:var(--white)]"
          }`
        }
      >
        ABOUT US
      </NavLink>
    </nav>
  );
}
