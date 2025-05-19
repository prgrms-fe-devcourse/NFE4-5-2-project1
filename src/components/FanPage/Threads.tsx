import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { FaRegComment } from "react-icons/fa";
import ProfileBlock from "./ProfileBlock";
import SimpleProfileCard from "./SimpleProfileCard";
import Comments from "./Comments";
import MyThreads from "./MyThreads";
import { AxiosError } from "axios";
import { Like, Comment, ExtendedUser } from "../../types/postType";
import { userStore } from "../../stores/userStore";
import { useNavigate, useLocation } from "react-router";
import { refreshStore } from "../../stores/refreshStore";
import EditPosts from "../Profile/EditPosts";
import { deletePost } from "../../api/posts";
import { createNotification } from "../../api/notification";
import { createLike, deleteLike } from "../../api/like";

interface ThreadProps {
  postId: string;
  username: string;
  postUserId: string;
  author: ExtendedUser;
  title: string;
  content: string;
  date: string;
  channel: string;
  images: string;
  imagesPublicId: string | null;
  likes: Like[];
  comments: Comment[];
  likeChecked: boolean;
  isMyThread?: boolean;
  channelId?: string;
}

export default function Threads({
  postId,
  postUserId,
  username,
  author,
  title,
  content,
  date,
  images,
  imagesPublicId,
  likes,
  comments,
  likeChecked,
  isMyThread = false,
  channelId,
}: ThreadProps) {
  const userId = userStore((state) => state.getUser()?._id);

  const [showed, setShowed] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentList, setCommentList] = useState<Comment[]>(comments);
  const [heartCount, setHeartCount] = useState(likes.length);
  const [heart, setHeart] = useState(likeChecked);
  const [myLikeId, setMyLikeId] = useState<string | null>(() => {
    const like = likes.find((like) => like.user === userId);
    return like ? like._id : null;
  });
  const [isHeartSending, setIsHeartSending] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const refetch = refreshStore((state) => state.refetch);

  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setCommentList(comments);
  }, [comments]);

  const showLoginModal = () => {
    Swal.fire({
      icon: "error",
      title: "로그인 후 이용 가능합니다. 🙏",
      text: "로그인 하시겠습니까?",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "예",
      cancelButtonText: "아니요",
    }).then((result) => {
      if (result.isConfirmed) {
        nav("/login", { state: { from: location } });
      }
    });
  };

  // 포스트 수정
  const [isEdit, setIsEdit] = useState(false);

  // 수정, 삭제
  const editHandler = () => {
    setIsEdit(true);
  };

  const editFinishHandler = () => {
    setIsEdit(false);
  };

  const deleteHandler = async () => {
    try {
      await deletePost(postId);
      refetch();
      setIsDeleted(true);
    } catch (e) {
      console.error(e);
    }
  };

  const postDelete = () => {
    Swal.fire({
      icon: "error",
      title: "게시글을 삭제하시겠어요? ",
      text: "삭제하시면 복원이 불가합니다. 🥲",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteHandler();
      }
    });
  };

  // 좋아요 on & off
  const toggleHeart = async () => {
    if (!userId) {
      showLoginModal();
      return;
    }

    if (isHeartSending) return;
    setIsHeartSending(true);

    try {
      if (!heart) {
        const res = await createLike(postId);
        const newLikeId = res._id;
        setMyLikeId(newLikeId);

        // 알림 생성 함수 만들어서 api호출
        await createNotification({
          notificationType: "LIKE",
          notificationTypeId: res._id,
          userId: author._id,
          postId: postId,
        });
      } else {
        await deleteLike(myLikeId ?? "");
        setMyLikeId(null);
      }
      setHeart((prev) => !prev);
      setHeartCount((prev) => (heart ? prev - 1 : prev + 1));
    } catch (error) {
      const err = error as AxiosError;
      console.error(err.response?.data || err.message);
    } finally {
      setIsHeartSending(false);
    }
  };

  // 댓글 on & off
  const toggleShowComments = () => {
    if (!userId) {
      showLoginModal();
      return;
    }
    setShowComments((prev) => !prev);
  };

  // 삭제된 경우 메시지 표시
  if (isDeleted) {
    return (
      <div className="border border-gray-300 dark:border-[#4c4c4c] rounded-lg p-4 mb-6 bg-white dark:bg-[#191A1E] shadow-sm text-center">
        <p className="mb-4 text-gray-700 dark:text-[#fff] font-semibold">
          삭제된 피드입니다.
        </p>
        <button
          onClick={() => nav("/")}
          className="px-4 py-2 bg-[#235bd2] text-white rounded-md hover:bg-[#0033A0] transition-all cursor-pointer"
        >
          홈으로 돌아가기 ~ 🎵
        </button>
      </div>
    );
  }

  if (isEdit) {
    return (
      <EditPosts
        channelId={channelId}
        postId={postId}
        titleValue={title}
        contentValue={content}
        imageValue={images ?? null}
        imagesPublicId={imagesPublicId ?? null}
        editFinishHandler={editFinishHandler}
      />
    );
  }

  return (
    <div
      className="w-full max-w-full md:max-w-[1200px] relative mx-auto shadow-md rounded-[10px] 
      border border-[#d9d9d9] dark:border-[#4c4c4c] p-[24px] flex flex-col gap-[20px]"
    >
      {/* 상단: 프로필 + 본문 */}
      <div className="flex gap-[25px]">
        {/* 왼쪽 고정 프로필 */}
        <div
          onMouseEnter={() => setShowed(true)}
          onMouseLeave={() => setShowed(false)}
        >
          <ProfileBlock username={username} imageUrl={author.image} />
          {!isMyThread && showed && (
            <div className="absolute z-50 w-[285px] top-5 left-[90px]">
              {userId && (
                <SimpleProfileCard loginUserId={userId} author={author} />
              )}
            </div>
          )}
        </div>

        {/* 본문 내용 */}
        <div className="flex flex-col w-full md:max-w-[990px] justify-center break-words">
          <div className="flex items-center gap-2 text-[16px] font-semibold mb-[10px] w-full">
            <span>{title}</span>
            <span className="text-[14px] text-[#ababab]">{date}</span>
          </div>
          <div className="text-[16px] mb-[10px] w-full break-all md:whitespace-pre-wrap">
            {content}
          </div>
          {/* 이미지가 있을 때만 보여주기 */}
          {images && (
            <div className="flex gap-2 flex-wrap mb-2">
              <img
                src={images}
                alt={`thread image`}
                className="w-[70%] rounded-[6px]"
              />
            </div>
          )}
          <div className="flex justify-between items-center text-[#ababab] text-[16px] mt-auto">
            <div className="flex items-center gap-4">
              <button
                className="flex items-center gap-1 hover:cursor-pointer"
                onClick={toggleHeart}
              >
                {heart ? (
                  <FaHeart className="text-[18px] text-red-500" />
                ) : (
                  <FaRegHeart className="text-[18px]" />
                )}
                {heartCount}
              </button>
              <button
                className="flex items-center gap-1 hover:cursor-pointer"
                onClick={toggleShowComments}
              >
                <FaRegComment className="text-[18px]" /> {commentList.length}
              </button>
            </div>

            {postUserId === userId && (
              <MyThreads onEdit={editHandler} onDelete={postDelete} />
            )}
          </div>
        </div>
      </div>

      {showComments && (
        <div className="w-full overflow-hidden transition-all ease-in-out">
          <Comments
            author={author}
            postId={postId}
            commentList={commentList}
            setCommentList={setCommentList}
          />
        </div>
      )}
    </div>
  );
}
