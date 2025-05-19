import { ChangeEvent, useEffect, useState } from "react";
import { getAllUserInfo } from "../../../apis/playlist/userService";
import { getUserPlaylist } from "../../../apis/playlist/playlistService";

export function useUserPlaylistPreview() {
  const [inputValue, setInputValue] = useState("");
  const [userList, setUserList] = useState<UserType[]>([]);
  const [allUserList, setAllUserList] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getAllUserList = async () => {
      setIsLoading(true);
      try {
        const data = await getAllUserInfo();
        setAllUserList(data);
      } catch (error) {
        console.error("전체 유저 리스트 가져오기 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getAllUserList();
  }, []);

  useEffect(() => {
    if (!inputValue.trim()) {
      setUserList([]);
      return;
    }

    const getUsersData = async () => {
      const timer = setTimeout(async () => {
        setIsLoading(true);
        try {
          const usersData = await getUserPlaylist(inputValue);
          setUserList(usersData);
        } catch (error) {
          console.error("유저 검색 실패:", error);
        } finally {
          setIsLoading(false);
        }
      }, 300); 

      return () => clearTimeout(timer);
    };

    getUsersData();
  }, [inputValue]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const displayUsers = userList.length > 0 ? userList : allUserList;

  return {
    inputValue,
    displayUsers,
    isLoading,
    handleInputChange,
  };
}