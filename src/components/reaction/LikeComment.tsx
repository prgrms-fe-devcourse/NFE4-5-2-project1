import likeClick from '../../assets/images/like/like-click.svg';
import likeClickWhite from '../../assets/images/like/like-click-white.svg';
import likeRed from '../../assets/images/like/like-red.svg';
import comment from '../../assets/images/comment/comment-outline.svg';
import commentWhite from '../../assets/images/comment/comment-white.svg';
import { useCallback, useEffect, useState } from 'react';
import { deleteLikes, postLikes, postNotifications } from '../../api/post/post';
import { useAuthStore } from '../../stores/authStore';
import NotLoginModal from '../post/NotLoginModal';
import { Theme } from '../../types/darkModeTypes';
import { dark } from '../../utils/darkModeUtils';
import { useNavigate } from 'react-router-dom';
import { useChannelItemStore } from '../../stores/channelStore';
import DeletedUserModal from '../post/DeletedUserModal';

// Props 타입
interface LikeCommentProps {
  likeCount: number;
  commentCount: number;
  postId: string;
  likes: Like[];
  theme: Theme;
  author: User;
  channel: Channel;
}

export default function LikeComment({
  likeCount,
  commentCount,
  postId,
  likes,
  theme,
  author,
  channel,
}: LikeCommentProps) {
  // 좋아요 개수 상태
  const [like, setLike] = useState(likeCount);
  // 현재 사용자의 좋아요 클릭 상태
  const [checkLike, setCheckLike] = useState(false);
  // 현재 사용자가 누른 좋아요 아이디 값 상태
  const [likeId, setLikeId] = useState('');

  // 로그인한 사용자 정보 받아오기
  const user = useAuthStore((state) => state.user);
  // 채널 정보 받아오기
  const { channels } = useChannelItemStore();

  const navigate = useNavigate();

  // 로그인 하지 않은 사용자가 게시글에 좋아요, 댓글 클릭 시, 로그인이 필요한 서비스라는 모달 띄워주기
  // 로그인 관련 모달 상태
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  // 탈퇴한 사용자의 게시글에 좋아요, 댓글 클릭 시, 탈퇴한 사용자의 게시글이라는 모달 띄워주기
  // 탈퇴한 사용자 관련 모달 상태
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // 로그인 관련 모달 닫기
  const closeLoginModalHanlder = () => {
    setIsLoginModalOpen(false);
  };

  // 탈퇴한 회원 관련 모달 닫기
  const closeUserModalHanlder = () => {
    setIsUserModalOpen(false);
  };

  // 댓글 클릭 시, 로그인하지 않은 사용자라면 로그인 관련 모달을, 탈퇴한 사용자 게시글이라면 탈퇴한 사용자 관련 모달을 띄워주기
  // 둘 다 해당하지 않는다면 게시글 상세 페이지의 댓글 작성 컴포넌트로 이동하기
  const clickComments = () => {
    if (user) {
      if (!author) {
        setIsUserModalOpen(true);
        return;
      } else {
        channels.map((cha) => {
          if (cha.id === channel._id) {
            navigate(`${cha.to}/post/${postId}`, {
              state: { scrollToComment: true },
            });
          }
        });
      }
    } else {
      setIsLoginModalOpen(true);
      return;
    }
  };

  // 좋아요 클릭 시, 로그인하지 않은 사용자라면 로그인 관련 모달을, 탈퇴한 사용자 게시글이라면 탈퇴한 사용자 관련 모달을 띄워주기
  // 둘 다 해당하지 않는다면 현재 사용자의 좋아요 클릭 상태에 따라 post, delete 요청을 보낸 후, 알림 전송하기
  const clickLikes = async () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    if (!author) {
      setIsUserModalOpen(true);
      return;
    }
    if (!checkLike) {
      try {
        const { data } = await postLikes(postId);

        setLike((like) => like + 1);
        setCheckLike(true);

        setLikeId(data._id);
        sendLikeNotification(data._id);
      } catch (e) {
        console.log(e instanceof Error && e.message);
      }
    } else {
      try {
        const { data } = await deleteLikes(likeId);

        setLike((like) => like - 1);
        setCheckLike(false);

        console.log(data);
        setLikeId('');
      } catch (e) {
        console.log(e instanceof Error && e.message);
      }
    }
  };

  // 좋아요 알림 전송하기
  const sendLikeNotification = async (notificationTypeId: string) => {
    try {
      const { data } = await postNotifications(
        'LIKE',
        notificationTypeId,
        author._id,
        postId
      );
      console.log(data);
    } catch (e) {
      console.log(e instanceof Error && e.message);
    }
  };

  // authStore에서 현재 로그인한 사용자의 id 값을 받아와서 해당 게시글에 사용자가 좋아요를 눌렀는지 확인하기
  const checkClickLikes = useCallback(() => {
    likes.forEach((like) => {
      if (like.user === user?._id) {
        setCheckLike(true);
        setLikeId(like._id);
      }
    });
  }, [likes, user?._id]);

  useEffect(() => {
    if (user && likes.length > 0) {
      checkClickLikes();
    }
  }, [user, likes, checkClickLikes]);

  return (
    <div className="reaction flex justify-end items-center gap-5 p-4">
      <div className="flex items-center gap-1.5">
        <img
          src={checkLike ? likeRed : dark(theme) ? likeClickWhite : likeClick}
          alt="좋아요"
          className="w-5 h-5 cursor-pointer"
          onClick={clickLikes}
        />
        <span
          className={`text-sm ${
            dark(theme) ? 'text-[#ffffff]' : 'text-[#111111]'
          }`}
        >
          {like}
        </span>
      </div>

      <div
        className="flex items-center gap-[10px] cursor-pointer"
        onClick={clickComments}
      >
        <img
          src={dark(theme) ? commentWhite : comment}
          alt="댓글"
          className="w-5 h-5 relative top-[1px]"
        />
        <span
          className={`text-sm ${
            dark(theme) ? 'text-[#ffffff]' : 'text-[#111111]'
          }`}
        >
          {commentCount}
        </span>
      </div>
      {isLoginModalOpen && (
        <NotLoginModal
          closeLoginModalHanlder={closeLoginModalHanlder}
          theme={theme}
        />
      )}
      {isUserModalOpen && (
        <DeletedUserModal
          closeUserModalHanlder={closeUserModalHanlder}
          theme={theme}
        />
      )}
    </div>
  );
}
