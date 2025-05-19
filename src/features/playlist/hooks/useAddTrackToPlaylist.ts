import { useCallback } from "react";
import { usePlaylistStore } from "../../../stores/playlistStore";
import { addTrackToPlayList } from "../../../apis/playlist/playlistService";
import {
  showErrorToast,
  showSuccessToast,
} from "../../..//components/common/Toast";

export function useAddTrackToPlaylist(
  onSuccess?: () => void,
  onError?: (message: string) => void
) {
  const { setTracks } = usePlaylistStore();
  const tracks = usePlaylistStore((state) => state.tracks);

  const handleTrackClick = useCallback(
    async (trackData: SpotifyTrack | TrackDataForPlaylist) => {
      try {
        let trackInfo: TrackDataForPlaylist;

        if ("album" in trackData) {
          trackInfo = {
            name: trackData.name,
            artist: trackData.artists[0]?.name || "Unknown",
            imgUrl: trackData.album.images[0]?.url || "",
          };
        } else {
          trackInfo = trackData;
        }

        const isAlreadyAdded = tracks.some(
          (t) =>
            t.title.name === trackInfo.name &&
            t.title.artist === trackInfo.artist
        );

        if (isAlreadyAdded) {
          showErrorToast("중복된 노래가 존재합니다");
          onError?.("이미 추가된 곡입니다");
          return;
        }

        const savedTrack = await addTrackToPlayList({
          title: trackInfo,
        });

        const newSavedTrack = {
          ...savedTrack,
          title: JSON.parse(savedTrack.title),
        };

        setTracks([newSavedTrack, ...tracks]);
        showSuccessToast("성공적으로 추가되었습니다.");
        onSuccess?.();
      } catch (err) {
        console.error("노래 추가 실패", err);
        showErrorToast("플레이리스트 추가에 실패했습니다");
        onError?.("플레이리스트 추가에 실패했습니다");
      }
    },
    [onSuccess, setTracks, tracks]
  );

  return handleTrackClick;
}
