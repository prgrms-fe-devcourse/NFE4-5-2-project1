// src/components/templates/Writer2.tsx
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
// import { useAuth } from '../../contexts/AuthContext'; // 나중에 전역 로그인 관리용
import { createPost, getPost, updatePost } from '../../api/posts';
import '../../css/PostCard.css';
import coverimage from '../../assets/images/coverimage.png';
import { toast } from 'react-toastify';

interface LocationState {
  title?: string;
  body?: string;
  tags?: string[];
  imageUrl?: string;
}

export default function Writer2() {
  const { postId } = useParams<{ postId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  // 1) 카테고리 목록 & 맵 정의
  const categories = [
    '일상공유',
    '개발일지',
    '취업정보',
    '팀원모집',
    '코드질문',
  ] as const;
  type Category = (typeof categories)[number];
  const channelMap: Record<Category, string> = {
    일상공유: '681d9fee7ffa911fa118e4b5',
    개발일지: '681da0077ffa911fa118e4ba',
    취업정보: '681da0247ffa911fa118e4be',
    팀원모집: '681da0307ffa911fa118e4c2',
    코드질문: '681da0447ffa911fa118e4ca',
  };

  // 2) 선택된 카테고리 상태
  const [category, setCategory] = useState<Category>('일상공유');

  // 입력 필드의 초기값
  const [title, setTitle] = useState(state?.title ?? '');
  const [editor, setEditor] = useState(state?.body ?? '');

  // ▶ 추가: 태그 입력용 상태 (tagsArray: 현재 태그 목록, tagInput: 입력 중 텍스트)
  const [tagsArray, setTagsArray] = useState<string[]>(state?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const tagInputRef = useRef<HTMLInputElement>(null);

  // 커버용 상태 분리
  const [coverFile, setCoverFile] = useState<File>();
  // const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | undefined>(
  //   state?.imageUrl,
  // );
  // ▶ 추가: 커버 파일명 상태
  const [coverFileName, setCoverFileName] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const quillRef = useRef<ReactQuill>(null);

  // ▶ 추가: 커스텀 파일 선택 핸들러
  const onCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverFileName(file.name);
      // const url = URL.createObjectURL(file);
      // setCoverPreviewUrl(url);
    }
  };

  // state가 없고 postId만 있을 때 백엔드에서 불러오기
  useEffect(() => {
    if (postId && !state) {
      getPost(postId)
        .then((data) => {
          setTitle(data.title);
          setEditor(data.body);
          setTagsArray(data.tags ?? []); // ▶ 수정: tagsArray로 세팅
          // if (data.image) setCoverPreviewUrl(data.image);
        })
        .catch((err) => {
          console.error('포스트 불러오기 실패', err);
        });
    }
  }, [postId, state]);

  // Quill 커스텀 이미지 핸들러 (커버 상태 건드리지 않음)
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const range = quillRef.current?.getEditor().getSelection(true);
        quillRef.current
          ?.getEditor()
          .insertEmbed(range?.index ?? 0, 'image', reader.result);
      };
      reader.readAsDataURL(file);
    };
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline'],
          ['blockquote', 'code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean'],
        ],
        handlers: { image: imageHandler },
      },
    }),
    [imageHandler],
  );

  const formats = useMemo(
    () => [
      'header',
      'bold',
      'italic',
      'underline',
      'blockquote',
      'code-block',
      'list',
      'link',
      'image',
    ],
    [],
  );

  // 3) 제출 핸들러: channelMap[category] 사용
  const handleSubmit = useCallback(async () => {
    // 1) 순수 텍스트 추출
    const editorText =
      quillRef.current
        ?.getEditor()
        .getText() // "\n" 만 남아 있는 경우도 있으니
        .trim() || '';

    if (!title.trim() || !editorText) {
      toast.error('제목과 내용을 모두 입력해주세요.');
      return;
    }
    if (!title.trim() || !editor.trim()) {
      toast.error('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      // ▶ 수정: tagsArray 사용
      const tagArray = tagsArray.map((t) => t.trim()).filter(Boolean);
      const selectedChannelId = channelMap[category];

      if (postId) {
        await updatePost(
          postId,
          title,
          editor,
          selectedChannelId,
          tagArray,
          coverFile,
        );
        toast.success('포스트가 성공적으로 수정되었습니다!');
        navigate(`/post/${postId}`);
      } else {
        // 새 포스트 생성 후 반환된 ID로 해당 게시글 페이지로 이동
        const created = await createPost(
          title,
          editor,
          selectedChannelId,
          tagArray,
          coverFile,
        );
        toast.success('포스트가 성공적으로 생성되었습니다!');
        navigate(`/post/${created._id}`);
      }
    } catch (err: any) {
      console.error(err);
      toast.error('오류 발생: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [postId, title, editor, tagsArray, coverFile, category, navigate]);

  return (
    <div>
      {/* 카테고리 버튼 그룹 (가로 중앙 정렬) */}
      <div className="nanum-gothic-regular dark:text-dark-text flex w-full justify-center gap-5 pt-10">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`cursor-pointer rounded px-4 py-2 ${
              category === cat ? 'opacity-100' : 'opacity-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="nanum-gothic-regular flex min-h-[700px] w-[1200px] gap-4 px-55 py-5">
        <div className="dark:bg-dark-card dark:text-dark-text dark:border-dark-border flex flex-1 flex-col gap-4 rounded-[5px] border border-[#ABABAB] px-10 py-10">
          <div className="flex items-center justify-between gap-4">
            {/* 제목 입력 */}
            <input
              type="text"
              placeholder="제목을 작성해주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-18 w-full flex-1 rounded px-2 py-1 text-[32px] focus:outline-none"
            />

            {/* ▶ 커버 이미지 업로드 (커스텀) */}
            <div className="flex">
              {/* ▶ 숨긴 실제 input */}
              <img src={coverimage} alt="" />
              <input
                id="cover-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onCoverChange}
              />
              {/* ▶ 클릭하면 파일 선택창 띄우는 버튼 */}
              <label
                htmlFor="cover-input"
                className="dark:text-dark-text inline-block cursor-pointer rounded px-3 py-1 text-sm text-[#ABABAB]"
              >
                {coverFileName || '커버 이미지 업로드'}
              </label>
              {/* ▶ 선택된 이미지 미리보기 (필요 시 주석 해제) */}
              {/* {coverPreviewUrl && (
                <img
                  src={coverPreviewUrl}
                  alt="커버 이미지 미리보기"
                  className="mt-2 max-h-[200px] max-w-[200px] rounded-[5px] object-cover"
                />
              )} */}
            </div>
          </div>

          {/* ▶ 태그 입력/삭제 및 백스페이스 삭제 지원 */}
          <div
            className="flex flex-wrap items-center gap-1 rounded px-2 py-1"
            onClick={() => tagInputRef.current?.focus()}
          >
            {tagsArray.map((tag, idx) => (
              <span
                key={idx}
                className="flex items-center rounded bg-[#D7CAB9] px-2 py-0.5 text-sm text-black"
              >
                {tag}
                <button
                  type="button"
                  onClick={() =>
                    setTagsArray((prev) => prev.filter((_, i) => i !== idx))
                  }
                  className="text-xs font-bold"
                ></button>
              </span>
            ))}
            <input
              ref={tagInputRef}
              className="min-w-[100px] flex-1 focus:outline-none"
              value={tagInput}
              placeholder="태그를 입력해주세요"
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                // 백스페이스/Del 누르고 입력값이 비어 있으면 마지막 태그 삭제
                if (
                  (e.key === 'Backspace' || e.key === 'Delete') &&
                  tagInput === ''
                ) {
                  e.preventDefault();
                  setTagsArray((prev) => prev.slice(0, -1));
                  return;
                }
                // Enter 또는 쉼표로 태그 추가
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  const val = tagInput.trim().replace(/,$/, '');
                  if (val && !tagsArray.includes(val)) {
                    setTagsArray((prev) => [...prev, val]);
                  }
                  setTagInput('');
                }
              }}
            />
          </div>

          <hr className="dark:border-dark-border mb-4 border-t border-[#ABABAB]" />

          {/* 본문 에디터 */}
          <ReactQuill
            ref={quillRef}
            value={editor}
            onChange={setEditor}
            modules={modules}
            formats={formats}
            theme="snow"
            placeholder="내용을 입력해주세요"
            className="post-readonly-editor nanum-gothic-regular flex-1"
          />

          {/* 제출 버튼 */}
          <div className="mt-9 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`nanum-gothic-regular h-[40px] w-[100px] cursor-pointer rounded-[5px] text-white ${
                loading ? 'cursor-not-allowed bg-gray-400' : 'bg-[#6B4C36]'
              }`}
            >
              {postId
                ? loading
                  ? '수정 중…'
                  : '수정 완료'
                : loading
                  ? '작성 중…'
                  : '작성 완료'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
