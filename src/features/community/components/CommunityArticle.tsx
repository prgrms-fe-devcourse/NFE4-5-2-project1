import { Ellipsis, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Post } from "../types/Post";
import Comment from "../../../components/common/Comment";
import { parseTitle } from "../../../utils/parseTitle";
import DropdownMenu from "../../../components/common/DropdownMenu";
import { deletePost } from "../../../utils/post";
import { getCurrentUserId } from "../../../utils/auth";
import { parseUserName } from "../../../utils/parseUserName";
import { useNavigate } from "react-router";
import { CommentType } from "../types/Comment";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import profileImg from "../../../assets/images/default-profile-logo.svg";
import { useLike } from "../hooks/useLike";
import ActionModal from "../../../components/common/ActionModal";

interface ArticleProps {
  post: Post;
}

export default function Article({ post }: ArticleProps) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { isLiked, toggleLike, likes } = useLike(post);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentType[] | null>(null);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const cancelHandler = () => {
    setShowModal(false);
  };

  const menuItems = [
    {
      label: "게시물 수정",
      onClick: () =>
        navigate(
          `/community/${
            post.channel._id === "681e2fdd7380bb759ecc636d"
              ? "concert-community"
              : "open-community"
          }/post/${post._id}/edit`,
          { state: { post } }
        ),
    },
    {
      label: "게시물 삭제",
      onClick: () => {
        setShowModal(true);
      },
      danger: true,
    },
  ];

  const deletePostHandler = async () => {
    await deletePost(post._id!);
    setShowModal(false);
    navigate(-1);
  };

  useEffect(() => {
    if (!post) return;
    setComments(post.comments);
  }, [post]);

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getCurrentUserId();
      setCurrentUserId(userId);
    };

    fetchUserId();
  }, []);

  if (!post)
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );

  const parsedTitle = parseTitle(post.title);
  const parsedUserName = parseUserName(post.author.fullName);

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img
              className="w-9 h-9 rounded-full mr-4 cursor-pointer"
              src={post.author.image || profileImg}
              alt="작성자 프로필 이미지"
              onClick={() => navigate(`/userdetail/${post.author._id}`)}
            />
            <div className="flex flex-col">
              <span className="text-[18px]">{parsedUserName.name}</span>
              <span className="text-[13px] text-[color:var(--white-80)]">
                {new Date(post.createdAt).toLocaleString("ko-KR")}
              </span>
            </div>
          </div>

          {post.author._id === currentUserId && (
            <div className="relative">
              <Ellipsis
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer w-4 h-4"
              />
              <DropdownMenu
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                menuItems={menuItems}
              />
            </div>
          )}
        </div>

        <div>
          <span className="text-[18px]">{parsedTitle.title}</span>
          <p className="mt-7 text-[color:var(--white-80)]">
            {parsedTitle.body}
          </p>
        </div>
        {post.image && (
          <div className="mt-6 w-full flex justify-center">
            <img
              src={post.image}
              alt="게시글 이미지"
              className="w-[50%] h-auto rounded-lg"
            />
          </div>
        )}
        <div className="flex justify-between">
          <div className="flex items-center gap-2 text-[13px]">
            <Heart
              onClick={toggleLike}
              className={`w-4 h-4 cursor-pointer ${
                isLiked
                  ? "text-[color:var(--primary-300)]"
                  : "text-[color:var(--white)]"
              }`}
              fill={isLiked ? "var(--primary-300)" : "none"}
            />
            {likes.length}
          </div>

          <p className="text-[12px]">
            <span className="font-bold">{comments?.length ?? 0}</span>개의 댓글
          </p>
        </div>
        <div className="mt-3  pt-4  border-t-1 border-[color:var(--primary-300-50)]">
          {comments &&
            comments.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                onDelete={(deletedId) =>
                  setComments((prev) =>
                    prev!.filter((p) => p._id !== deletedId)
                  )
                }
              />
            ))}
        </div>
      </div>

      {showModal && (
        <ActionModal
          modalMessage="게시물을 삭제하시겠습니까?"
          onCancel={cancelHandler}
          onConfirmAction={deletePostHandler}
          confirmButtonText="삭제하기"
        />
      )}
    </>
  );
}
