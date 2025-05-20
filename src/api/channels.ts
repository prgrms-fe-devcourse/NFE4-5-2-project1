// src/api/channels.ts
import api from "./index";

// 전체 채널
export const getChannels = () => api.get("/channels").then((res) => res.data);

// 이름으로 채널 조회
export const getChannelByName = (channelName: string) =>
  api.get(`/channels/${encodeURIComponent(channelName)}`).then((res) => res.data);

// 채널 생성 (어드민) authRequired가 true면 로그인한 사람만 볼 수 있음
export const createChannel = (name: string, description: string, authRequired: boolean) =>
  api.post("/channels/create", { name, description, authRequired }).then((res) => res.data);
