import { usePlaylistPanel } from "../../hooks/usePlaylistPanel";
import PlaylistHeader from "./PlaylistHeader";
import PlaylistTracks from "./PlaylistTracks";
import TrackAddModal from "./TrackAddModal";

export default function PlaylistPanel({
  currentVideo,
  setCurrentVideo,
}: CurrentVideoProps) {
  const { isModalOpen, userName, tracks, isLoading, toggleModal } =
    usePlaylistPanel();

  return (
    <section className="flex flex-col gap-5 h-full bg-[color:var(--grey-600)] rounded-[30px] pt-8 px-10 min-h-[400px] ">
      <PlaylistHeader userName={userName} onAddClick={toggleModal} />
      <PlaylistTracks
        tracks={tracks}
        isLoading={isLoading}
        currentVideo={currentVideo}
        setCurrentVideo={setCurrentVideo}
      />
      {isModalOpen && (
        <TrackAddModal
          onClose={toggleModal}
          currentVideo={currentVideo}
          setCurrentVideo={setCurrentVideo}
        />
      )}
    </section>
  );
}
