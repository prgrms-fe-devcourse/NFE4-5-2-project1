import { useEffect, useState } from "react";
import { getCurrentUserId } from "../../../utils/auth";
import { axiosInstance } from "../../../apis/axiosInstance";
import { Post } from "../types/Post";
import { sendNotification } from "../../../utils/notification";

export const useLike = (initialPost: Post | null) => {
  const [post, setPost] = useState<Post | null>(initialPost);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getCurrentUserId();
      setCurrentUserId(userId);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    setPost(initialPost);
  }, [initialPost]);

  const isLiked =
    currentUserId && Array.isArray(post?.likes)
      ? post.likes.some((like) => like.user === currentUserId)
      : false;

  const toggleLike = async () => {
    if (!post || !currentUserId) return;
    const userLike = post.likes.find((like) => like.user === currentUserId);

    try {
      if (userLike) {
        await axiosInstance.delete(`/likes/delete`, {
          data: { id: userLike._id },
        });
        setPost((prev) =>
          prev
            ? {
                ...prev,
                likes: prev.likes.filter((like) => like._id !== userLike._id),
              }
            : null
        );
      } else {
        const res = await axiosInstance.post(`/likes/create`, {
          postId: post._id,
          userId: currentUserId,
        });
        const newLike = res.data;
        setPost((prev) =>
          prev
            ? {
                ...prev,
                likes: [...prev.likes, newLike],
              }
            : null
        );

        if (post.author._id && post.author._id !== currentUserId) {
          await sendNotification({
            notificationType: "LIKE",
            notificationTypeId: newLike._id,
            userId: post.author._id,
            postId: post._id,
          });
        }
      }
    } catch (e) {
      console.error("좋아요 처리 중 오류 발생:", e);
    }
  };
  return { isLiked, toggleLike, likes: post?.likes || [] };
};
