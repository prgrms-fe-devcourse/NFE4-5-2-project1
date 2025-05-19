import axios from "axios";

export const axiosClient = axios.create({
  baseURL:
    window.location.hostname === "localhost"
      ? "http://13.125.208.179:5007"
      : "/api",
});
