// api/write.ts
import { axiosInstance } from "../axios";

// api/write.ts
export const createCodePost = (formData: FormData) => {
  return axiosInstance.post("/posts/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
