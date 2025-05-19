import {axiosInstance} from "../../../apis/axiosInstance";
import {NotificationRes} from "../types/NotificationRes";

export const getNotification = async (): Promise<NotificationRes[]> => {
  try {
    const response = await axiosInstance.get("/notifications");
    return response.data;
  } catch (error) {
    console.error("알림 조회 실패:", error);
    throw error;
  }
};
