import { useEffect, useState } from 'react';
import likeIcon from '../../assets/icons/like.svg';
import darkModeLike from '../../assets/icons/darkModeLike.svg';
import likedIcon from '../../assets/icons/liked.svg';
import footPrint from '../../assets/icons/footPrintBlack.svg';
import footPrintWhite from '../../assets/icons/footprintWhite.svg';
import { axiosInstance } from '../../api/axios';
import { useAuthStore } from '../../stores/authStore';
import { useDarkModeStore } from '../../stores/darkModeStore';

// 외부로부터 어떤 props를 받는지 정의
interface PostInteractionProps {
  // 게시물 id
  postId: string;
  postAuthorId: string;
  // 게시물 좋아요 배열
  likes: likesObj[];
  // 게시물 댓글 배열
  comments: commentsObj[];
  className?: string;
}

interface commentsObj {
  _id: string;
  comment: string;
  author: { fullname: string; image: string };
}

interface likesObj {
  _id: string;
  user: string;
  post: string;
  createdAt: string;
}

export default function PostInteraction({
  // 이 컴포넌트가 props로 받는 3가지
  postId,
  postAuthorId,
  likes,
}: PostInteractionProps) {
  const { isDarkMode } = useDarkModeStore();

  // 좋아요를 눌렀는지 안눌렀는지
  const [liked, setLiked] = useState(false);
  // 게시물의 좋아요 수 (기본값을 likes.length 로 넣어, 처음 로딩 시 받은 데이터를 기반으로 렌더링한다)
  const [likeCount, setLikeCount] = useState(likes.length);
  // 내가 누른 좋아요의 Id, (좋아요 취소할때 필요함)
  const [likeId, setLikeId] = useState<string | null>(null);

  // 로그인한 유저 ID (이건 useAuthStore 에서 불러오고있음)
  const userId = useAuthStore((state) => state.userId);

  // 처음 렌더링될때 실행
  useEffect(() => {
    // 로그인한 유저가 없으면 리턴하기
    // 이게 사실 의미가 있나 싶음... 일단 주석 해둠
    // if (!userId) return;

    // 좋아요 중복 확인
    // likes 배열에서 userId와 일치하는 like 객체를 찾는다. (이미 좋아요를 눌렀는지 판단하기 위해)
    const myLike = likes.find((like) => like.user === userId);
    // console.log('likes: ', likes);
    // 얘가 undefined 나옴
    // console.log('내가 누른 좋아요', myLike);
    // .find: 조건에 맞는 첫번째 요소를 반환하는 함수
    if (myLike) {
      // 이미 눌렀다면 liked 상태를 true로
      setLiked(true);
      // 해당 좋아요 ID를 저장하기 (취소를 위해)
      setLikeId(myLike._id);
    } else {
      setLiked(false);
      setLikeId(null);
    }
  }, [likes, userId]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // 특정 포스트의 정보 불러오기
  // const postDetails = async () => {
  //   try {
  //     const response = await axiosInstance.get(`/posts/${postId}`);
  //     console.log(response.data);
  //   } catch (error) {
  //     console.log('게시글 정보를 불러오지 못했습니다');
  //   }
  // };

  const toggleLike = async () => {
    const prevLiked = liked;
    const prevLikeId = likeId;
    const prevCount = likeCount;

    // 낙관적 업데이트
    setLiked(!liked);
    setLikeCount(!liked ? likeCount + 1 : likeCount - 1);

    try {
      if (!liked) {
        console.log('postAuthorId:', postAuthorId);
        console.log('userId:', userId);
        console.log('postAuthorId:', postAuthorId);
        console.log('userId !== postAuthorId:', userId !== postAuthorId);

        // 좋아요 생성
        const likePost = await axiosInstance.post('/likes/create', { postId });
        const createdLike = likePost.data;

        if (createdLike && createdLike._id) {
          setLikeId(createdLike._id);
          console.log('좋아요 생성 성공:', createdLike);

          if (userId !== postAuthorId) {
            try {
              await axiosInstance.post('/notifications/create', {
                notificationType: 'LIKE',
                notificationTypeId: createdLike._id,
                userId: postAuthorId,
                postId: postId,
              });
              console.log(
                `사용자 [${postAuthorId}]에게 좋아요 알림 생성 요청 성공!`
              );
            } catch (notificationError) {
              console.error('좋아요 알림 생성 실패:', notificationError);
            }
          }
        } else {
          console.error(
            '좋아요 생성 후 응답에서 ID를 받지 못했습니다:',
            createdLike
          );
          throw new Error('좋아요 생성 후 ID를 받지 못했습니다.');
        }
      } else {
        if (!likeId) {
          console.error(
            '좋아요 취소 실패: myLikeId가 없습니다. (setMyLikeId가 호출되지 않았거나, 이전 좋아요 정보 없음)'
          );
          setLiked(prevLiked);
          setLikeCount(prevCount);
          return;
        }

        // 좋아요 취소 (Request Body에 id를 포함해야 함)
        await axiosInstance.delete('/likes/delete', {
          data: {
            id: likeId,
          },
        });
        console.log('좋아요 취소 성공: likeId -', likeId);
        setLikeId(null);
      }
    } catch (error) {
      console.error('좋아요 토글 실패:', error);
      setLiked(prevLiked);
      setLikeCount(prevCount);
      setLikeId(prevLikeId);
    }
  };

  return (
    <div>
      <div className="flex flex-col">
        <div className="flex gap-3 mb-[3px]">
          <div
            className="flex flex-row gap-1 cursor-pointer"
            onClick={toggleLike}
          >
            <img
              src={
                liked
                  ? likedIcon // 좋아요 눌렀을 때는 항상 빨간 하트
                  : isDarkMode
                  ? darkModeLike // 다크모드일 때 기본 하트
                  : likeIcon // 일반 모드일 때 기본 하트
              }
              alt="like"
              className="w-[20px]"
            />
            <p className="text-[var(--color-post-text)]">좋아요</p>
            <p className="text-[var(--color-post-text)]">{likeCount}개</p>
          </div>
          <div className="flex flex-row gap-1">
            <img
              src={isDarkMode ? footPrintWhite : footPrint}
              alt="footprint"
              className="w-[20px]"
            />
            <p className="text-[var(--color-post-text)]">발자국</p>
          </div>
        </div>
      </div>
    </div>
  );
}
