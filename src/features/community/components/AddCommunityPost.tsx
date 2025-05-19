import { useState } from "react";
import { useChannelId } from "../../../hooks/useChannelId";
import { useNavigate } from "react-router";
import { ChannelName } from "../types/ChannelName";
import { createPost } from "../../../utils/post";
import BackButton from "../../../components/common/BackButton";
import PostInputForm from "./CommunityPostForm";
import StatusModal from "../../../components/common/StatusModal";

export default function AddPost({ channelName }: ChannelName) {
  const navigate = useNavigate();
  const [titleInput, setTitleInput] = useState("");
  const [contentInput, setContentInput] = useState("");
  const [imageInput, setImageInput] = useState<File | null>(null);
  const { channelId } = useChannelId(channelName);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const isFormInvalid = !titleInput || !contentInput;

  const createPostHandler = async () => {
    const jsonTitle = {
      title: titleInput,
      body: contentInput,
    };

    try {
      const response = await createPost({
        title: jsonTitle,
        channelId: channelId!,
        image: imageInput || undefined,
      });
      if (response.status === 201 || response.status === 200) {
        setShowSuccessModal(true);
      }
    } catch (e) {
      console.error("Error during post creation:", e);
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
          <span className="w-full text-center text-2xl">게시물 추가하기</span>

          <PostInputForm
            titleInput={titleInput}
            contentInput={contentInput}
            setTitleInput={setTitleInput}
            setContentInput={setContentInput}
            setImageInput={setImageInput}
          />
          <div className="w-[100%] flex justify-center items-center">
            <button
              disabled={isFormInvalid}
              className={` text-[14px] px-8 py-3 w-fit rounded-4xl  transition ${
                isFormInvalid
                  ? "border-1 border-[color:var(--primary-200)] text-[var(--white-80)]"
                  : "bg-[var(--primary-300)] text-[var(--bg-color)] cursor-pointer font-semibold"
              }`}
              onClick={createPostHandler}
            >
              저장하기
            </button>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <StatusModal
          message="성공적으로 저장되었습니다."
          onClose={closeModalHandler}
        />
      )}
    </div>
  );
}
