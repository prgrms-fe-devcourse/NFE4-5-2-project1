import { useEffect, useState } from "react";
import { usePlaylistStore } from "../../../stores/playlistStore";
import { getUserInfo } from "../../../apis/playlist/userService";
import { getTrackToPlaylist } from "../../../apis/playlist/playlistService";

export function usePlaylistPanel() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userName, setUserName] = useState("");
    const setTracks = usePlaylistStore((state) => state.setTracks);
    const tracks = usePlaylistStore((state) => state.tracks);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const getUserData = async () => {
        try {
          const data = await getUserInfo();
          const parsed = JSON.parse(data.fullName);
          setUserName(parsed.name);
        } catch (error) {
          console.error("유저 정보 가져오기 실패:", error);
        }
      };
      getUserData();
    }, []);
  
    useEffect(() => {
      const fetchTracks = async () => {
        setIsLoading(true);
        try {
          const data = await getTrackToPlaylist();
          const parsedData: TrackInfo[] = data.map(
            (item: { title: string; _id: string }) => ({
              title: JSON.parse(item.title),
              _id: item._id,
            })
          );
          setTracks(parsedData);
        } catch (error) {
          console.error("트랙 리스트 가져오기 실패:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchTracks();
    }, [setTracks]);
  
    const toggleModal = () => setIsModalOpen(prev => !prev);
  
    return {
      isModalOpen,
      userName,
      tracks,
      isLoading,
      toggleModal
    };
  }