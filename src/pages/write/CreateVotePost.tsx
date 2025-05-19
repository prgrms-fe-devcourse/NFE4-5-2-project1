import { useCallback, useRef, useState } from "react";
import ChannelName from "../../components/channel/ChannelName";
import Button from "../../components/common/Button";
import Editor from "../../components/editor/Editor";
import { createCodePost } from "../../api/write/write";
import { useNavigate, useParams } from "react-router-dom";
import { Theme } from "../../types/darkModeTypes";
import { dark } from "../../utils/darkModeUtils";
import { usePostStore } from "../../stores/postStore";

export default function CreateVotePost({ theme }: { theme: Theme }) {
  const params = useParams();
  const [title, setTitle] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState(""); // Editor에서 본문 HTML을 받음

  const [pollOptions, setPollOptions] = useState<
    { id: number; text: string }[]
  >([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const { channelId } = useParams();
  const channel = params.channelId;
  const channelIdList = usePostStore((state) => state.channelIdList);

  const handlePollCreate = useCallback(
    (options: { id: number; text: string }[]) => {
      setPollOptions(options);
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const titleText = titleRef.current?.value || "";

    if (!channelId) {
      console.error("채널 ID가 없습니다.");
      return;
    }

    const formData = new FormData();

    formData.append(
      "title",
      JSON.stringify({
        title: titleText,
        content: content,
        pollOptions: pollOptions,
      })
    );
    formData.append("channelId", channelIdList[Number(channel) - 1]);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = await createCodePost(formData);
      console.log("작성 성공:", res.data);
      // 성공 시 이동
      navigate(`/channel/${channelId}`);
    } catch (err) {
      console.error("작성 실패", err);
    }
  };

  const isSubmitDisabled = title.trim() === "" || content.trim() === "";
  return (
    <>
      <div className='w-full h-full pb-[30px]'>
        <div className='w-full max-h-[820px] h-full grid grid-rows-[auto_1fr_auto]'>
          <div className='pb-[20px]'>
            <ChannelName channelId={channelId ?? "3"} theme={theme} />
          </div>

          <div
            className={`shadow-md rounded-[10px] p-5 relative h-full overflow-hidden ${
              dark(theme)
                ? "bg-[#2d2d2d] text-[#ffffff]"
                : "bg-[#ffffff] text-[#111111]"
            }`}
          >
            <input
              type='text'
              ref={titleRef}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='제목을 입력하세요'
              autoFocus
              className='w-full font-semibold text-[23px] px-3 py-2 outline-none'
            />
            <hr
              className={`mt-[15px] mb-[15px] opacity-30 ${
                dark(theme) ? "text-[#ffffff]" : "text-[#111111]"
              }`}
            />
            <Editor
              onChange={setContent}
              onPollCreate={handlePollCreate}
              onImageSelect={(file) => setImageFile(file)}
              showPollButton={true}
              initialContent={content}
              theme={theme}
            />
            <hr
              className={`mb-[20px]  opacity-30 ${
                dark(theme) ? "text-[#ffffff]" : "text-[#111111]"
              }`}
            />

            <div className='text-right'>
              <Button
                value='완료'
                className={`button-style2 ${
                  isSubmitDisabled
                    ? dark(theme)
                      ? "bg-[#3a3a3a] text-[#777777] cursor-not-allowed"
                      : "bg-gray-400 text-[#ffffff] cursor-not-allowed"
                    : dark(theme)
                    ? "bg-[#1e1e1e] text-[#ffffff]"
                    : "bg-[#1E293B] text-[#ffffff]"
                }`}
                onClick={(e) => {
                  if (isSubmitDisabled) {
                    e.preventDefault();
                    return;
                  }
                  handleSubmit(e);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
