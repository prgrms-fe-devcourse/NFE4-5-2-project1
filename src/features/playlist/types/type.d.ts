type PlayListInputProps = {
  className?: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

interface SpotifyTrack {
  id: string;
  name: string;
  duration_ms: number;
  popularity: number;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
  album: {
    id: string;
    name: string;
    images: {
      url: string;
      height: number;
      width: number;
    }[];
  };
  artists: {
    id: string;
    name: string;
  }[];
}

interface Track {
  name: string;
  imgUrl: string;
  artist: string;
}

interface TrackInfo {
  title: Track;
  _id: string;
}

interface PlaylistTrackItemProps {
  track?: SpotifyTrack;
  onClick?: (track: SpotifyTrack) => void;
  item?: TrackInfo;
  showEllipsis?: boolean;
  trackId: string;
  other?: boolean;
  setCurrentVideo: (video: { postId: string; videoId: string } | null) => void;
  currentVideo: { postId: string; videoId: string } | null;
}

interface PlaylistState {
  tracks: TrackInfo[];
  setTracks: (tracks: TrackInfo[]) => void;
}

interface TrackPrompt {
  name: string;
  artist: string;
}

interface TrackRecommendation {
  name: string;
  artist: string;
}

interface UserType {
  fullName: string;
  isOnline: boolean;
  _id: string;
  image: string;
}

interface UserListItemProps {
  fullName: string;
  coverImage?: string;
  favoriteArtist?: string;
  isOnline?: boolean;
  id: string;
  setSelectedUserId: (id: string) => void;
}

interface ParsedDataType {
  name: string;
  coverImage?: string;
  favoriteArtist?: string;
  favoriteGenre?: string;
  isOnline?: boolean;
  id: string;
}

interface PlaylistTracksProps {
  tracks: TrackInfo[];
  isLoading: boolean;
  setCurrentVideo: (video: { postId: string; videoId: string } | null) => void;
  currentVideo: { postId: string; videoId: string } | null;
}

interface TrackDataForPlaylist {
  name: string;
  artist: string;
  imgUrl: string;
}
interface CurrentVideoProps {
  setCurrentVideo: (video: { postId: string; videoId: string } | null) => void;
  currentVideo: { postId: string; videoId: string } | null;
}

interface RecommendedTrackListProps {
  recommendations: SpotifyTrack[];
  isLoading: boolean;
  setCurrentVideo: (video: { postId: string; videoId: string } | null) => void;
  currentVideo: { postId: string; videoId: string } | null;
}

interface OtherUserPlaylistProps {
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
  setCurrentVideo: (video: { postId: string; videoId: string } | null) => void;
  currentVideo: { postId: string; videoId: string } | null;
}

interface TrackCardProps {
  track: SpotifyTrack;
  setCurrentVideo: (video: { postId: string; videoId: string } | null) => void;
  currentVideo: { postId: string; videoId: string } | null;
}

interface PlaylistContentProps {
  userPlaylist: TrackInfo[] | null;
  isLoading: boolean;
  setCurrentVideo: (video: { postId: string; videoId: string } | null) => void;
  currentVideo: { postId: string; videoId: string } | null;
}

interface TrackAddModalProps {
  onClose: () => void;
  setCurrentVideo: (video: { postId: string; videoId: string } | null) => void;
  currentVideo: { postId: string; videoId: string } | null;
}
