import { Plus } from "lucide-react";
import BopCard from "./BopCard";
import usePostsByChannel from "../../../hooks/usePostsByChannel";
import Hashtag from "../../../components/common/Hashtag";
import { useMemo, useState } from "react";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import Pagination from "../../../components/common/Pagination";
import { useNavigate, useSearchParams } from "react-router";

type BopsCommunityProps = {
  channelId: string;
};

export default function BopsCommunityPage({ channelId }: BopsCommunityProps) {
  const navigate = useNavigate();
  const hashtags = ["숨듣명 🎵", "비트에 몸을 맡겨 🔥", "띵곡 추천 🖤"];
  const [currentVideo, setCurrentVideo] = useState<{
    postId: string;
    videoId: string;
  } | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [cntPage, setCntPage] = useState(12);
  const { posts, setPosts, loading } = usePostsByChannel(`${channelId}`);

  const currentPosts = useMemo(() => {
    if (!posts) return [];
    const indexOfLastPost = currentPage * cntPage;
    const indexOfFirstPost = indexOfLastPost - cntPage;
    return posts.slice(indexOfFirstPost, indexOfLastPost);
  }, [posts, currentPage, cntPage]);

  const setPagination = (newCntPage: number) => {
    if (newCntPage !== cntPage) {
      setCntPage(newCntPage);

      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", "1");
      setSearchParams(newParams);
    }
  };

  if (loading)
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  if (!channelId) return <p>채널을 찾을 수 없습니다.</p>;

  return (
    <>
      <div className="flex flex-col gap-8 w-full pb-20 px-5">
        <div className="flex w-full justify-between items-center">
          <div className="flex flex-col gap-8 mt-10 w-full">
            <p className="text-xl md:text-4xl font-semibold">
              여기는{" "}
              <span className="text-[color:var(--primary-300)]">
                숨겨진 명곡
              </span>
              들의 성지 🔮
            </p>
            <div className="w-full flex justify-between items-center pr-6">
              <div className="flex gap-4 flex-wrap">
                {hashtags.map((tag, index) => (
                  <Hashtag
                    key={index}
                    text={tag}
                    variant={index % 2 ? "empty" : "filled"}
                  />
                ))}
              </div>
              <Plus
                className="cursor-pointer text-[color:var(--white-80)]"
                onClick={() => navigate("add")}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 min-[600px]:grid-cols-2 min-[910px]:grid-cols-3 xl:grid-cols-4 gap-8 max-w-6xl min-w-1xl mx-auto w-full justify-items-center">
          {currentPosts.map((post) => (
            <BopCard
              key={post._id}
              post={post}
              currentVideo={currentVideo}
              setCurrentVideo={setCurrentVideo}
              onDelete={(deletedId) =>
                setPosts((prev) => prev.filter((p) => p._id !== deletedId))
              }
            />
          ))}
        </div>

        {posts && posts.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              cntPage={cntPage}
              totalCnt={posts.length}
              setPagination={setPagination}
            />
          </div>
        )}
      </div>
    </>
  );
}
