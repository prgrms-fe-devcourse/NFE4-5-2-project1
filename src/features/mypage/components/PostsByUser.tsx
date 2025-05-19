import { Calendar, Heart, MessageSquare, Newspaper, Type } from "lucide-react";
import BackButton from "../../../components/common/BackButton";
import Hashtag from "../../../components/common/Hashtag";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { getPostsByUser } from "../../../apis/mypage/postsByUser";
import Pagination from "../../../components/common/Pagination";

export default function PostsByUser() {
  const hashtags = ["티켓팅 꿀팁 🎫", "콘서트 후기 ✍️"];

  const location = useLocation();
  const navigate = useNavigate();
  const authorId = location.state?.authorId;
  const userName = location.state?.username;

  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const limit = 10;

  interface Post {
    _id: string;
    title: string;
    author: {
      username: string;
    };
    comments: string[];
    likes: string[];
    createdAt: string;
    updatedAt: string;
    channel: {
      name: string;
    };
  }

  const getChannelPath = (name: string) => {
    switch (name) {
      case "ConcertCommunity":
        return "concert-community";
      case "OpenCommunity":
        return "open-community";
      default:
        return "unknown";
    }
  };

  const [allPosts, setAllPosts] = useState<Post[]>([]);

  const pagedPosts = useMemo(() => {
    const start = (currentPage - 1) * limit;
    const end = start + limit;
    return allPosts.slice(start, end);
  }, [allPosts, currentPage, limit]);

  useEffect(() => {
    if (!authorId) return;

    const fetchPosts = async () => {
      try {
        const res = await getPostsByUser(authorId);

        const parsed = res
          .map((post: Post) => ({
            ...post,
            title: JSON.parse(post.title).title,
          }))
          .filter((post: Post) => {
            const path = getChannelPath(post.channel.name);
            if (path === "unknown") {
              console.error("알 수 없는 채널:", post.channel.name);
              return false;
            }
            return true;
          });

        setAllPosts(parsed);
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
      }
    };

    fetchPosts();
  }, [authorId]);

  return (
    <div className="w-[80%] lg:w-[800px] xl:w-[1080px] min-h-screen text-[color:var(--white)] py-10 flex justify-center mx-auto mt-16 md:mt-0">
      <div className="mx-auto flex flex-col">
        <div className="w-full flex mb-4">
          <BackButton from={-1} />
        </div>

        <div className="w-full px-[18px]">
          <div className="w-full mt-4 flex flex-col gap-8">
            <p className="text-[30px] text-xl md:text-4xl font-semibold">
              {userName ? `${userName}님의 게시글` : "내 게시글"}
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

          <div className="mt-[20px] w-full pt-[40px] flex flex-col">
            <table className="w-full table-fixed">
              <thead className="border-b text-[color:var(--primary-300-50)]">
                <tr>
                  <th className="p-4 w-[50%] text-left">
                    <div className="flex items-center">
                      <Type className="w-[18px] h-[18px]" />
                    </div>
                  </th>
                  <th className="w-[14%]">
                    <div className="flex items-center justify-center">
                      <Newspaper className="w-[18px] h-[18px]" />
                    </div>
                  </th>
                  <th className="w-[9%]">
                    <div className="flex items-center justify-center">
                      <MessageSquare className="w-[18px] h-[18px]" />
                    </div>
                  </th>
                  <th className="w-[9%]">
                    <div className="flex items-center justify-center">
                      <Heart className="w-[18px] h-[18px]" />
                    </div>
                  </th>
                  <th className="w-[18%]">
                    <div className="flex items-center justify-center">
                      <Calendar className="w-[18px] h-[18px]" />
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="text-[14px] font-extralight text-[color:var(--white-80)]">
                {pagedPosts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-8 text-[color:var(--white-80)]"
                    >
                      게시물이 없습니다.
                    </td>
                  </tr>
                ) : (
                  pagedPosts.map((post) => (
                    <tr
                      key={post._id}
                      className="cursor-pointer hover:text-[color:var(--primary-300)] text-[color:var(--white-95)]"
                      onClick={() =>
                        navigate(
                          `/community/${getChannelPath(
                            post.channel.name
                          )}/post/${post._id}`
                        )
                      }
                    >
                      <td className="text-left p-4 font-normal text-[14px]">
                        {post.title}
                      </td>
                      <td className="text-center p-4">
                        {post.channel.name === "ConcertCommunity"
                          ? "콘서트 게시판"
                          : post.channel.name === "OpenCommunity"
                          ? "자유 게시판"
                          : "기타"}
                      </td>
                      <td className="text-center p-4">
                        {post.comments.length}
                      </td>
                      <td className="text-center p-4">{post.likes.length}</td>
                      <td className="text-center p-4">
                        {new Date(
                          post.updatedAt !== post.createdAt
                            ? post.updatedAt
                            : post.createdAt
                        ).toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {allPosts.length > 0 && (
              <div className="mt-10 flex justify-center">
                <Pagination cntPage={limit} totalCnt={allPosts.length} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
