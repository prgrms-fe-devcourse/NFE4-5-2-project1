import { axiosInstance } from "../apis/axiosInstance";
import { getCurrentUserId } from "./auth";
import { sendNotification } from "./notification";

export const createComment = async ({
  comment,
  postId,
  postAuthorId,
}: {
  comment: string;
  postId: string;
  postAuthorId: string;
}): Promise<boolean> => {
  if (!comment.trim()) return false;

  try {
    const res = await axiosInstance.post("/comments/create", {
      comment,
      postId,
    });
    const createdComment = res.data;

    const currentUserId = await getCurrentUserId();
    if (postAuthorId && postAuthorId !== currentUserId) {
      await sendNotification({
        notificationType: "COMMENT",
        notificationTypeId: createdComment._id,
        userId: postAuthorId,
        postId,
      });
    }
    return true;
  } catch (e) {
    console.error("댓글 작성 실패", e);
    return false;
  }
};

export const deleteComment = async (commentId: string): Promise<boolean> => {
  try {
    await axiosInstance.delete("/comments/delete", {
      data: { id: commentId },
    });
    return true;
  } catch (e) {
    console.error("댓글 삭제 실패", e);
    return false;
  }
};
