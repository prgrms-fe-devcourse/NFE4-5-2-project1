import { axiosInstance } from '../axios';

export const getNotificationsData = () => {
  return axiosInstance.get('/notifications');
};

// 읽음 처리
export const putNotificationSeenData = () => {
  return axiosInstance.put(`/notifications/seen`);
};

// 알림생성
export const postNotificationData = (
  notificationType: 'COMMENT' | 'FOLLOW' | 'LIKE' | 'MESSAGE',
  notificationTypeId: string, // 코멘트나 좋아요, 메시지, 팔로우 객체의 ID
  userId: string, // 알림을 받을 user id
  postId: string | null // 해당 게시글 ID (팔로우나 메시지는 null)
) => {
  return axiosInstance.post(`/notifications/create`, {
    notificationType: notificationType,
    notificationTypeId: notificationTypeId,
    userId: userId,
    postId: postId,
  });
};
