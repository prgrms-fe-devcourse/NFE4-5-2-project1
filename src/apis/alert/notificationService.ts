import { axiosInstance } from "../axiosInstance";

export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await axiosInstance.get("/notifications");
    return response.data;
  } catch (error) {
    console.error("알림 가져오기 실패:", error);
    return [];
  }
};

export const markAllNotificationsAsSeen = async () => {
  try {
    const res = await axiosInstance.put("/notifications/seen");
    return res;
  } catch (error) {
    console.error("알림 읽음 처리 실패:", error);
  }
};
