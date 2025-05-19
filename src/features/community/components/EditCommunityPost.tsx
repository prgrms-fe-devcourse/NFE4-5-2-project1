import { useLocation, useNavigate } from "react-router";
import BackButton from "../../../components/common/BackButton";
import PostInputForm from "./CommunityPostForm";
import { useState } from "react";
import { Post } from "../types/Post";
import { parseTitle } from "../../../utils/parseTitle";
import { updatePost } from "../../../utils/post";
import StatusModal from "../../../components/common/StatusModal";

export default function EditCommunityPost() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const post = state?.post as Post;

  const parsedTitle = parseTitle(post.title);
  const [titleInput, setTitleInput] = useState(parsedTitle.title);
  const [contentInput, setContentInput] = useState(parsedTitle.body);
  const [imageInput, setImageInput] = useState<File | null>(null);
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const isFormInvalid = !titleInput || !contentInput;
  const existingImageUrl = post.image;
  const channelId = post.channel._id;

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const updatePostHandler = async () => {
    const jsonTitle = {
      title: titleInput,
      body: contentInput,
    };
    const imageToDeletePublicId = isImageDeleted ? post.imagePublicId : "";

    try {
      const response = await updatePost({
        postId: post._id,
        title: jsonTitle,
        channelId: channelId!,
        image: imageInput || undefined,
        imageToDeletePublicId: imageToDeletePublicId,
      });
      if (response.status === 201 || response.status === 200) {
        setShowSuccessModal(true);
      }
    } catch (e) {
      console.error("게시물 수정 실패:", e);
    }
  };

  const closeModalHandler = () => {
    setShowSuccessModal(false);
    navigate(-1);
  };

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="flex w-full my-4">
        <BackButton />
      </div>
      <div className="w-full h-full px-4">
        <div className="flex flex-col w-full h-auto border border-(--white-80) border-opacity-50 rounded-lg p-[48px] box-border gap-8">
          <span className="w-full text-center text-2xl">게시물 수정하기</span>

          <PostInputForm
            titleInput={titleInput}
            contentInput={contentInput}
            setTitleInput={setTitleInput}
            setContentInput={setContentInput}
            setImageInput={setImageInput}
            existingImageUrl={existingImageUrl}
            setIsImageDeleted={setIsImageDeleted}
          />
          <div className="w-[100%] flex justify-center items-center">
            <button
              disabled={isFormInvalid}
              className={` text-[14px] px-8 py-3 w-fit rounded-4xl  transition ${
                isFormInvalid
                  ? "border-1 border-[color:var(--primary-200)] text-[var(--white-80)]"
                  : "bg-[var(--primary-300)] text-[var(--bg-color)] cursor-pointer font-semibold"
              }`}
              onClick={updatePostHandler}
            >
              수정하기
            </button>
          </div>
        </div>
      </div>
      {showSuccessModal && (
        <StatusModal message="수정 완료었습니다!" onClose={closeModalHandler} />
      )}
    </div>
  );
}
