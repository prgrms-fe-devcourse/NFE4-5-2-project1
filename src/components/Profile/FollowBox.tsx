import FollowCard from "./FollowCard";
import { LuUserCheck } from "react-icons/lu";
import useGetUser from "./useGetUser";
import { useParams } from "react-router";
import EmptyContent from "./EmptyContent";

export default function FollowBox({ isFollower }: { isFollower: boolean }) {
  const params = useParams();
  const { user } = useGetUser(params.id!);

  return (
    <div className="min-h-[550px] flex flex-col items-center p-[27px] rounded-[10px] border border-[#d9d9d9] dark:border-[#4c4c4c] shadow-md w-full max-w-[1200px] lg:px-[7%] md:px-[27%] mb-[40px]">
      <div className="flex items-center self-start text-[20px] font-bold mb-[20px]">
        <LuUserCheck size={26} className="mr-[11px]" />
        {isFollower ? "모든 팔로워" : "모든 팔로잉"}
      </div>
      <div className="grid lg:grid-cols-2 md:grid-cols-1 lg:gap-x-[100px] gap-y-[8px]">
        {isFollower ? (
          user?.followers && user?.followers.length > 0 ? (
            user?.followers.map((follow) => <FollowCard key={follow._id} followId={follow.follower} />)
          ) : (
            <div className="col-span-full flex justify-center items-center h-[400px]">
              <EmptyContent message="팔로워 목록이 비었습니다" />
            </div>
          )
        ) : user?.following && user?.following.length > 0 ? (
          user?.following.map((follow) => <FollowCard key={follow._id} followId={follow.user} />)
        ) : (
          <div className="col-span-full flex justify-center items-center h-[400px]">
            <EmptyContent message="팔로잉 목록이 비었습니다" />
          </div>
        )}
      </div>
    </div>
  );
}
