// src/api/messages.ts
import api from "./index";

// 대화 목록
export const getConversations = () => api.get("/messages/conversations").then((res) => res.data);

// 메시지 목록 (특정 사용자와)
export const getMessages = (userId: string) =>
  api.get("/messages", { params: { userId } }).then((res) => res.data);

// 메시지 전송
export const createMessage = (message: string, receiver: string) =>
  api.post("/messages/create", { message, receiver }).then((res) => res.data);

// 메시지 읽음 처리
export const markMessagesSeen = (sender: string) =>
  api.put("/messages/update-seen", { sender }).then((res) => res.data);
