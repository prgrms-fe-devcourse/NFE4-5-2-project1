import { useEffect, useState } from "react";
import { Post } from "../types/Post";
import { parseBopTitle } from "../../../utils/parseBopTitle";
import { Ellipsis, Heart } from "lucide-react";
import play from "../../../assets/images/playbtn.svg";
import stop from "../../../assets/images/stopbtn.svg";
import DropdownMenu from "../../../components/common/DropdownMenu";
import { deletePost } from "../../../utils/post";
import { getCurrentUserId } from "../../../utils/auth";
import { useNavigate } from "react-router";
import { parseUserName } from "../../../utils/parseUserName";
import { useAddTrackToPlaylist } from "../../playlist/hooks/useAddTrackToPlaylist";
import { searchYoutubeVideo } from "../../../apis/youtube/youtubeSearch";
import BopCardSkeleton from "./BopCardSkeleton";
import { useLike } from "../hooks/useLike";
import ActionModal from "../../../components/common/ActionModal";
import StatusModal from "../../../components/common/StatusModal";

type BopCardProps = {
  post: Post;
  currentVideo: { postId: string; videoId: string } | null;
  setCurrentVideo: (video: { postId: string; videoId: string } | null) => void;
  onDelete: (postId: string) => void;
};

export default function BopCard({
  post,
  currentVideo,
  setCurrentVideo,
  onDelete,
}: BopCardProps) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const parsedBopTitle = parseBopTitle(post.title);
  const track = parsedBopTitle?.track;
  const { isLiked, toggleLike, likes } = useLike(post);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const cancelHandler = () => {
    setShowDeleteModal(false);
  };

  const [showCompletedModal, setShowCompletedModal] = useState(false);

  const myMenuItems = [
    {
      label: "게시물 수정",
      onClick: () =>
        navigate(`/community/bops-community/post/${post._id}/edit`, {
          state: { post },
        }),
    },
    {
      label: "플리에 추가",
      onClick: () => {
        addPlaylistHandler();
      },
    },
    {
      label: "게시물 삭제",
      onClick: () => setShowDeleteModal(true),
      danger: true,
    },
  ];

  const defaultMenuItems = [
    {
      label: "플리에 추가",
      onClick: () => {
        if (!parsedBopTitle?.track) return;
        addTrackToPlaylist({
          name: track.name,
          artist: Array.isArray(track.artists)
            ? track.artists.join(", ")
            : track.artists,
          imgUrl: track.image,
        });
      },
    },
  ];

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getCurrentUserId();
      setCurrentUserId(userId);
    };

    fetchUserId();
  }, []);

  const addTrackToPlaylist = useAddTrackToPlaylist();

  const addPlaylistHandler = () => {
    if (!parsedBopTitle?.track) return;
    addTrackToPlaylist({
      name: track.name,
      artist: Array.isArray(track.artists)
        ? track.artists.join(", ")
        : track.artists,
      imgUrl: track.image,
    });
  };

  const deletePostHandler = async () => {
    try {
      await deletePost(post._id);
      setShowDeleteModal(false);
      onDelete(post._id);
    } catch (e) {
      console.error("삭제 실패", e);
    }
  };

  const isPlaying =
    currentVideo?.postId === post._id && currentVideo?.videoId === videoId;
  const parsedUserName = parseUserName(post.author.fullName);
  const trackName = parsedBopTitle.track.name;
  const artistNames = Array.isArray(parsedBopTitle.track.artists)
    ? parsedBopTitle.track.artists.join(", ")
    : parsedBopTitle.track.artists;

  const togglePlayTrack = async () => {
    if (isPlaying) {
      setCurrentVideo(null);
      return;
    }

    const query = `${artistNames} - ${trackName} official audio topic`;
    const foundVideoId = await searchYoutubeVideo(query);

    if (foundVideoId) {
      setVideoId(foundVideoId);
      setCurrentVideo({ postId: post._id, videoId: foundVideoId });
    }
  };

  if (!post) {
    return <BopCardSkeleton />;
  }

  return (
    <>
      <div className="relative w-fit">
        <div className="w-[224px] bg-[#55555534] p-4 rounded-2xl flex flex-col gap-4 mt-7  shadow-lg shadow-[rgba(0,0,0,0.50)] transition-transform duration-300 ease-in-out hover:-translate-y-4">
          <div className="relative w-full h-[208px] overflow-hidden rounded-2xl group shadow-lg shadow-[rgba(0,0,0,0.25)] ">
            <img
              className="w-full h-full bg-[#c2c2c2] rounded-2xl object-cover"
              src={parsedBopTitle.track.image}
              alt="앨범 커버"
            />
            <div className="w-full h-full p-1 absolute inset-0  bg-black/60 flex flex-col justify-between  opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out">
              <div className="flex flex-col p-3 h-[80%] text-[12px] gap-2">
                <span>Behind.</span>
                <span className="text-white text-[14px] font-light mb-2 text-left">
                  {parsedBopTitle.text}
                </span>
              </div>

              <span className="w-full h-[10%] text-[10px] text-right px-1">
                Recommended By.
                <span
                  className="text-[color:var(--primary-300)] ml-1 cursor-pointer"
                  onClick={() => {
                    navigate(`/userdetail/${post.author._id}`);
                  }}
                >
                  {parsedUserName.name}
                </span>
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <div className="w-full flex gap-0.5 h-12">
                <div className="flex flex-col w-[90%] justify-between">
                  <span className="w-full text-[16px] font-semibold truncate">
                    {parsedBopTitle.track.name}
                  </span>
                  <span className="text-[12px] font-light text-[color:var(--white-80)]">
                    {parsedBopTitle.genre}
                  </span>
                </div>

                <div className="w-4 h-6 flex items-center justify-center">
                  <Ellipsis
                    className="w-4 h-4 cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                  />
                </div>
              </div>

              <span className="text-[12px] whitespace-nowrap overflow-hidden text-ellipsis">
                {artistNames}
              </span>
            </div>

            <div className="flex justify-between">
              <div className="flex w-auto gap-2 items-center ">
                <Heart
                  onClick={toggleLike}
                  className={`w-4 h-4 cursor-pointer ${
                    isLiked
                      ? "text-[color:var(--primary-300)]"
                      : "text-[color:var(--white)]"
                  }`}
                  fill={isLiked ? "var(--primary-300)" : "none"}
                />
                <span className="text-[10px]">{likes.length}</span>
              </div>
              <img
                src={isPlaying ? stop : play}
                onClick={togglePlayTrack}
                alt="재생버튼"
                className="w-6 h-6 cursor-pointer pb-1 "
              />
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
        </div>

        {isOpen && (
          <div className="absolute left-full top-75 ">
            <DropdownMenu
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              menuItems={
                post.author._id === currentUserId
                  ? myMenuItems
                  : defaultMenuItems
              }
            />
          </div>
        )}
      </div>

      {showDeleteModal && (
        <ActionModal
          modalMessage="노래를 삭제하시겠습니까?"
          onCancel={cancelHandler}
          onConfirmAction={deletePostHandler}
          confirmButtonText="삭제하기"
        />
      )}

      {showCompletedModal && (
        <StatusModal
          message="플레이리스트에 추가되었습니다!"
          onClose={() => setShowCompletedModal(false)}
        />
      )}
    </>
  );
}
