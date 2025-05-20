// src/api/search.ts
import api from "./index";

export const searchUsers = (query: string) =>
  api.get(`/search/users/${encodeURIComponent(query)}`).then((res) => res.data);

export const searchAll = (query: string) =>
  api.get(`/search/all/${encodeURIComponent(query)}`).then((res) => res.data);
