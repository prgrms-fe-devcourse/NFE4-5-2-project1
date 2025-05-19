import { useEffect, useState } from "react";
import CommunityArticle from "./CommunityArticle";
import TextAreaField from "../../../components/common/TextAreaField";
import { useParams } from "react-router";
import { axiosInstance } from "../../../apis/axiosInstance";
import { Post } from "../types/Post";
import BackButton from "../../../components/common/BackButton";
import { createComment } from "../../../utils/comment";

export default function PostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comment, setComment] = useState("");
  const isFormInvalid = !comment;

  const fetchPost = async () => {
    try {
      const res = await axiosInstance.get(`/posts/${postId}`);
      setPost(res.data);
    } catch (e) {
      console.error("게시글 불러오기 실패", e);
    }
  };

  useEffect(() => {
    if (!postId) return;
    fetchPost();
  }, [postId]);

  const handleCommentSubmit = async () => {
    if (!postId || !post) return;

    const success = await createComment({
      comment,
      postId,
      postAuthorId: post.author._id,
    });

    if (success) {
      setComment("");
      fetchPost();
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="flex w-full">
        <BackButton />
      </div>

      <div className="flex flex-col gap-8 p-6">
        <CommunityArticle post={post!} />
        <TextAreaField
          label="댓글 작성"
          id="contentInput"
          name="contentInput"
          autoComplete="contentInput"
          placeholder="댓글을 입력해주세요."
          className="flex-grow w-full h-[150px] "
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
          }}
        />
      </div>
      <div className="w-full flex justify-end px-6">
        <button
          disabled={isFormInvalid}
          className={` text-[14px] px-6 py-2 w-fit rounded-4xl  transition ${
            isFormInvalid
              ? "border-1 border-[color:var(--primary-200)] text-[var(--white-80)]"
              : "bg-[var(--primary-300)] text-[var(--bg-color)] cursor-pointer font-semibold"
          }`}
          onClick={handleCommentSubmit}
        >
          작성 완료
        </button>
      </div>
    </div>
  );
}
