import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";
import { LuImagePlus, LuImageMinus } from "react-icons/lu";
import ProfileBlock from "./ProfileBlock";
import { MdOutlineReplay } from "react-icons/md";
import { userStore } from "../../stores/userStore";
import { useParams } from "react-router";
import { AxiosError } from "axios";
import { refreshStore } from "../../stores/refreshStore";
import { createPost } from "../../api/posts";

interface UploadProps {
  titleValue?: string;
  contentValue?: string;
  imageValue?: string;
}

export default function Upload({
  titleValue,
  contentValue,
  imageValue,
}: UploadProps) {
  const { channelId } = useParams();
  const userName = userStore.getState().getUser()?.username;
  // const userFullName = userStore.getState().getUser()?.fullName;
  const currentUser = userStore.getState().getUser();

  const [title, setTitle] = useState(titleValue || "");
  const [contents, setContents] = useState(contentValue || "");
  const [images, setImages] = useState<string | undefined>(imageValue);
  const [imageFiles, setImageFiles] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const ImgInputRef = useRef<HTMLInputElement | null>(null);

  const ImgClickHandler = () => {
    ImgInputRef.current?.click();
  };

  const UndoHandler = () => {
    setTitle("");
    setContents("");
    setImages("");
    setImageFiles(null);
  };

  const ImgFileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    e.target.value = "";

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

  const postHandler = async () => {
    try {
      setIsUploading(true);
      await uploadThread();
      refreshStore.getState().refetch();
      UndoHandler();
    } finally {
      setIsUploading(false);
    }
  };

  // 포스트 업데이트 api 호출
  const uploadThread = async () => {
    try {
      const formData = new FormData();

      formData.append(
        "title",
        JSON.stringify([{ postTitle: title, postContent: contents }])
      );
      formData.append("channelId", channelId || "");

      if (imageFiles) {
        formData.append("image", imageFiles);
      }
      await createPost(formData);

      console.log("파일 업로드 성공");
    } catch (error) {
      const err = error as AxiosError;
      console.error("생성 불가!!!", err.message);
    }
  };

  useEffect(() => {
    if (titleValue) setTitle(titleValue);
    if (contentValue) setContents(contentValue);
    if (imageValue) setImages(imageValue);
  }, [titleValue, contentValue, imageValue]);

  return (
    <>
      {isUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-[#1e1e1e] text-black dark:text-white rounded-xl px-6 py-4 shadow-lg flex flex-col items-center">
            <div className="loader mb-2" />
            <p className="text-center">게시글 업로드 중..</p>
          </div>
        </div>
      )}

      <div className="shadow-md w-full max-w-full md:max-w-[1200px] mx-auto rounded-[10px] border border-[#d9d9d9] dark:border-[#4c4c4c] flex flex-col">
        <div className="p-[24px] flex gap-[25px]">
          {/* 왼쪽 프로필 영역 */}
          <div className="flex-shrink-0 self-start">
            <ProfileBlock
              username={userName ? userName : "익명의 유저"}
              imageUrl={currentUser?.image}
            />
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
            box-border focus:border-[#0033A0] dark:focus:border-[#235bd2] focus:outline-none"
            />

            {/* 내용 입력 */}
            <div className="relative">
              <textarea
                value={contents}
                onChange={(e) => setContents(e.target.value)}
                placeholder="내용을 입력해 주세요."
                className="text-[16px] border border-[#d9d9d9] dark:border-[#4c4c4c] mb-[10px] 
              w-full md:max-w-[1200px] min-h-[90px] rounded-[10px] px-4 py-2 
              box-border resize-none dark:focus:border-[#235bd2] focus:border-[#0033a0] 
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
                    onClick={() => {
                      setImages("");
                      setImageFiles(null);
                    }}
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
              <div className="flex items-center justify-end w-full">
                <Button
                  onClick={postHandler}
                  disabled={!title.trim() && !contents.trim() && !images}
                >
                  업로드
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
