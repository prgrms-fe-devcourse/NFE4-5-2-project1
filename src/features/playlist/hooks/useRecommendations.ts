import { useEffect, useState } from "react";
import { recommendTracksByGpt } from "../../../apis/openai/getMusicRecommendationByGPT";
import { getSpotifyAccessToken } from "../../../apis/spotify/getSpotifyAccessToken";
import { searchMultipleTracks } from "../../../apis/spotify/spotifySearch";
import { usePlaylistStore } from "../../../stores/playlistStore";
import { getPromptFromGenre } from "./getPromptFromGenre";
import { getPromptFromTracks } from "./getPromptFromTracks";

export const useRecommendations = (user: UserType | null) => {
    const tracks = usePlaylistStore((state) => state.tracks);
    const [recommendations, setRecommendations] = useState<SpotifyTrack[]>([]);
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => {
      if (!user) return;
  
      const fetchRecommendations = async () => {
        setIsLoading(true);
        try {
          const prompt = tracks.length > 0 
            ? getPromptFromTracks(tracks)
            : getPromptFromGenre(JSON.parse(user.fullName).favoriteGenre);
  
          const recommendedTracks = await recommendTracksByGpt(prompt);
          const token = await getSpotifyAccessToken();
          const spotifyTracks = await searchMultipleTracks(recommendedTracks, token);
          
          setRecommendations(spotifyTracks);
        } catch (error) {
          console.error("추천 음악 가져오기 실패:", error);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchRecommendations();
    }, [user, tracks]);
  
    return { recommendations, isLoading };
  };