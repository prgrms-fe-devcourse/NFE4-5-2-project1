import { axiosInstance } from "../apis/axiosInstance";

interface NotificationPayload {
  notificationType: "LIKE" | "COMMENT" | "FOLLOW" | "MESSAGE";
  notificationTypeId: string;
  userId: string;
  postId: string;
}

export const sendNotification = async ({
  notificationType,
  notificationTypeId,
  userId,
  postId,
}: NotificationPayload) => {
  try {
    await axiosInstance.post("/notifications/create", {
      notificationType,
      notificationTypeId,
      userId,
      postId,
    });
  } catch (e) {
    console.error("알림 전송 실패: ", e);
  }
};
