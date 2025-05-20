import api from "./index";

export const login = (email: string, password: string) =>
  api.post("/login", { email, password }).then((res) => res.data);

export const signup = (email: string, fullName: string, password: string) =>
  api.post("/signup", { email, fullName, password }).then((res) => res.data);

export const logout = () => api.post("/logout").then((res) => res.data);

export const getAuthUser = () => api.get("/auth-user").then((res) => res.data);
