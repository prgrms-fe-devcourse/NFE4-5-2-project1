import { NavLink, Outlet, useParams } from "react-router";
import useGetUser from "../components/Profile/useGetUser";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { userStore } from "../stores/userStore";
import { refreshStore } from "../stores/refreshStore";
import { follow, unfollow } from "../api/follow";
import { createNotification } from "../api/notification";

export default function ProfileLayout() {
  const params = useParams();
  const { user, isLoading } = useGetUser(params.id!);
  const loginUserId = userStore((state) => state.getUser()?._id);
  const refetch = refreshStore((state) => state.refetch);

  const [isVisible, setIsVisible] = useState(false);

  // 스크롤 이벤트
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 최상단으로 스크롤 이동
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const unfollowHandler = async () => {
    try {
      await unfollow(following?._id ?? "");
      refetch();
    } catch (e) {
      console.error(e);
    }
  };

  const followHandler = async () => {
    try {
      const data = await follow(params.id ?? "");

      await createNotification({
        notificationType: "FOLLOW",
        notificationTypeId: data._id,
        userId: data.user,
        postId: null,
      });

      refetch();
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-[34px] w-full max-w-[1200px] mx-auto mt-[40px] animate-pulse min-h-[calc(100vh-190px)]">
        <div className="border border-[#D9D9D9] dark:border-[#4c4c4c] shadow-md rounded-[10px] lg:h-[200px] md:h-[154px] sm:h-[120px] flex items-center gap-[50px] justify-between lg:px-[110px] px-[80px]">
          <FaUserCircle className="w-[100px] h-[100px] text-gray-200 dark:text-gray-700" />
          <div>
            <div className="w-[200px] md:h-[24px] sm:h-[10px] bg-gray-200 rounded-full dark:bg-gray-700 mb-2"></div>
            <div className="lg:w-[580px] md:w-[420px] sm:w-[240px] md:h-[20px] sm:h-[9px] bg-gray-200 rounded-full dark:bg-gray-700 mt-[7px] md:mb-[14px] sm:mb-[5px]"></div>
            <div className="w-[100px] md:h-[22px] sm:h-[15px] rounded-[10px] bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div className="flex items-center justify-center lg:w-[100px] lg:h-[158px] md:w-[69px] md:h-[109px] bg-gray-300 rounded-sm sm:w-96 dark:bg-gray-700 md:flex sm:hidden">
            <svg
              className="w-10 h-10 text-gray-200 dark:text-gray-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 18"
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
            </svg>
          </div>
        </div>
        <Outlet></Outlet>
      </div>
    );
  }

  const following = user?.followers.find(
    (follow) => follow.follower === loginUserId
  );

  return (
    <div className="flex flex-col gap-[34px] w-full max-w-[1200px] mx-auto mt-[40px] min-h-[calc(100vh-190px)]">
      <div className="border border-[#D9D9D9] dark:border-[#4c4c4c] shadow-md rounded-[10px] lg:h-[200px] md:h-[154px] sm:h-[120px] grid grid-cols-4 items-center">
        <div className="">
          {user?.image ? (
            <img
              className="sm:h-[60px] md:h-[100px] lg:h-[123px] sm:w-[60px] md:w-[100px] lg:w-[123px] rounded-full object-cover m-auto"
              src={user?.image}
              alt="my profile"
            />
          ) : (
            <FaUserCircle className="w-[100px] h-[100px] fill-[#2F6BEB] dark:fill-[#FFFFFF] m-auto" />
          )}
        </div>

        <div className="col-span-2">
          <div className="lg:text-[24px] md:text-[21px] font-bold sm:text-[13px] mb-[12px]">
            {user?.username || "익명의 유저"}
          </div>
          <div className="flex flex-start w-[580px] lg:gap-[70px] md:gap-[40px] sm:gap-[40px] mt-[7px] md:mb-[14px] sm:mb-[5px]">
            <NavLink
              to="posts"
              className={({ isActive }) =>
                isActive
                  ? "text-[#FF9500]"
                  : "text-[#0033A0] dark:text-[#FFFFFF]"
              }
            >
              <button className="flex items-center cursor-pointer lg:text-[17px] md:text-[16px] sm:text-[9px]">
                <span className="lg:text-[20px] md:text-[18px] sm:text-[9px] font-bold md:mr-[10px] sm:mr-[6px]">
                  게시물
                </span>
                {user?.posts.length}
              </button>
            </NavLink>
            <NavLink
              to="follower"
              className={({ isActive }) =>
                isActive
                  ? "text-[#FF9500]"
                  : "text-[#0033A0] dark:text-[#FFFFFF]"
              }
            >
              <button className="flex items-center cursor-pointer lg:text-[17px] md:text-[16px] sm:text-[9px]">
                <span className="lg:text-[20px] md:text-[18px] sm:text-[9px] font-bold md:mr-[10px] sm:mr-[6px]">
                  팔로워
                </span>
                {user?.followers.length}
              </button>
            </NavLink>
            <NavLink
              to="following"
              className={({ isActive }) =>
                isActive
                  ? "text-[#FF9500]"
                  : "text-[#0033A0] dark:text-[#FFFFFF]"
              }
            >
              <button className="flex items-center cursor-pointer lg:text-[17px] md:text-[16px] sm:text-[9px]">
                <span className="lg:text-[20px] md:text-[18px] sm:text-[9px] font-bold md:mr-[10px] sm:mr-[6px]">
                  팔로잉
                </span>
                {user?.following.length}
              </button>
            </NavLink>
            {params.id && loginUserId === params.id ? (
              <NavLink
                to="/message"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#FF9500]"
                    : "text-[#0033A0] dark:text-[#FFFFFF]"
                }
              >
                <button className="flex items-center cursor-pointer lg:text-[17px] md:text-[16px] sm:text-[9px]">
                  <span className="lg:text-[20px] md:text-[18px] sm:text-[9px] font-bold md:mr-[10px] sm:mr-[6px]">
                    쪽지함
                  </span>
                </button>
              </NavLink>
            ) : (
              ""
            )}
          </div>
          {params.id && loginUserId === params.id ? (
            <NavLink to="/profile/edit">
              <button className="border border-[#D9D9D9] dark:border-[#4c4c4c] hover:dark:border-[#D6D6D6] rounded-[10px] py-[3px] px-[10px] md:text-[16px] sm:text-[9px] text-[#6D6D6D] dark:text-[#FFFFFF] hover:bg-[#0033A0] hover:text-[#ffffff] dark:hover:bg-[#235BD2] transition cursor-pointer">
                프로필 수정
              </button>
            </NavLink>
          ) : following ? (
            <button
              className="border border-[#D9D9D9] dark:border-[#4c4c4c] hover:dark:border-[#D6D6D6] rounded-[10px] py-[3px] px-[10px] md:text-[16px] sm:text-[9px] text-[#6D6D6D] dark:text-[#FFFFFF] hover:bg-[#0033A0] hover:text-[#ffffff] dark:hover:bg-[#235BD2] transition cursor-pointer"
              onClick={unfollowHandler}
            >
              팔로우 취소
            </button>
          ) : (
            <button
              className="border border-[#D9D9D9] dark:border-[#4c4c4c] hover:dark:border-[#D6D6D6] rounded-[10px] py-[3px] px-[10px] md:text-[16px] sm:text-[9px] text-[#6D6D6D] dark:text-[#FFFFFF] hover:bg-[#0033A0] hover:text-[#ffffff] dark:hover:bg-[#235BD2] transition cursor-pointer"
              onClick={followHandler}
            >
              팔로우
            </button>
          )}
        </div>
        <div className="">
          {user?.coverImage ? (
            <img
              className="sm:h-[60px] md:h-[100px] lg:h-[123px] opacity-80 md:block sm:hidden  m-auto object-cover"
              src={user?.coverImage}
              alt="구단 마스코트"
            />
          ) : (
            <div className="lg:w-[100px] md:w-[70px] md:block sm:hidden"></div>
          )}
        </div>
      </div>
      <Outlet></Outlet>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 md:bottom-10 md:right-20 p-3 bg-[#235bd2] text-white rounded-[10px] shadow-lg hover:bg-[#0033a0] transition-all cursor-pointer"
        >
          TOP
        </button>
      )}
    </div>
  );
}
