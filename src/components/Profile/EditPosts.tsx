import { useRef, useState } from "react";
import { userStore } from "../../stores/userStore";
import useGetUser from "./useGetUser";
import ProfileBlock from "../FanPage/ProfileBlock";
import { LuImageMinus, LuImagePlus } from "react-icons/lu";
import { MdOutlineReplay } from "react-icons/md";
import Button from "../FanPage/Button";
import { AxiosError } from "axios";
import { refreshStore } from "../../stores/refreshStore";
import { updatePost } from "../../api/posts";

interface EditProps {
  channelId?: string;
  postId: string;
  titleValue: string;
  contentValue: string;
  imageValue: string | null;
  imagesPublicId: string | null;
  editFinishHandler: () => void;
}

export default function EditPosts({
  channelId,
  postId,
  titleValue,
  contentValue,
  imageValue,
  imagesPublicId,
  editFinishHandler,
}: EditProps) {
  const userId = userStore.getState().getUser()?._id;
  const { user } = useGetUser(userId!);
  const userName = user?.username || "익명의 유저";

  const [title, setTitle] = useState(titleValue || "");
  const [contents, setContents] = useState(contentValue || "");
  const [images, setImages] = useState<string | null>(imageValue);
  const [imageFiles, setImageFiles] = useState<File | null>(null);
  const [deleteImage, setDeleteImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const ImgInputRef = useRef<HTMLInputElement | null>(null);
  const refetch = refreshStore((state) => state.refetch);

  const ImgClickHandler = () => {
    ImgInputRef.current?.click();
  };

  const UndoHandler = () => {
    setTitle("");
    setContents("");
  };

  const deleteImgHandler = async () => {
    setImages("");
    setImageFiles(null);
    setDeleteImage(imagesPublicId);
  };

  const ImgFileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const result = e.target?.result as string;
        setImages(result);
        setImageFiles(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const editHandler = async () => {
    await putHandler();
    refetch();
    editFinishHandler();
  };

  // 포스트 업데이트 api 호출
  const putHandler = async () => {
    try {
      setIsEditing(true);
      const formData = new FormData();
      formData.append("postId", postId);
      formData.append(
        "title",
        JSON.stringify([{ postTitle: title, postContent: contents }])
      );
      formData.append("channelId", channelId ?? "");

      if (imageFiles) {
        formData.append("image", imageFiles);
      }

      if (deleteImage) {
        formData.append("imageToDeletePublicId", deleteImage);
      }

      await updatePost(formData);
      console.log("파일 수정 성공");
      setIsEditing(false);
    } catch (error) {
      const err = error as AxiosError;
      console.error("수정 불가", err.message);
    }
  };

  if (isEditing) {
    return (
      <>
        <div className="shadow-md w-full max-w-full md:max-w-[1200px] mx-auto rounded-[10px] border border-[#d9d9d9]  dark:border-gray-700 flex flex-col">
          <div className="p-[24px] flex gap-[25px]">
            <div className="flex-shrink-0 self-start">
              <ProfileBlock username={userName} imageUrl={user?.image} />
            </div>
            <div className="flex flex-col w-full">
              <div className="mb-[10px] w-full md:max-w-[1200px] h-[35px] rounded-[10px] px-4 py-1 bg-gray-200 dark:bg-gray-700"></div>
              <div className="mb-[10px] w-full md:max-w-[1200px] min-h-[90px] rounded-[10px] px-4 py-2 bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex items-center justify-between gap-4 mt-1">
                <div className="flex items-center gap-5">
                  <div className="w-[22px] h-[22px] bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  <div className="w-[22px] h-[22px] bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="shadow-md w-full max-w-full md:max-w-[1200px] mx-auto rounded-[10px] border border-[#d9d9d9] dark:border-[#4c4c4c] flex flex-col">
        <div className="p-[24px] flex gap-[25px]">
          {/* 왼쪽 프로필 영역 */}

          <div className="flex-shrink-0 self-start">
            <ProfileBlock username={userName} imageUrl={user?.image} />
          </div>

          {/* 오른쪽 입력 영역 */}
          <div className="flex flex-col w-full">
            {/* 제목 입력 */}
            <input
              type="text"
              value={title}
              onChange={(e) => {
                if (e.target.value.length <= 20) setTitle(e.target.value);
              }}
              placeholder="제목을 입력해 주세요. (20자 이내)"
              className="text-[16px] border border-[#d9d9d9] dark:border-[#4c4c4c] mb-[10px] 
            w-full md:max-w-[1200px] h-[35px] rounded-[10px] px-4 py-1 
            box-border focus:border-[#0033a0] focus:outline-none"
            />

            {/* 내용 입력 */}
            <div className="relative">
              <textarea
                value={contents}
                onChange={(e) => setContents(e.target.value)}
                placeholder="내용을 입력해 주세요."
                className="text-[16px] border border-[#d9d9d9] dark:border-[#4c4c4c] mb-[10px] 
              w-full md:max-w-[1200px] min-h-[90px] rounded-[10px] px-4 py-2 
              box-border resize-none focus:border-[#0033a0] 
              focus:outline-none overflow-auto whitespace-pre-wrap pb-[60px]"
              />

              {images && (
                <div className="my-4">
                  <img
                    src={images}
                    alt="Uploaded"
                    className="max-w-full rounded-md"
                  />
                </div>
              )}
            </div>

            {/* 아이콘 + POST 버튼 영역 */}
            <div className="flex items-center justify-between gap-4 mt-1">
              {/* 왼쪽 아이콘들 */}
              <div className="flex items-center gap-5">
                {images ? (
                  <button
                    type="button"
                    onClick={deleteImgHandler}
                    title="이미지 삭제"
                    className="hover:opacity-80 transition-transform duration-200 hover:scale-105 cursor-pointer"
                  >
                    <LuImageMinus className="text-[22px] text-[#ababab]" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={ImgClickHandler}
                    title="이미지 삽입"
                    className="hover:opacity-80 transition-transform duration-200 hover:scale-105 cursor-pointer"
                  >
                    <LuImagePlus className="text-[22px] text-[#ababab]" />
                  </button>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={ImgInputRef}
                  onChange={ImgFileChangeHandler}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  onClick={UndoHandler}
                  title="되돌리기"
                  className="hover:opacity-80 transition-transform duration-200 hover:scale-105 cursor-pointer"
                >
                  <MdOutlineReplay className="text-[22px] text-[#ababab]" />
                </button>
              </div>

              {/* 오른쪽 EDIT 버튼 */}
              <div className="flex items-center justify-end w-full">
                <Button
                  onClick={editHandler}
                  disabled={!title.trim() && !contents.trim() && !images}
                >
                  수정완료
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
