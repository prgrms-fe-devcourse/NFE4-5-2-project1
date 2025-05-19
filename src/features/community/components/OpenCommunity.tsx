import CommunityTable from "./CommunityTable";
import CommunityPage from "./CommunityPage";
import { useChannelId } from "../../../hooks/useChannelId";
import Hashtag from "../../../components/common/Hashtag";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

export default function OpenCommunity() {
  const { channelId, loading } = useChannelId("OpenCommunity");

  const hashtags = [
    "내 가수 자랑 😎",
    "이 노래 제목이 뭐죠? 🤔",
    "신곡 추천 🎶",
    "느좋 팝송 🎧️",
  ];

  if (loading)
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  if (!channelId) return <p>채널을 찾을 수 없습니다.</p>;

  return (
    <div className="px-5 h-full">
      <div className="flex flex-col gap-8 mt-10">
        <p className="text-xl md:text-4xl font-semibold">
          당신의{" "}
          <span className="text-[color:var(--primary-300)]">PlayList</span> 를
          채워줄 곳 ✨
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
