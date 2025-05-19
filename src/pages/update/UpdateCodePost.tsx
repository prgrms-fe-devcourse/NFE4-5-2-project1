import { useCallback, useEffect, useRef, useState } from "react";
import ChannelName from "../../components/channel/ChannelName";
import Button from "../../components/common/Button";
import Editor from "../../components/editor/Editor";
import { getPostData, updatePost } from "../../api/post/post";
import { useNavigate, useParams } from "react-router-dom";
import { Theme } from "../../types/darkModeTypes";
import { dark } from "../../utils/darkModeUtils";
import { usePostStore } from "../../stores/postStore";

export default function UpdateCodePost({ theme }: { theme: Theme }) {
  const params = useParams();
  const titleRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState("");
  const channel = params.channelId;
  const channelIdList = usePostStore((state) => state.channelIdList);

  const [pollOptions, setPollOptions] = useState<
    { id: number; text: string }[]
  >([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageToDeletePublicId, setImageToDeletePublicId] = useState<
    string | null
  >(null); // 이미지 삭제를 위한 변수
  const { channelId, postId } = useParams<{
    channelId: string;
    postId: string;
  }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!postId) return;
        const res = await getPostData(postId);

        const parsedTitle = JSON.parse(res.data.title);
        titleRef.current!.value = parsedTitle.title;
        setContent(parsedTitle.content);
        setPollOptions(parsedTitle.pollOptions || []);
        // 만약 게시물에 이미지가 있다면, 해당 이미지 ID를 설정
        setImageToDeletePublicId(res.data.imagePublicId || null);
      } catch (err) {
        console.error("게시물 데이터를 불러오지 못했습니다", err);
      }
    };

    fetchPost();
  }, [postId]);

  const handlePollCreate = useCallback(
    (options: { id: number; text: string }[]) => {
      setPollOptions(options);
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const titleText = titleRef.current?.value || "";

    if (!channelId || !postId) {
      console.error("채널 ID 또는 게시물 ID가 없습니다.");
      return;
    }

    const formData = new FormData();

    // ✅ 필수값 추가
    formData.append("postId", postId);
    formData.append("channelId", channelIdList[Number(channel) - 1]);

    formData.append(
      "title",
      JSON.stringify({
        title: titleText,
        content: content,
        pollOptions: pollOptions,
      })
    );

    if (imageToDeletePublicId) {
      formData.append("imageToDeletePublicId", imageToDeletePublicId);
    }

    if (imageFile) {
      formData.append("image", imageFile);
    } else {
      formData.append("image", "");
    }

    try {
      const res = await updatePost(formData);
      console.log("수정 성공:", res.data);
      navigate(`/channel/${channelId}`);
    } catch (err) {
      console.error("수정 실패", err);
    }
  };

  return (
    <div className='w-full h-full pb-[30px]'>
      <div className='w-full max-h-[820px] h-full grid grid-rows-[auto_1fr_auto]'>
        <div className='pb-[20px]'>
          <ChannelName channelId={channelId ?? "1"} theme={theme} />
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
            showCodeButton={true}
            initialContent={content}
            theme={theme}
          />

          <hr
            className={`mb-[20px] opacity-30 ${
              dark(theme) ? "text-[#ffffff]" : "text-[#111111]"
            }`}
          />

          <div className='text-right'>
            <Button
              value='완료'
              className={`button-style2 ${
                dark(theme) ? "bg-[#1E1E1E] text-[#ffffff]" : ""
              }`}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
