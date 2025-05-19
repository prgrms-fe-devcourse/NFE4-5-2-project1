import { Calendar, Heart, MessageSquare, Type, UserRound } from "lucide-react";
import { useNavigate } from "react-router";
import { parseTitle } from "../../../utils/parseTitle";
import { Post } from "../types/Post";
import { parseUserName } from "../../../utils/parseUserName";
import { useEffect } from "react";

type CommunityTableProps = {
  posts: Post[];
};

export default function CommunityTable({ posts }: CommunityTableProps) {
  const navigate = useNavigate();

  useEffect(() => {
    console.log(posts);
  });

  const formatTime = (date: Date) => {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleClick = (post: Post) => {
    navigate(
      `/community/${
        post.channel._id === "681e2fdd7380bb759ecc636d"
          ? "concert-community"
          : "open-community"
      }/post/${post._id}`
    );
  };

  const getParsedUserName = (post: Post) => {
    if (!post.author) return "작성자 없음";

    return post.author.fullName
      ? parseUserName(post.author.fullName).name
      : "이름 없음";
  };

  return (
    <>
      <div className="w-full">
        <table className="w-full table-fixed">
          <thead className="border-b text-[color:var(--primary-300-50)] border-[color:var(--primary-300-50)]">
            <tr>
              <th className="p-4 w-[50%] text-left">
                <div className="flex items-center">
                  <Type className="w-[18px] h-[18px]" />
                </div>
              </th>
              <th className="w-[15%]">
                <div className="flex items-center justify-center">
                  <UserRound className="w-[18px] h-[18px]" />
                </div>
              </th>
              <th className="w-[10%]">
                <div className="flex items-center justify-center">
                  <MessageSquare className="w-[18px] h-[18px]" />
                </div>
              </th>
              <th className="w-[10%]">
                <div className="flex items-center justify-center">
                  <Heart className="w-[18px] h-[18px]" />
                </div>
              </th>
              <th className="w-[15%]">
                <div className="flex items-center justify-center">
                  <Calendar className="w-[18px] h-[18px]" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="text-[14px] font-extralight text-[color:var(--white-80)]">
            {posts.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-8 text-[color:var(--white-80)]"
                >
                  게시물이 없습니다.
                </td>
              </tr>
            ) : (
              posts.map((post) => {
                if (!post) return null;
                const parsedTitle = post.title
                  ? parseTitle(post.title)
                  : { title: "제목 없음" };
                return (
                  <tr
                    key={post._id}
                    className="cursor-pointer hover:text-[color:var(--primary-300)] text-[color:var(--white-95)]"
                    onClick={() => handleClick(post)}
                  >
                    <td className="text-left sm:p-2 md:p-4 font-normal text-[14px] sm:text-[15px] md:text-[16px]">
                      {parsedTitle.title}
                    </td>
                    <td className="text-center p-2 md:p-4 sm:text-[14px] md:text-[15px]">
                      {getParsedUserName(post)}
                    </td>
                    <td className="text-center p-2 md:p-4 sm:text-[14px] md:text-[15px]">
                      {post.comments.length}
                    </td>
                    <td className="text-center p-2 md:p-4 sm:text-[14px] md:text-[15px]">
                      {post.likes.length}
                    </td>
                    <td className="text-center p-2 md:p-4 text-[10px] sm:text-[12px] md:text-[14px]">
                      {formatTime(new Date(post.createdAt))}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
