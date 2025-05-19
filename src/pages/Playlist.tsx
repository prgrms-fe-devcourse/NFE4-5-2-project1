import { useEffect, useState } from "react";
import MusicRecommender from "../features/playlist/components/MusicRecommender/MusicRecommender";
import PlayListBanner from "../features/playlist/components/PlayListBanner";
import PlaylistPanel from "../features/playlist/components/PlaylistPanel/PlaylistPanel";
import OtherUserPlaylist from "../features/playlist/components/OtherUserPlaylist/OtherUserPlaylist";
import { getUserInfo } from "../apis/playlist/userService";
import UserPlaylistPreview from "../features/playlist/components/UserPlaylistPreview/UserPlaylistPreview";

export default function Playlist() {
  const [userId, setUserId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [currentVideo, setCurrentVideo] = useState<{
    postId: string;
    videoId: string;
  } | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      const data = await getUserInfo();
      setUserId(data._id);
      setSelectedUserId(data._id);
    };
    getUserData();
  }, []);

  return (
    <div className="mt-6 md:mt-0 xl:mt-12 flex flex-col scrollbar-hide w-[80%] lg:w-[800px] xl:w-[1080px] justify-center items-center h-auto xl:h-[70vh] py-10">
      <PlayListBanner />
      <div className="flex flex-col xl:flex-row gap-[32px] w-full h-auto xl:h-[70vh]">
        <div className="flex flex-col h-[70vh] justify-between w-full xl:w-[58%] order-last xl:order-none xl:mt-12 gap-8">
          <div className="flex-1 overflow-autp scrollbar-hide">
            <MusicRecommender
              setCurrentVideo={setCurrentVideo}
              currentVideo={currentVideo}
            />
          </div>

          <div className="flex-1 overflow-auto min-h-[300px]">
            {userId === selectedUserId ? (
              <UserPlaylistPreview setSelectedUserId={setSelectedUserId} />
            ) : (
              <OtherUserPlaylist
                selectedUserId={selectedUserId}
                setSelectedUserId={setSelectedUserId}
                setCurrentVideo={setCurrentVideo}
                currentVideo={currentVideo}
              />
            )}
          </div>
        </div>

        <div className="w-full xl:w-[40%] order-first xl:order-none h-[500px] xl:min-h-[640px] xl:h-full mt-12 ">
          <PlaylistPanel
            setCurrentVideo={setCurrentVideo}
            currentVideo={currentVideo}
          />
        </div>
      </div>
    </div>
  );
}
