import { axiosInstance } from "./axiosInstance";

const getMessages = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/messages?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error("메세지 불러오기 실패", error);
  }
};

const createMessage = async (message: string, receiver: string) => {
  try {
    const response = await axiosInstance.post("/messages/create", {
      message,
      receiver,
    });
    return response.data;
  } catch (error) {
    console.error("메세지 생성 실패", error);
  }
};

const messageConversations = async () => {
  try {
    const response = await axiosInstance.get("/messages/conversations");
    return response.data;
  } catch (error) {
    console.error("메세지 목록 불러오기 실패", error);
  }
};

const updateMessageSeen = async (sender: string) => {
  try {
    const response = await axiosInstance.put("/messages/update-seen", {
      sender,
    });
    return response.data;
  } catch (error) {
    console.error("메세지 읽음 처리 실패", error);
  }
};

export { getMessages, createMessage, messageConversations, updateMessageSeen };
