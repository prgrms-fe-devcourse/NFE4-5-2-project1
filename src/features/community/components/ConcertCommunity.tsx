import CommunityTable from "./CommunityTable";
import CommunityPage from "./CommunityPage";
import { useChannelId } from "../../../hooks/useChannelId";
import Hashtag from "../../../components/common/Hashtag";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

export default function ConcertCommunity() {
  const { channelId, loading } = useChannelId("ConcertCommunity");

  const hashtags = [
    "티켓팅 꿀팁 🎫",
    "콘서트 후기 ✍️",
    "좌석 시야 🏟️",
    "콘서트 동행 👯‍♀️",
  ];

  if (loading)
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  if (!channelId) return <p>채널을 찾을 수 없습니다.</p>;
  return (
    <div className="px-5">
      <div className="flex flex-col gap-8 mt-10">
        <p className="text-xl md:text-4xl font-semibold">
          궁금했던{" "}
          <span className="text-[color:var(--primary-300)]">내한 공연</span>{" "}
          후기와 꿀팁 대방출 🍯
        </p>
        <div className="flex gap-4 flex-wrap">
          {hashtags.map((tag, index) => (
            <Hashtag
              key={index}
              text={tag}
              variant={index % 2 ? "empty" : "filled"}
            />
          ))}
        </div>
      </div>
      <CommunityPage
        channelId={channelId}
        renderTable={(filteredPosts) => (
          <CommunityTable posts={filteredPosts} />
        )}
      />
    </div>
  );
}
