import { FaUserCircle } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import { ExtendedUser } from "../../types/postType";
import { refreshStore } from "../../stores/refreshStore";
import useGetUser from "../Profile/useGetUser";
import { Link } from "react-router";
import { createNotification } from "../../api/notification";
import { follow, unfollow } from "../../api/follow";

interface ProfileCardProps {
  loginUserId: string;
  author: ExtendedUser;
}

export default function SimpleProfileCard({
  loginUserId,
  author,
}: ProfileCardProps) {
  // const [activeTab, setActiveTab] = useState("posts");
  const refetch = refreshStore((state) => state.refetch);
  const { user: authorDetails, isLoading } = useGetUser(author._id);

  const stats = [
    { id: "posts", label: "게시물", count: author.posts.length },
    { id: "followers", label: "팔로워", count: author.followers.length },
    { id: "following", label: "팔로잉", count: author.following.length },
  ];

  const following = authorDetails?.followers.find(
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
      const data = await follow(author._id);

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

  const navigateHandler = () => {
    window.scrollTo(0, 0);
  };

  if (isLoading) {
    return (
      <div className="w-[320px] bg-[#F5F5F5] dark:bg-gray-900 mx-auto shadow-md animate-pulse rounded-[10px] border-2 border-[#d9d9d9] p-4 flex items-center gap-10 dark:border-gray-700">
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center justify-center">
            <FaUserCircle className="w-[60px] h-[60px] text-gray-200 dark:text-gray-700" />
          </div>
          <div className="w-[70px] h-[12px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div className="flex flex-col flex-grow gap-2">
          <div className="w-[120px] h-[12px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="w-full h-[20px] bg-gray-200 rounded-[6px] dark:bg-gray-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[320px] bg-[#F5F5F5] dark:bg-gray-900 mx-auto shadow-md rounded-[10px] border-2 border-[#d9d9d9] p-4 flex items-center gap-6">
      {/* 프로필 이미지 */}
      <Link to={`/profile/${author._id}/posts`} onClick={navigateHandler}>
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center justify-center">
            {author.image ? (
              <div className="relative w-[60px] h-[60px]">
                <img
                  src={author.image}
                  alt="profile"
                  className="w-full h-full rounded-full object-cover"
                />
                <div
                  className={twMerge(
                    "absolute w-[9px] h-[9px] right-[1px] top-[5px] rounded-[100px] bg-[#00FF1E] dark:border dark:border-[#0033A0]",
                    !author.isOnline && "hidden"
                  )}
                />
              </div>
            ) : (
              <div className="relative w-[60px] h-[60px]">
                <FaUserCircle className="absolute w-full h-full fill-[#2F6BEB] dark:fill-[#FFFFFF]" />
                <div
                  className={twMerge(
                    "absolute w-[9px] h-[9px] right-[3px] top-[5px] rounded-[100px] bg-[#00FF1E] dark:border dark:border-[#0033A0]",
                    !author.isOnline && "hidden"
                  )}
                />
              </div>
            )}
          </div>
          <div className="text-[12px] text-center font-bold w-[70px] truncate">
            {author.username || "익명의 유저"}
          </div>
        </div>
      </Link>

      {/* 사용자 정보 */}
      <div className="flex flex-col flex-grow gap-2">
        {/* 통계 정보 */}
        <div className="flex gap-3 text-[12px]">
          {stats.map(({ id, label, count }) => (
            <span
              key={id}
              className="dark:text-white"
              // onClick={() => setActiveTab(id)}
              // className={`font-semibold ${activeTab === id ? "text-[#FF8A00]" : `text-[#0033a0] dark:text-white`}`}
            >
              {label} {count}
            </span>
          ))}
        </div>

        {author._id === loginUserId ? (
          <Link to={`/profile/${loginUserId}/posts`} onClick={navigateHandler}>
            <button className="w-full px-4 py-1 rounded-[6px] border bg-[#fff] border-[#d6d6d6] text-[12px] text-[#333] hover:bg-[#0033a0] dark:hover:bg-[#235BD2] hover:text-[#fff] transition cursor-pointer">
              내 프로필 가기
            </button>
          </Link>
        ) : following ? (
          <button
            className="px-4 py-1 rounded-[6px] border bg-[#fff] border-[#d6d6d6] text-[12px] text-[#333] hover:bg-[#0033a0] dark:hover:bg-[#235BD2] hover:text-[#fff] transition cursor-pointer"
            onClick={unfollowHandler}
          >
            팔로우 취소
          </button>
        ) : (
          <button
            className="px-4 py-1 rounded-[6px] border bg-[#fff] border-[#d6d6d6] text-[12px] text-[#333] hover:bg-[#0033a0] dark:hover:bg-[#235BD2] hover:text-[#fff] transition cursor-pointer"
            onClick={followHandler}
          >
            팔로우
          </button>
        )}
      </div>
    </div>
  );
}
