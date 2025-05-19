import Avatar from '../avatar/Avatar';
import LikeComment from '../reaction/LikeComment';
import { Link, useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import NotLoginModal from './NotLoginModal';
import DOMPurify from 'dompurify';
import DeletedUserModal from './DeletedUserModal';
import { useChannelItemStore } from '../../stores/channelStore';
import PollOptionsView from '../poll/PollOptionsView';
import { Theme } from '../../types/darkModeTypes';
import { dark } from '../../utils/darkModeUtils';
import getElapsedTime from '../../utils/getDatetime';

interface PostListItemProps extends Post {
  theme: Theme;
}

export default function PostListItem(props: PostListItemProps) {
  const {
    _id,
    title,
    image,
    author,
    likes,
    comments,
    createdAt,
    channel,
    theme,
  } = props;
  const { channels } = useChannelItemStore();

  const navigate = useNavigate();

  // 투표 옵션 필드 가져오기
  const pollOptions = JSON.parse(title).pollOptions;

  // 로그인한 사용자 정보 받아오기
  const user = useAuthStore((state) => state.user);

  // 로그인 하지 않은 사용자가 게시글 상세 페이지 클릭 시, 로그인이 필요한 서비스라는 모달 띄워주기
  // 로그인 관련 모달 상태
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  // 탈퇴한 사용자의 게시글 클릭 시, 탈퇴한 사용자의 게시글이라는 모달 띄워주기
  // 탈퇴한 사용자 관련 모달 상태
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // removeImgTags 함수 내부에서 상태 변경 시, 리렌더링이 계속 일어나므로 함수 외부에서 사용
  let codes;

  // 사용자의 팔로우
  const [follow, setFollow] = useState(user?.following);
  useEffect(() => {
    setFollow(user?.following);
  }, [user]);

  // 게시글 content 필드에서 img 태그 내용 및 pre 태그 내용(코드 블록) 삭제
  const removeImgTags = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const imgs = doc.querySelectorAll('img');
    imgs.forEach((img) => img.remove());

    codes = doc.querySelectorAll('pre');

    codes.forEach((code) => {
      code.remove();
    });

    return doc.body.innerHTML;
  };

  // 코드 블록 개수 가져오기
  const setCodeCount = () => {
    if (codes.length > 0) return codes.length;
  };

  // 게시글 클릭 시, 로그인하지 않은 사용자라면 로그인 관련 모달을, 탈퇴한 사용자 게시글이라면 탈퇴한 사용자 관련 모달을 띄워주기
  // 둘 다 해당하지 않는다면 게시글 상세 페이지로 이동하기
  const clickPostHandler = () => {
    if (user) {
      if (!author) {
        setIsUserModalOpen(true);
      } else {
        channels.map((cha) => {
          if (cha.id === channel._id) {
            navigate(`${cha.to}/post/${_id}`);
          }
        });
      }
    } else {
      setIsLoginModalOpen(true);
    }
  };

  // 로그인 관련 모달 닫기
  const closeLoginModalHanlder = () => {
    setIsLoginModalOpen(false);
  };

  // 탈퇴한 회원 관련 모달 닫기
  const closeUserModalHanlder = () => {
    setIsUserModalOpen(false);
  };

  return (
    <>
      <div
        className={`postListItem w-full h-auto rounded-[5px] shadow-md relative ${
          dark(theme) ? 'bg-[#2d2d2d]' : 'bg-[#ffffff]'
        }`}
      >
        <div className='postListItem-top flex justify-between h-[85px] pl-3 pt-2.5'>
          <Link to={`/profile`} state={{ userid: author?._id }}>
            <Avatar
              name={author?.fullName}
              email={author?.email}
              image={author?.image}
              isOnline={author?.isOnline}
              theme={theme}
              follow={follow?.some((f) => f.user === author._id)}
            />
          </Link>
        </div>

        <div
          className={twMerge(
            'postListItem-content flex justify-between px-[55px] py-[15px] gap-[55px] cursor-pointer',
            !image && 'py-[23px]'
          )}
          onClick={clickPostHandler}
        >
          <div
            className={twMerge(
              `postListItem-content-text flex flex-col justify-center w-full gap-[22px] ${
                dark(theme) ? 'text-[#ffffff]' : 'text-[#111111]'
              }`,

              image && 'max-w-[635px]'
            )}
          >
            <div
              className={`postTitle text-[18px] font-semibold truncate ${
                dark(theme) ? 'text-[#ffffff]' : 'text-[#111111]'
              }`}
            >
              {JSON.parse(title).title}
            </div>

            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  removeImgTags(JSON.parse(title).content)
                ),
              }}
              className='postContent text-[15px] font-normal line-clamp-5'
            />
            {/* 투표 옵션이 있을 경우 */}
            {pollOptions && pollOptions.length > 0 && (
              <div className='postPoll mt-4'>
                <PollOptionsView options={pollOptions} theme={theme} />
              </div>
            )}
          </div>
          {image && (
            <div className='postListItem-content-image border border-[#e0e0e0] rounded-[5px]'>
              <img src={image} className='w-[226px] h-[226px]' />
            </div>
          )}
        </div>
        <div
          className={`flex justify-end pr-5 pb-[9px] text-[#808080] text-sm font-light ${
            dark(theme)
              ? 'text-[#ffffff] opacity-50'
              : 'text-[#111111] opacity-50'
          }`}
        >
          {getElapsedTime(createdAt)}
        </div>
        <hr
          className={`mx-[18px] ${
            dark(theme)
              ? 'text-[#ffffff] opacity-50'
              : 'text-[#b2b2b2] opacity-50'
          }`}
        />

        <div
          className={twMerge(
            'flex h-[59px] postListItem-bottom',
            setCodeCount() > 0 ? 'justify-between' : 'justify-end'
          )}
        >
          {setCodeCount() > 0 && (
            <div
              className={`flex justify-center items-center text-[14px] opacity-70 ml-5 ${
                dark(theme) ? 'text-[#ffffff]' : 'text-[#111111]'
              }`}
            >
              +<span className='text-[#ff0000]'>{setCodeCount()}</span>개의 코드
              블록
            </div>
          )}
          <LikeComment
            likeCount={likes.length}
            commentCount={
              comments.filter((c) => {
                try {
                  const parsed = JSON.parse(c.comment);
                  return parsed.type !== 'vote';
                } catch {
                  return true;
                }
              }).length
            }
            postId={_id}
            likes={likes}
            theme={theme}
            author={author}
            channel={channel}
          />
        </div>
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
    </>
  );
}
