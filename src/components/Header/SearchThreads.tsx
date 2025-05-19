import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Channel, Post } from "../../types/postType";
import { useChannelStore } from "../../stores/channelStore";
type SearchThreadProps = {
  keyword: string;
  results: Post[];
  onClose: () => void;
};

type ParsedPost = {
  _id: string;
  channel: Channel;
  teamName: string;
  postTitle: string;
  postContent: string;
};

export default function SearchThreads({ keyword, results, onClose }: SearchThreadProps) {
  const [searchThreads, setSearchThreads] = useState<ParsedPost[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const allParsed: ParsedPost[] = [];

    for (const post of results) {
      try {
        if (typeof post.title === "string") {
          const parsed = JSON.parse(post.title);

          if (Array.isArray(parsed)) {
            parsed.forEach((item) => {
              allParsed.push({
                _id: post._id,
                channel: post.channel,
                postTitle: item.postTitle,
                postContent: item.postContent,
                teamName: post.channel.name ?? "undefined",
              });
            });
          }
        }
      } catch (err) {
        console.error("파싱 실패:", err);
      }
    }

    setSearchThreads(allParsed);
  }, [results]);

  return (
    <>
      <div className="mt-4">
        <div className="grid grid-cols-1 gap-3 p-4 max-h-[400px] overflow-y-auto">
          {keyword ? (
            searchThreads && searchThreads.length > 0 ? (
              searchThreads.map((post, idx) => {
                const channelId =
                  typeof post.channel === "string" ? post.channel : post.channel._id;
                const teamName = useChannelStore.getState().getChannelName(channelId);
                return (
                  <div
                    key={idx}
                    className="p-2 bg-white rounded-lg border border-gray-300 hover:shadow-sm hover:bg-gray-100 dark:bg-[#191A1E] dark:border-gray-700 dark:hover:bg-gray-600"
                    onClick={() => {
                      onClose();
                      navigate(`/fanpage/${teamName}/${channelId}/${post._id}`);
                    }}
                  >
                    <h4 className="ml-2 h-6 mt-0.5 text-sm whitespace-nowrap truncate dark:text-white cursor-pointer">
                      {post.postTitle ? post.postTitle : "제목 없음"}
                    </h4>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-400 mt-30">검색결과가 없습니다.</p>
            )
          ) : null}
        </div>
      </div>
    </>
  );
}
