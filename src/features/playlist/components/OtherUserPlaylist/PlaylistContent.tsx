import PlaylistTrackItem from "../PlaylistPanel/PlaylistTrackItem";
import { EmptyPlaylist } from "./EmptyPlaylist";
import LoadingSpinner from "../../../../components/common/LoadingSpinner";

export const PlaylistContent = ({
  userPlaylist,
  isLoading,
  setCurrentVideo,
  currentVideo,
}: PlaylistContentProps) => (
  <div className="flex w-full h-full gap-[8px]">
    <div className="flex flex-col overflow-auto h-full w-full scrollbar-hide">
      {isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <LoadingSpinner />
        </div>
      ) : userPlaylist?.length ? (
        userPlaylist.map((track) => (
          <PlaylistTrackItem
            key={track._id}
            item={track}
            trackId={track._id}
            other={true}
            setCurrentVideo={setCurrentVideo}
            currentVideo={currentVideo}
          />
        ))
      ) : (
        <EmptyPlaylist />
      )}
    </div>
  </div>
);