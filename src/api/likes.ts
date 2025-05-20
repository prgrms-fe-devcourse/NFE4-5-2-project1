// src/api/likes.ts
import api from "./index";

export const likePost = (postId: string) =>
  api.post("/likes/create", { postId }).then((res) => res.data);

export const unlikePost = (id: string) =>
  api.delete("/likes/delete", { data: { id } }).then((res) => res.data);
