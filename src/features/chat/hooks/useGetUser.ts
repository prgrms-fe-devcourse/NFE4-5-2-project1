import { useEffect, useState } from "react";
import { UserInfo } from "../types/UserInfo";
import { axiosInstance } from "../../../apis/axiosInstance";

export default function useGetUser(userId: string) {
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await axiosInstance.get(`/users/${userId}`);

        const userData = {
          id: data._id,
          userName: JSON.parse(data.fullName).name,
          image: data.image,
          isOnline: data.isOnline,
        };

        setUserInfo(userData);
      } catch {
        throw new Error();
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [userId]);

  return { userInfo, loading };
}
