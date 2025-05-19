import { useEffect, useState } from "react";
import { axiosInstance } from "../../../apis/axiosInstance";
import useDebounce from "./useDebounce";
import { User } from "../types/User";
import { ParsedUser } from "../types/ParsedUser";

export default function useSearchUsers(keyword: string) {
  const [userList, setUserList] = useState<ParsedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const debouncedKeyword = useDebounce(keyword, 300);

  useEffect(() => {
    if (!debouncedKeyword.trim()) {
      setUserList([]);
      setLoading(false);
      return;
    }

    const searchUsers = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/search/users/${debouncedKeyword}`
        );

        const lowercasedKeyword = debouncedKeyword.trim().toLowerCase();
        const parsed = data
          .filter((user: User) => user.fullName !== "orca")
          .map((user: User) => {
            try {
              const parsedFullName = JSON.parse(user.fullName);
              return {
                ...user,
                fullName: parsedFullName,
              };
            } catch (error) {
              console.error("Data parsing error", error);
              return {
                ...user,
                fullName: { name: user.fullName },
              };
            }
          })
          .filter(
            (user: ParsedUser) =>
              user?.fullName?.name &&
              user.fullName.name.toLowerCase().includes(lowercasedKeyword)
          );

        setUserList(parsed);
      } catch (error) {
        console.error("Failed to search users", error);
        setUserList([]);
      } finally {
        setLoading(false);
      }
    };

    searchUsers();
  }, [debouncedKeyword]);

  return { userList, loading };
}
