import { axiosInstance } from "./axiosInstance";

interface NotificationType {
  notificationType: "COMMENT" | "FOLLOW" | "LIKE" | "MESSAGE";
  notificationTypeId: string;
  userId: string;
  postId: string | null;
}

const getNotifications = async () => {
  try {
    const response = await axiosInstance.get("/notifications");
    return response.data;
  } catch (error) {
    console.error("알림 목록 불러오기 실패", error);
  }
};

const createNotification = async (notification: NotificationType) => {
  try {
    const response = await axiosInstance.post(
      "/notifications/create",
      notification
    );
    return response.data;
  } catch (error) {
    console.error("알림 생성 실패", error);
  }
};

const seenNotifications = async () => {
  try {
    const response = await axiosInstance.put("/notifications/seen");
    return response.data;
  } catch (error) {
    console.error("알림 읽음 실패", error);
  }
};

export { getNotifications, createNotification, seenNotifications };
