import { useEffect, useRef, useState, useCallback } from "react";
import Threads from "./Threads";
import ThreadSkeleton from "./ThreadSkeleton";
import { Post } from "../../types/postType";
import { safeParsePost } from "../../utils/parsePost";
import { getChannelPosts } from "../../api/posts";

interface Props {
  channelId?: string;
  refresh: boolean;
  sortFn: (posts: Post[]) => Post[];
  userId?: string;
}

// 페이지네이션 제한
const LIMIT = 10;

export default function InfiniteScrollWrapper({
  channelId,
  refresh,
  sortFn,
  userId,
}: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const params = new URLSearchParams(location.search);
  const isSortPage = params.get("sort") === "like";

  const fetchPosts = useCallback(async () => {
    if (!channelId || loading) return;
    if (!isSortPage && !hasMore) return;

    setLoading(true);
    try {
      let res;

      if (isSortPage) {
        res = await getChannelPosts(channelId);
      } else {
        res = await getChannelPosts(channelId, LIMIT, offset);
      }

      const newPosts = res ?? [];
      setPosts((prev) => {
        const existingIds = new Set(prev.map((post) => post._id));
        const filtered = newPosts.filter(
          (post: Post) => !existingIds.has(post._id)
        );
        return [...prev, ...filtered];
      });

      if (!isSortPage) {
        setOffset((prev) => prev + LIMIT);
        if (newPosts.length < LIMIT) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error", err);
    } finally {
      setLoading(false);
    }
  }, [channelId, offset, hasMore, loading, isSortPage]);

  // 채널 변경, 새로고침 시 초기화
  useEffect(() => {
    if (!channelId) return;
    setPosts([]);
    setOffset(0);
    setHasMore(true);
  }, [channelId, isSortPage, refresh]);

  // 최초 데이터 요청
  useEffect(() => {
    if (isSortPage && posts.length === 0) {
      fetchPosts();
    }
  }, [fetchPosts, isSortPage, posts.length]);

  // 무한스크롤 감지 (정렬 페이지에서는 감지 안 함)
  useEffect(() => {
    const observerEl = observerRef.current;

    let observer: IntersectionObserver | null = null;

    if (isSortPage) {
      if (observerEl) {
        observer = new IntersectionObserver(() => {});
        observer.observe(observerEl);
        observer.disconnect();
      }
      return;
    }

    if (!observerEl || loading || !hasMore) return;

    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchPosts();
        }
      },
      { threshold: 1 }
    );

    observer.observe(observerEl);

    return () => {
      if (observerEl) observer?.unobserve(observerEl);
      observer?.disconnect();
    };
  }, [fetchPosts, hasMore, loading, isSortPage]);

  const sortedPosts = sortFn(posts);

  return (
    <>
      {sortedPosts.map((post) => {
        const { postTitle, postContent } = safeParsePost(post.title);
        const likeChecked = post.likes.some((like) => like.user === userId);

        return (
          <Threads
            key={post._id}
            postId={post._id}
            username={post.author.username ?? "익명의 유저"}
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
      })}

      {loading &&
        Array.from({ length: 3 }).map((_, idx) => <ThreadSkeleton key={idx} />)}

      {!isSortPage && <div ref={observerRef} className="h-10" />}
    </>
  );
}
