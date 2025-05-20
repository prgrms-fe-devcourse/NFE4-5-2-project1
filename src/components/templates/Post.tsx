// src/components/pages/Post.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { getPost, deletePost } from '../../api/posts';
import { getAuthUser } from '../../api/auth'; // 로그인 사용자 정보 불러오기
import { likePost, unlikePost } from '../../api/likes'; // 좋아요 생성/취소 API
import { createNotification } from '../../api/notifications'; // ← 추가
import PostCard from '../molecules/PostCard';
import CommentBox, { Comment } from '../molecules/CommentBox';
import FloatingButton from '../atoms/FloatingButton';
import { toast } from 'react-toastify';

interface Like {
  _id: string;
  user: string;
  post: string;
  createdAt: string;
}

export default function Post() {
  const { postId } = useParams<{ postId: string }>(); // 나중에 params 사용
  const navigate = useNavigate();

  // --- 상태 정의 ---
  const [me, setMe] = useState<any>(null); // 로그인된 사용자
  const [post, setPost] = useState<any>(null); // 포스트 데이터
  const [comments, setComments] = useState<Comment[]>([]); // 댓글 목록 상태
  const [likes, setLikes] = useState<Like[]>([]); // 좋아요 목록 상태
  const [isLiked, setIsLiked] = useState(false); // 내가 좋아요 눌렀는지
  const [myLikeId, setMyLikeId] = useState<string | null>(null); // 내 좋아요 ID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) return;

    (async () => {
      try {
        // 1) 로그인된 사용자 정보 가져오기
        const user = await getAuthUser();
        setMe(user);

        // 2) 포스트 + 댓글 + 좋아요 데이터 불러오기
        const data = await getPost(postId);
        setPost(data);
        setComments(data.comments ?? []);
        setLikes(data.likes ?? []);

        // 3) 로그인된 내 좋아요가 이미 있는지 확인
        const existing = (data.likes as Like[]).find(
          (l) => l.user === user._id,
        );
        if (existing) {
          setIsLiked(true);
          setMyLikeId(existing._id);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || '불러오기 실패');
      } finally {
        setLoading(false);
      }
    })();
  }, [postId]);

  // postId가 없으면 404
  if (!postId) {
    return <Navigate to="*" replace />;
  }

  // 4) 포스트 삭제 핸들러
  const handleDeletePost = async () => {
    if (!confirm('정말 이 포스트를 삭제하시겠습니까?')) return;
    try {
      await deletePost(postId);
      toast.success('삭제되었습니다.');
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('삭제 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <p>로딩 중…</p>;
  if (error) return <Navigate to="*" replace />;
  if (!post) return null;

  // 5) title/body/tags JSON 파싱 (임시 방편)
  let parsedTitle = post.title;
  let parsedBody = (post as any).body ?? '';
  let parsedTags: string[] = [];
  try {
    const obj = JSON.parse(post.title);
    parsedTitle = obj.title;
    parsedBody = obj.body;
    parsedTags = obj.tags ?? [];
  } catch {
    /* JSON 아니면 그대로 */
  }

  // 6) 좋아요 토글 핸들러
  const handleLike = async () => {
    if (isLiked && myLikeId) {
      // 좋아요 취소
      await unlikePost(myLikeId);
      setLikes((prev) => prev.filter((l) => l._id !== myLikeId));
      setIsLiked(false);
      setMyLikeId(null);
    } else {
      // 좋아요 추가
      const newLike = await likePost(postId);
      setLikes((prev) => [...prev, newLike]);
      setIsLiked(true);
      setMyLikeId(newLike._id);

      // 좋아요 알림 생성
      try {
        await createNotification({
          notificationType: 'LIKE', // 알림 타입: LIKE
          notificationTypeId: newLike._id, // 생성된 좋아요 ID
          userId: post.author._id, // 알림 받을 사람(포스트 작성자) ID
          postId: postId, // 좋아요가 달린 포스트 ID
        });
      } catch (e) {
        console.error('좋아요 알림 생성 실패', e);
      }
    }
  };

  // 7) 로그인된 사용자가 작성자인지 비교
  const canDelete = me?._id === post.author?._id;

  return (
    <div className="relative flex flex-col items-center gap-4 py-8">
      <PostCard
        title={parsedTitle}
        body={parsedBody}
        imageUrl={post.image}
        authorName={post.author?.fullName || '탈퇴한 사용자'}
        authorId={post.author?._id || 'user'}
        createdAt={post.createdAt}
        tags={parsedTags}
        canDelete={canDelete}
        onDelete={handleDeletePost}
        channelId={post.channel._id}
      />

      {/* 댓글 입력/목록 */}
      <CommentBox
        postId={postId}
        initialComments={comments}
        postAuthorId={post.author?._id || '탈퇴한 사용자'}
      />

      {/* 좋아요 FloatingButton */}
      <div className="fixed top-100 right-40">
        <FloatingButton
          buttonType="like"
          isLiked={isLiked}
          count={likes.length}
          onLike={handleLike}
        />
      </div>
    </div>
  );
}
