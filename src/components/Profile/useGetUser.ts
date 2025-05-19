import { useEffect, useState, useTransition } from "react";
import { ExtendedUser } from "../../types/postType";
import { refreshStore } from "../../stores/refreshStore";
import { getUser } from "../../api/user";

export default function useGetUser(userId: string) {
  const [user, setUser] = useState<ExtendedUser>();
  const [isLoading, startTransition] = useTransition();
  const refresh = refreshStore((state) => state.refresh);

  const getHandler = async () => {
    try {
      const data = await getUser(userId);
      setUser(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    startTransition(async () => {
      await getHandler();
    });
  }, [refresh, userId]);

  return { user, isLoading };
}
