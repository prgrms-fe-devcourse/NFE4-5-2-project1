import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useChannelStore } from "../../stores/channelStore";
import { NewAndHotPost, Post } from "../../types/postType";
import { useNewAndHotPostStore } from "../../stores/newAndHotPostStore";

export default function ThreadRecommends({ onClose }: { onClose: () => void }) {
  const [recommends, setRecommends] = useState<Post[]>([]);
  const navigate = useNavigate();
  const RecommendsPostData = useNewAndHotPostStore((state: NewAndHotPost) => state.newPostList);

  useEffect(() => {
    const allParsed: Post[] = [];

    for (const post of RecommendsPostData) {
      try {
        if (typeof post.title === "string") {
          const parsed = JSON.parse(post.title);
          if (Array.isArray(parsed)) {
            allParsed.push(
              ...parsed.map((item) => ({
                ...item,
                _id: post._id,
                channel: post.channel,
              }))
            );
          }
        }
      } catch (err) {
        console.error("추천 게시글 파싱 실패", err);
      }
    }

    const random = allParsed.sort(() => Math.random() - 0.5).slice(0, 7);
    setRecommends(random);
  }, [RecommendsPostData]);

  return (
    <>
      <h3 className="ml-5 text-sm text-[#2F6BEB] dark:text-gray-400 sm:mt-5">추천 게시글</h3>
      <div className="grid grid-cols-1 gap-3 p-4 mt-2 h-[340px]">
        {recommends.map((post, idx) => {
          const channelId = typeof post.channel === "string" ? post.channel : post.channel._id;
          const teamName = useChannelStore.getState().getChannelName(channelId);
          return (
            <div
              key={idx}
              className="p-2 w-full h-10 bg-white rounded-lg border border-gray-300 hover:shadow-sm hover:bg-gray-100 dark:bg-[#191A1E] dark:border-gray-800 dark:hover:bg-gray-800"
              onClick={() => {
                navigate(`/fanpage/${teamName}/${channelId}/${post._id}`);
                onClose();
              }}
            >
              <div>
                <h4 className="ml-2 text-sm whitespace-nowrap truncate dark:text-white cursor-pointer">
                  {post.postTitle ? post.postTitle : "제목 없음"}
                </h4>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
