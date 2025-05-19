import { Pause, Play, Plus } from "lucide-react";
import TrackCardSkeleton from "./TrackCardSkeleton";

import { useAddTrackToPlaylist } from "../../hooks/useAddTrackToPlaylist";
import { useState } from "react";
import { searchYoutubeVideo } from "../../../../apis/youtube/youtubeSearch";

export default function TrackCard({
  track,
  setCurrentVideo,
  currentVideo,
}: TrackCardProps) {
  const handleAddToPlaylist = useAddTrackToPlaylist();
  const [videoId, setVideoId] = useState<string | null>(null);

  if (!track) {
    return <TrackCardSkeleton />;
  }

  const onAddClick = () => {
    handleAddToPlaylist(track);
  };

  const isPlaying =
    currentVideo?.postId === track.id && currentVideo?.videoId === videoId;

  const togglePlayTrack = async () => {
    if (isPlaying) {
      setCurrentVideo(null);
      return;
    }

    const query = `${track.artists} - ${track.name} official audio topic`;
    const foundVideoId = await searchYoutubeVideo(query);

    if (foundVideoId) {
      setVideoId(foundVideoId);
      setCurrentVideo({ postId: track.id, videoId: foundVideoId });
    }
  };

  return (
    <div className=" md:w-[160px] xl:w-[112px] 2xl:w-[120px] h-[90%] overflow-hidden flex flex-col justify-center items-center md:gap-4 box-border min-h-32">
      <div className="flex h-[35%] justify-center items-center rounded-full relative group overflow-hidden  min-w-15  min-h-15">
        <img
          src={track.album.images[0]?.url || ""}
          alt={`${track.name} 앨범 커버`}
          className="w-full h-full object-cover cursor-pointer "
          onClick={togglePlayTrack}
        />
        <div
          className={`absolute flex justify-center items-center cursor-pointer opacity-0 group-hover:opacity-100 group-hover:bg-black/50 w-full h-full z-10 ${
            isPlaying ? "opacity-100 bg-black/50" : ""
          }`}
        >
          {isPlaying ? (
            <Pause onClick={togglePlayTrack} className="z-50" />
          ) : (
            <Play onClick={togglePlayTrack} className="z-50" />
          )}
        </div>
      </div>

      {isPlaying && currentVideo?.videoId && (
        <iframe
          className="w-0 h-0 hidden"
          src={`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=1&mute=0&controls=0&modestbranding=1&rel=0&showinfo=0`}
          allow="autoplay"
          allowFullScreen
        />
      )}

      <div className="flex flex-col md:gap-2 justify-center items-center w-full h-[40%]">
        <div className="flex flex-col gap-0.5 md:gap-2 xl:gap-1 w-full">
          <p
            className="text-[10px] md:text-[14px] font-bold text-[color:var(--white)] truncate w-full text-center"
            title={track.name}
          >
            {track.name}
          </p>
          <div
            className="text-[8px] md:text-[12px] text-[color:var(--white-80)] truncate w-full text-center h-[17px]"
            title={track.artists[0].name}
          >
            {track.artists[0].name}
          </div>
        </div>

        <div
          className="flex justify-center gap-[8px] items-center md:mt-2 group"
          onClick={onAddClick}
        >
          <Plus className="w-2 h-2 md:w-3 md:h-3 text-[color:var(--grey-400)] group-hover:text-[color:var(--primary-100)] cursor-pointer" />
          <p className=" text-[8px] md:text-[10px]  xl:text-[12px]  text-[color:var(--grey-400)] group-hover:text-[color:var(--primary-100)] cursor-pointer">
            Add Playlist
          </p>
        </div>
      </div>
    </div>
  );
}
