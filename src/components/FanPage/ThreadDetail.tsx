import Threads from "./Threads";
import { Post } from "../../types/postType";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { userStore } from "../../stores/userStore";
import ThreadSkeleton from "./ThreadSkeleton";
import { getChannelPosts } from "../../api/posts";

export default function ThreadDetail() {
  const { postId, channelId } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const userId = userStore.getState().getUser()?._id;
  const [isLoading, setIsLoading] = useState(true);

  const nav = useNavigate();

  window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    setIsLoading(true);
    const fetchPosts = async () => {
      try {
        const postRes = await getChannelPosts(channelId ?? "");
        setPosts(postRes);
      } catch (error) {
        console.log("로드실패", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [channelId]);

  const filterDetail = posts.filter((post) => post._id === postId);

  return (
    <div className="flex flex-col gap-6">
      {isLoading ? (
        <ThreadSkeleton />
      ) : filterDetail.length === 0 ? (
        <div className="border border-gray-300 dark:border-[#4c4c4c] rounded-lg p-4 mb-6 bg-white dark:bg-[#191A1E] shadow-sm text-center">
          <p className="mb-4 text-gray-700 dark:text-[#fff] font-semibold">
            삭제된 피드입니다.
          </p>
          <button
            onClick={() => nav("/")}
            className="px-4 py-2 bg-[#235bd2] text-white rounded-md hover:bg-[#0033A0] transition-all cursor-pointer"
          >
            홈으로 돌아가기 ~ 🎵
          </button>
        </div>
      ) : (
        filterDetail.map((post) => {
          let postTitle = "";
          let postContent = "";

          try {
            const parsedTitle = JSON.parse(post.title);
            postTitle = parsedTitle[0].postTitle;
            postContent = parsedTitle[0].postContent;
          } catch (e) {
            console.error("파싱실패", e);
          }

          const likeChecked = post.likes.some((like) => like.user === userId);

          return (
            <Threads
              key={post._id}
              postId={post._id}
              username={post.author?.username ?? post.author?.fullName}
              postUserId={post.author._id}
              author={post.author}
              title={postTitle}
              content={postContent}
              date={new Date(post.createdAt).toLocaleDateString()}
              channel={post.channel.name}
              images={post.image ?? ""}
              imagesPublicId={post.imagePublicId ?? null}
              likes={post.likes}
              comments={post.comments}
              likeChecked={likeChecked}
              channelId={post.channel._id}
            />
          );
        })
      )}
    </div>
  );
}
