import { FaUserCircle } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import useGetUser from "./useGetUser";
import { createNotification } from "../../api/notification";
import { refreshStore } from "../../stores/refreshStore";
import { Link } from "react-router";
import { userStore } from "../../stores/userStore";
import { follow, unfollow } from "../../api/follow";

export default function FollowCard({ followId }: { followId: string }) {
  const { user: userDetails, isLoading } = useGetUser(followId);
  const loginUserId = userStore((state) => state.getUser()?._id);
  const refetch = refreshStore((state) => state.refetch);

  if (isLoading) {
    return (
      <div className="flex items-center border border-gray-200 rounded-[10px] shadow-sm animate-pulse w-[470px] h-[63px] justify-between px-[13px] my-[5px] dark:border-gray-700">
        <FaUserCircle className="w-[34px] h-[34px] text-gray-200 dark:text-gray-700" />
        <div className="w-[170px] ml-[10px] h-2.5 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        <div className="w-[100px] h-[24px] bg-gray-200 rounded-full dark:bg-gray-700"></div>
        <div className="w-[100px] h-[24px] bg-gray-200 rounded-full dark:bg-gray-700"></div>

        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  const following = userDetails?.followers.find(
    (follow) => follow.follower === loginUserId
  );

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
      const data = await follow(followId);

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

  return (
    <div className="flex items-center border border-[#335CB3] dark:border-[#4c4c4c] rounded-[10px] w-[470px] h-[63px] justify-between px-[13px] my-[5px]">
      <Link
        to={`/profile/${userDetails?._id}/posts`}
        className="flex items-center"
      >
        <div className="relative w-[34px] h-[34px]">
          {userDetails?.image ? (
            <img
              src={userDetails?.image}
              alt="profile image"
              className="absolute w-full h-full rounded-full object-cover"
            />
          ) : (
            <FaUserCircle className="absolute w-full h-full fill-[#2F6BEB] dark:fill-[#FFFFFF]" />
          )}

          <div
            className={twMerge(
              "absolute w-[8px] h-[8px] right-[1px] rounded-[100px] bg-[#00FF1E] dark:border dark:border-[#0033A0]",
              !userDetails?.isOnline && "hidden"
            )}
          />
        </div>
        <div className="text-[16px] text-[#6D6D6D] dark:text-[#FFFFFF] w-[170px] ml-[10px]">
          {userDetails?.username || "익명의 유저"}
        </div>
      </Link>

      <Link
        to={`/message/${userDetails?._id}`}
        state={{ selectedUser: userDetails }}
      >
        <button
          className={twMerge(
            "w-[100px] h-[24px] text-[14px] rounded-[10px] bg-[#0033A0] dark:bg-[#2F6BEB] text-[#ffffff] cursor-pointer",
            followId === loginUserId && "hidden"
          )}
        >
          쪽지 보내기
        </button>
      </Link>

      {following ? (
        <button
          className={twMerge(
            "w-[100px] h-[24px] text-[14px] rounded-[10px] bg-[#C5585F] text-[#ffffff] cursor-pointer",
            followId === loginUserId && "hidden"
          )}
          onClick={unfollowHandler}
        >
          팔로우 취소
        </button>
      ) : (
        <button
          className={twMerge(
            "w-[100px] h-[24px] text-[14px] rounded-[10px] bg-[#C5585F] text-[#ffffff] cursor-pointer",
            followId === loginUserId && "hidden"
          )}
          onClick={followHandler}
        >
          팔로우
        </button>
      )}
    </div>
  );
}
