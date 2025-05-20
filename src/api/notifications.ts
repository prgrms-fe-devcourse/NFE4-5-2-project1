// src/api/notifications.ts
import api from "./index";

// 내 알림 목록
export const getNotifications = () => api.get("/notifications").then((res) => res.data);

// 읽음 처리
export const markNotificationsSeen = () => api.put("/notifications/seen").then((res) => res.data);

// 알림 생성
export const createNotification = (payload: {
  notificationType: "COMMENT" | "FOLLOW" | "LIKE" | "MESSAGE";
  notificationTypeId: string;
  userId: string;
  postId?: string | null;
}) => api.post("/notifications/create", payload).then((res) => res.data);
