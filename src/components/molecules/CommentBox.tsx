// src/components/molecules/CommentBox.tsx
import { useState, useRef, useEffect } from 'react';
import Info from '../atoms/Info';
import { getAuthUser } from '../../api/auth';
import { createComment, deleteComment } from '../../api/comments';
import { createNotification } from '../../api/notifications';
import { toast } from 'react-toastify';
import Button from '../atoms/Button';

interface CommentBoxProps {
  postId: string;
  postAuthorId: string;
  initialComments?: Comment[]; // API 쪽 Comment[]
}

// 댓글 생성 인터페이스
export interface Comment {
  _id: string;
  comment: string;
  author: {
    fullName: string;
    image?: string;
    _id: string;
  };
  createdAt: string;
  updatedAt: string;
  // post, __v 등은 필요 없으면 생략해도 됩니다
}

export default function CommentBox({
  postId,
  postAuthorId,
  initialComments = [],
}: CommentBoxProps) {
  // 초기 comments를 생성일시(createdAt) 내림차순 정렬하여 newest-first 로 세팅
  const [comments, setComments] = useState<Comment[]>(() =>
    [...initialComments].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
  );
  const [text, setText] = useState('');
  const [meId, setMeId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // textarea 높이 자동 조정
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${ta.scrollHeight}px`;
    }
  }, [text]);

  // 로그인 유저 ID 조회
  useEffect(() => {
    getAuthUser()
      .then((me) => setMeId(me._id))
      .catch(() => setMeId(null));
  }, []);

  // 댓글 등록
  const handleSubmit = async () => {
    if (!text.trim()) return;
    try {
      const newComment = await createComment(postId, text);
      // 새로 등록된 댓글을 리스트 맨 앞에 추가 (newest-first)
      setComments((prev) => [newComment, ...prev]);
      setText('');
      // 2) 알림 생성
      await createNotification({
        notificationType: 'COMMENT', // 고정: COMMENT
        notificationTypeId: newComment._id, // 방금 생성된 댓글 ID
        userId: postAuthorId, // 알림 받을 사람(포스트 작성자) ID
        postId: postId, // 댓글이 달린 포스트 ID
      });
    } catch {
      console.log('댓글 작성에 실패했습니다.');
    }
  };

  // 댓글 삭제
  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteComment(id);
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch {
      toast.error('댓글 삭제에 실패했습니다.');
    }
  };

  return (
    <div className="dark:border-dark-border dark:bg-dark-card dark:text-dark-text h-auto w-[979px] rounded-[5px] border border-[#ABABAB] bg-white px-25 py-8">
      {/* 댓글 개수 */}
      <p className="nanum-gothic-regular mb-4 text-sm">
        댓글 {comments.length}개
      </p>

      {/* 입력창 */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="댓글을 작성해주세요"
        rows={1}
        className="nanum-gothic-regular mb-3 w-[782px] resize-none overflow-hidden rounded border border-gray-300 p-6 text-sm"
      />

      {/* 등록 버튼 */}
      <div className="m-[-5px] mb-6 flex justify-end">
        <Button onClick={handleSubmit} size="m" full>
          댓글 작성
        </Button>
      </div>

      {/* 댓글 목록 (newest-first) */}
      {comments.map((c) => (
        <div key={c._id} className="mb-10 flex flex-col">
          <div className="flex items-start justify-between">
            <Info
              imageUrl={c.author?.image}
              size={32}
              userName={c.author?.fullName || '탈퇴한 사용자'}
              userId={c.author?._id || 'user'}
              timestamp={c.createdAt}
            />

            {/* 본인 댓글일 때만 삭제 버튼 */}
            {meId === c.author?._id && (
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => handleDelete(c._id)}
                  className="text-sm hover:text-gray-600"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
          {/* 댓글 텍스트 */}
          <p className="nanum-gothic-regular flex-1 leading-relaxed whitespace-pre-line">
            {c.comment}
          </p>

          {/* 구분선 */}
          <hr className="mt-6 w-full border-t border-[#ABABAB]" />
        </div>
      ))}
    </div>
  );
}
