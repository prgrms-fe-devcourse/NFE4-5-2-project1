import { useCallback, useEffect, useState } from "react";
import ProfileImage from "./ProfileImage";
import Button from "./Button";
import { Comment, ExtendedUser } from "../../types/postType";
import { FaRegTrashCan } from "react-icons/fa6";
import { userStore } from "../../stores/userStore";
import { Link } from "react-router";
import { createNotification } from "../../api/notification";
import { setComments, getPosts, deleteComments } from "../../api/posts";

interface CommentsProps {
  author: ExtendedUser;
  postId: string;
  commentList: Comment[];
  setCommentList: React.Dispatch<React.SetStateAction<Comment[]>>;
}

export default function Comments({
  author,
  postId,
  commentList,
  setCommentList,
}: CommentsProps) {
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const userId = userStore((state) => state.getUser()?._id);
  const user = userStore((state) => state.getUser());

  const fetchComments = useCallback(async () => {
    try {
      const res = await getPosts(postId);

      setCommentList(res.data.comments);
    } catch (error) {
      console.log("댓글 불러오기 실패", error);
    }
  }, [postId, setCommentList]);

  const handleSubmit = async () => {
    if (input.trim() === "" || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const res = await setComments({
        comment: input,
        postId: postId,
      });

      // console.log(res.data);
      setCommentList((prev) => [...prev, res]);
      setInput("");

      await createNotification({
        notificationType: "COMMENT",
        notificationTypeId: res._id,
        userId: author._id,
        postId: postId,
      });
    } catch (error) {
      console.log("댓글 작성 실패", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const DeleteComments = async (commentId: string) => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteComments(commentId);
      setCommentList((prev) =>
        prev.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      console.log("댓글 작성 실패", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formateDate = (newDate: string) => {
    const date = new Date(newDate);

    const yy = String(date.getFullYear()).slice(2);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");

    return `${yy}.${mm}.${dd} ${hh}:${min}`;
  };

  const navigateHandler = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex flex-col gap-3 mt-2">
      {/* 댓글 입력 */}
      <div className="flex items-center gap-2 w-full py-2">
        <ProfileImage size={32} imageUrl={user?.image} />
        <input
          type="text"
          placeholder="댓글을 입력해 주세요."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
          className="flex-grow h-[36px] px-3 text-sm border border-[#d9d9d9] dark:border-[#4c4c4c] rounded-[10px] focus:outline-none"
        />
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || input.trim() === ""}
        >
          댓글 달기
        </Button>
      </div>

      {/* 댓글 목록 */}
      <div className="flex flex-col gap-2  max-h-[320px] overflow-y-auto pr-1">
        {Array.isArray(commentList) &&
          commentList.map((comment) => (
            <div key={comment._id} className="flex items-center gap-2 w-full">
              <Link
                to={`/profile/${comment.author._id}/posts`}
                onClick={navigateHandler}
              >
                <ProfileImage size={32} authorId={comment.author._id} />
              </Link>
              <div className="flex flex-col w-full">
                <span className="font-semibold">
                  {comment.author.username
                    ? comment.author.username
                    : "익명의 유저"}
                </span>
                {/* 댓글 본문 + 날짜 + 삭제 */}
                <div className="flex justify-between items-center w-full">
                  <span className="text-sm">{comment.comment}</span>

                  <div className="flex items-center gap-2">
                    {comment.author?._id === userId && (
                      <button
                        className="text-[#ababab] pb-[20px] font-semibold hover:cursor-pointer"
                        onClick={() => DeleteComments(comment._id)}
                      >
                        <FaRegTrashCan className="text-[18px]" />
                      </button>
                    )}
                    <span className="pb-[20px] pr-[5px] text-[12px] text-[#999]">
                      {formateDate(comment.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
