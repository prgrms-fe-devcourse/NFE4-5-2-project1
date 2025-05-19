import { useEffect, useState, useTransition } from "react";
import { Post } from "../../types/postType";
import Threads from "../FanPage/Threads";
import { useParams } from "react-router";
import { refreshStore } from "../../stores/refreshStore";
import EmptyContent from "./EmptyContent";
import { userStore } from "../../stores/userStore";
import { getAuthorPosts } from "../../api/posts";

export default function MyThreadsList() {
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [, startTransition] = useTransition();
  const params = useParams();
  const refresh = refreshStore((state) => state.refresh);
  const loginUserId = userStore((state) => state.getUser()?._id);

  const getHandler = async () => {
    try {
      const data = await getAuthorPosts(params.id ?? "");
      setMyPosts(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    startTransition(async () => {
      await getHandler();
    });
  }, [refresh, params.id]);

  return (
    <div className="flex flex-col gap-6 mb-[40px]">
      {/* 피드들 */}
      {myPosts.length > 0 ? (
        myPosts?.map((post) => {
          let postTitle = "";
          let postContent = "";

          try {
            const parsedTitle = JSON.parse(post.title);
            postTitle = parsedTitle[0].postTitle;
            postContent = parsedTitle[0].postContent;
          } catch (e) {
            console.error("파싱실패", e);
          }

          const likeChecked = post.likes.some(
            (like) => like.user === loginUserId
          );

          return (
            <Threads
              key={post._id}
              postId={post._id}
              username={post.author?.username || "익명의 유저"}
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
              isMyThread={true}
              channelId={post.channel._id}
            />
          );
        })
      ) : (
        <div className="h-[550px] border border-[#d9d9d9] dark:border-[#4c4c4c] shadow-md px-[27px] rounded-[10px] flex justify-center">
          <EmptyContent message="게시물을 작성해보세요"></EmptyContent>
        </div>
      )}
    </div>
  );
}
