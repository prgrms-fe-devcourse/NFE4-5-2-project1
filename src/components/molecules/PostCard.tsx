import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import TimeAgo from '../atoms/TimeAgo';
import UserName from '../atoms/UserName';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import '../../css/PostCard.css';
import completeIcon from '../../assets/images/completeIcon.png';
import completeNotIcon from '../../assets/images/completeNotIcon.png';
import { updatePost } from '../../api/posts';

interface PostCardProps {
  title: string;
  body: string;
  imageUrl?: string;
  authorName: string;
  authorId: string;
  createdAt: string | number | Date;
  tags?: string[];
  onDelete?: () => void;
  canDelete?: boolean;
  channelId: string;
}

export default function PostCard({
  title,
  body,
  imageUrl,
  authorName,
  authorId,
  createdAt,
  tags = [],
  onDelete,
  canDelete,
  channelId,
}: PostCardProps) {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  console.log(title);
  console.log(channelId);

  // 수정 네비게이트
  const handleEdit = () => {
    if (!postId) return;

    navigate(`/writer/${postId}`, {
      state: {
        title,
        body,
        tags,
        imageUrl,
      },
    });
  };

  const UNRESOLVED = '681da0447ffa911fa118e4ca'; // 미해결 채널
  const RESOLVED = '681da03c7ffa911fa118e4c6'; // 해결 채널
  // 버튼 노출 대상 채널
  const codeQuestionChannels = [UNRESOLVED, RESOLVED];

  // 1) 로컬 상태로 현재 해결 여부 관리
  const [isResolved, setIsResolved] = useState(channelId === RESOLVED);

  // 2) 버튼 노출 여부
  const isCodeQuestion = codeQuestionChannels.includes(channelId);

  // 3) 해결/미해결 토글 핸들러
  const handleToggleResolved = async () => {
    if (!postId) return;
    const newChannel = isResolved ? UNRESOLVED : RESOLVED;

    // Optimistic UI: 일단 토글
    setIsResolved(!isResolved);

    try {
      // 포스트 채널만 바꿔서 업데이트
      await updatePost(postId, title, body, newChannel, tags, undefined);
    } catch (err) {
      console.error('채널 변경 실패', err);
      // 실패 시 롤백
      setIsResolved((prev) => !prev);
    }
  };

  return (
    <div className="dark:bg-dark-card h-auto w-[979px] rounded-[5px] border border-[#ABABAB] bg-white px-25 py-8">
      <div className="mb-6 flex items-center justify-between">
        {/* 제목 */}
        <div className="nanum-gothic-bold dark:text-dark-text text-[32px]">
          {title}
        </div>

        {/* 해결/미해결 버튼: 코드질문 채널일 때만 노출 */}
        {isCodeQuestion && (
          <button
            onClick={handleToggleResolved}
            className="nanum-gothic-regular dark:text-dark-text flex flex-shrink-0 items-center text-sm"
          >
            {isResolved ? (
              <>
                해결
                <img src={completeIcon} alt="해결" className="ml-1" />
              </>
            ) : (
              <>
                미해결
                <img src={completeNotIcon} alt="미해결" className="ml-1" />
              </>
            )}
          </button>
        )}
      </div>

      {/* 작성자 + 시간 */}
      <div className="dark:text-dark-text mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to={`/${authorId}`}>
            <UserName name={authorName} className="nanum-gothic-bold" />
          </Link>
          <span className="text-[#979797]">·</span>
          <TimeAgo timestamp={createdAt} />
        </div>

        {/* 수정/삭제 버튼 */}
        {canDelete && (
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="text-sm hover:text-gray-600"
            >
              수정
            </button>
            <button
              onClick={() => onDelete?.()}
              className="text-sm hover:text-gray-600"
            >
              삭제
            </button>
          </div>
        )}
      </div>

      {/* 태그 */}
      {tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="nanum-gothic-regular rounded bg-[#D7CAB9] px-2 py-1 text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <hr className="dark:border-dark-border mb-6 border-t border-[#ABABAB]" />

      {/* 커버 이미지 포스트에서 보이게 */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="post"
          className="mb-6 max-h-[600px] w-full rounded-[5px]"
        />
      )}

      {/* 본문 */}
      <ReactQuill
        value={body}
        readOnly={true}
        theme="snow"
        modules={{ toolbar: false }}
        className="post-readonly-editor dark:text-dark-text"
      />
    </div>
  );
}
