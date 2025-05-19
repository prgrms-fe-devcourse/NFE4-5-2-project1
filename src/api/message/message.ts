import { axiosInstance } from '../axios';

// 사용자와의 대화 기록 가져오기
export const getMessages = (userId: string) => {
  return axiosInstance.get('/messages', {
    params: {
      userId: userId,
    },
  });
};

// 사용자에게 메시지 보내기
export const postMessages = (message: string, receiver: string) => {
  return axiosInstance.post('/messages/create', {
    message: message,
    receiver: receiver,
  });
};

// 전체 메시지 목록 가져오기
export const getMessageList = () => {
  return axiosInstance.get('/messages/conversations');
};

// 사용자와의 메시지 읽음 처리하기
export const putMessageSeen = (sender: string) => {
  return axiosInstance.put('/messages/update-seen', {
    sender: sender,
  });
};
