import { useOtherUserPlaylist } from "../../hooks/useOtherUserPlaylist";
import { PlaylistContent } from "./PlaylistContent";
import { PlaylistHeader } from "./PlaylistHeader";

export default function OtherUserPlaylist({
  selectedUserId,
  setSelectedUserId,
  currentVideo,
  setCurrentVideo,
}: OtherUserPlaylistProps) {
  const { selectedUserName, parsedData, userPlaylist, myId, isLoading } =
    useOtherUserPlaylist(selectedUserId);

  const displayName = parsedData ? parsedData.name : selectedUserName;

  return (
    <section className="flex flex-col pt-8 px-10 bg-[color:var(--grey-600)] w-full overflow-hidden rounded-[30px] gap-[16px] h-full">
      <PlaylistHeader
        displayName={displayName}
        onBack={() => setSelectedUserId(myId)}
      />

      <PlaylistContent
        userPlaylist={userPlaylist}
        isLoading={isLoading}
        currentVideo={currentVideo}
        setCurrentVideo={setCurrentVideo}
      />
    </section>
  );
}
