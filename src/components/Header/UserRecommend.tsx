import { useEffect, useState } from "react";
import { ExtendedUser } from "../../types/postType";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router";
import { userStore } from "../../stores/userStore";
import { BaseUser } from "../../types/postType";
import { getUserInfo } from "../../api/user";
interface Props {
  onClose: () => void;
}
export default function UserRecommend({ onClose }: Props) {
  const [recommneds, setRecommends] = useState<ExtendedUser[]>([]);
  const user = userStore.getState().getUser();
  const isLoggedin = !!user && !!user._id;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserInfo();
        const filterResult = res.filter(
          (user: BaseUser) => user.role !== "SuperAdmin"
        );

        const randomUser = [...filterResult].sort(() => 0.5 - Math.random());

        setRecommends(randomUser.slice(0, 8));
      } catch (err) {
        console.error("추천 유저 불러오기 실패", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <h3 className="ml-5 text-sm text-[#2F6BEB] dark:text-gray-400 sm:mt-5">
        추천 유저
      </h3>
      {recommneds.map((user) => (
        <div
          key={user._id}
          className="user-card flex my-2 mx-6"
          onClick={() => {
            onClose();
          }}
        >
          {user.image ? (
            <img
              src={user.image}
              alt={user.username}
              className="w-8 h-8 mr-3 mt-2 rounded-3xl"
            />
          ) : (
            <div className="w-8 h-8 mt-1 mr-3 bg-gray-200 dark:white rounded-3xl ">
              <FaUser className="w-4 h-4 ml-2 items-center justify-center mt-2 dark:text-gray-600 text-[#2F6BEB]" />
            </div>
          )}

          <Link
            to={isLoggedin ? `/profile/${user._id}/posts` : "/login"}
            className="mt-2.5 text-sm cursor-pointer whitespace-nowrap dark:text-white"
          >
            {user.username ? user.username : "익명의 유저"}
          </Link>
        </div>
      ))}
    </>
  );
}
