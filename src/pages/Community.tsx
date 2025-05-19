import { NavLink, Outlet } from "react-router";
import { twMerge } from "tailwind-merge";

export default function Community() {
  return (
    <div className="w-[80%] lg:w-[800px] xl:w-[1080px] min-h-screen">
      <nav className="w-full grid grid-cols-3 mt-24 md:mt-6 text-center  py-4">
        <NavLink
          to="bops-community"
          className={({ isActive }) =>
            twMerge(
              "nav-underline py-4 text-[14px]",
              isActive
                ? "active text-[color:var(--primary-300)] text-[16px]"
                : "text-[color:var(--white-80)]"
            )
          }
        >
          숨어서 듣는 명곡
        </NavLink>
        <NavLink
          to="concert-community"
          className={({ isActive }) =>
            twMerge(
              "nav-underline py-4 text-[14px]",
              isActive
                ? "active text-[color:var(--primary-300)] text-[16px]"
                : "text-[color:var(--white-80)]"
            )
          }
        >
          콘서트 게시판
        </NavLink>
        <NavLink
          to="open-community"
          className={({ isActive }) =>
            twMerge(
              "nav-underline py-4 text-[14px]",
              isActive
                ? "active text-[color:var(--primary-300)] text-[16px]"
                : "text-[color:var(--white-80)]"
            )
          }
        >
          자유 게시판
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
