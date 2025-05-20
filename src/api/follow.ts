// src/api/follow.ts
import api from "./index";

export const followUser = (userId: string) =>
  api.post("/follow/create", { userId }).then((res) => res.data);

export const unfollowUser = (id: string) =>
  api.delete("/follow/delete", { data: { id } }).then((res) => res.data);
