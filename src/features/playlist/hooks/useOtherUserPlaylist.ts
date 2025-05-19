import { useEffect, useState } from "react";
import { getUserById, getUserInfo } from "../../../apis/playlist/userService";
import { getOtherUserTrackToPlaylist } from "../../../apis/playlist/playlistService";
import { isJSONString } from "../../../utils/stringUtils";

export const useOtherUserPlaylist = (selectedUserId: string) => {
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedDataType | null>(null);
  const [userPlaylist, setUserPlaylist] = useState<TrackInfo[] | null>(null);
  const [myId, setMyId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getMyId = async () => {
      const data = await getUserInfo();
      setMyId(data._id);
    };
    getMyId();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const [userData, playlistData] = await Promise.all([
          getUserById(selectedUserId),
          getOtherUserTrackToPlaylist(selectedUserId),
        ]);

        if (isJSONString(userData.fullName)) {
          setParsedData(JSON.parse(userData.fullName));
          setSelectedUserName(null);
        } else {
          setSelectedUserName(userData.fullName);
          setParsedData(null);
        }

        const processedPlaylist = playlistData.map((track: TrackInfo) => ({
          _id: track._id,
          title:
            typeof track.title === "string"
              ? JSON.parse(track.title)
              : track.title,
        }));

        setUserPlaylist(processedPlaylist);
      } catch (error) {
        console.error("유저 데이터 가져오기 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedUserId) {
      fetchUserData();
    }
  }, [selectedUserId]);

  return {
    selectedUserName,
    parsedData,
    userPlaylist,
    myId,
    isLoading,
  };
};
