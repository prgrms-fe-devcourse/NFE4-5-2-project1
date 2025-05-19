import Avatar from '../avatar/Avatar';
import LikeComment from '../reaction/LikeComment';
import menuIcon from '../../assets/images/menu/menu-icon.svg';
import menuIconWhite from '../../assets/images/menu/menu-icon-white.svg';
import { useCallback, useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { getPostList } from '../../api/post/post';
import { usePostStore } from '../../stores/postStore';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CommentListItem from './CommentListItem';
import { useAuthStore } from '../../stores/authStore';
import DOMPurify from 'dompurify';
import PollOptionsVoteView from '../poll/PollOptionsVoteView';
import CheckDeleteModal from './CheckDeleteModal';
import { Theme } from '../../types/darkModeTypes';
import { dark } from '../../utils/darkModeUtils';
import getElapsedTime from '../../utils/getDatetime';

// updateReloadTrigger 타입 추가
interface PostDetailItemProps extends Post {
  updateReloadTrigger: () => void;
  theme: Theme;
}

export default function PostDetailItem({
  _id,
  title,
  author,
  likes,
  comments,
  createdAt,
  channel,
  updateReloadTrigger,
  theme,
}: PostDetailItemProps) {
  const params = useParams();
  const channelId = params.channelId;
  const post = params.postId;

  const navigate = useNavigate();

  // 수정, 삭제 모달을 나타내는 div 요소
  const modalRef = useRef<HTMLDivElement | null>(null);

  // 파싱 결과 저장
  const pollOptions = JSON.parse(title).pollOptions;

  // 채널 id 값 받아오기
  const channelIdList = usePostStore((state) => state.channelIdList);

  // 로그인한 사용자 정보 받아오기
  const user = useAuthStore((state) => state.user);

  // 댓글 목록 상태
  const [commentListItem, setCommentListItem] = useState<Comment[]>([]);
  // 해당 게시글 작성자 여부 상태
  const [isUser, setIsUser] = useState(false);
  // 수정, 삭제 모달 상태
  const [isOpen, setIsOpen] = useState(false);
  const clickMenuHandler = () => {
    setIsOpen(!isOpen);
  };
  // 삭제할 건지 한 번 더 물어보는 모달 상태
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 코드 블록 스타일 적용하기
  const editCodeStyle = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const codes = doc.querySelectorAll('pre');
    const codeStr = '<span>&lt;/&gt;</span>';
    codes.forEach((code) => {
      code.style.backgroundColor = dark(theme) ? '#1e1e1e' : '#ececec';
      code.style.color = dark(theme) ? '#ffffff' : '#111111';
      code.style.padding = '20px';
      code.style.paddingTop = '2px';
      code.style.marginTop = '10px';
      code.style.marginBottom = '10px';
      code.style.borderRadius = '8px';
      code.innerHTML = codeStr + '<br/><br/>' + code.innerHTML;

      const span = code.querySelector('span');
      span!.style.fontSize = '12px';
      span!.style.opacity = '30%';
      span!.style.marginLeft = '-9px';
    });

    return doc.body.innerHTML;
  };

  // 최신순 정렬을 위한 댓글 시간 포맷 설정
  const getDatetimeSortFormat = (update: string): string => {
    const date = dayjs(update).add(9, 'hour');
    return date.format('YYYY-MM-DD HH:mm:ss');
  };

  // 로그인한 사용자가 해당 게시글 작성자인지 확인
  const checkPostUser = useCallback(() => {
    if (author._id === user?._id) {
      setIsUser(true);
    }
  }, [author._id, user?._id]);

  // 해당 게시글의 댓글 목록 필터링
  const filteringItem = useCallback(
    (data: Post[]) => {
      for (const res of data) {
        if (res._id === post) {
          setCommentListItem(res.comments);
        }
      }
    },
    [post]
  );

  // 게시글 목록 불러오기 (게시글 id에 해당하는 댓글만 필터링)
  const getPostItem = useCallback(async () => {
    try {
      const { data } = await getPostList(channelIdList[Number(channelId) - 1]);
      filteringItem(data);
    } catch (e) {
      console.log(e instanceof Error && e.message);
    }
  }, [channelId, channelIdList, filteringItem]);

  // 수정 버튼 클릭 시, 게시글 수정 페이지로 이동하기
  const clickUpdateHandler = () => {
    navigate(`/channel/${channelId}/update/${post}`);
  };

  // 삭제 버튼 클릭 시, 삭제할 건지 한 번 더 물어보는 모달 띄우기
  const clickDeleteHandler = () => {
    setIsDeleteModalOpen(true);
  };

  // 삭제할 건지 한 번 더 물어보는 모달 닫기
  const closeDeleteModalHanlder = () => {
    setIsDeleteModalOpen(false);
  };

  // 수정, 삭제 모달 닫기
  const closeHandler = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (user) {
      getPostItem();
      checkPostUser();
    }
  }, [user, comments, checkPostUser, getPostItem]);

  // 수정, 삭제 모달 밖 영역 클릭 시, 모달 닫기
  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        closeHandler();
      }
    };

    window.addEventListener('mousedown', clickHandler);
    return () => window.removeEventListener('mousedown', clickHandler);
  }, [modalRef]);

  return (
    <>
      <div
        className={`w-full h-auto rounded-[5px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] relative ${
          dark(theme) ? 'bg-[#2d2d2d]' : 'bg-[#ffffff]'
        }`}
      >
        <div className="flex justify-between h-[85px] pl-3 pt-2.5">
          <Link to={`/profile`} state={{ userid: author?._id }}>
            <Avatar
              name={author.fullName}
              email={author.email}
              image={author.image}
              isOnline={author.isOnline}
              theme={theme}
            />
          </Link>
          {/* 로그인한 사용자 id 값과 해당 게시글 작성자 id 값이 일치할 경우 */}
          {isUser && (
            <>
              <div
                onClick={clickMenuHandler}
                className="w-9 h-9 pr-2.5 cursor-pointer"
              >
                <img src={dark(theme) ? menuIconWhite : menuIcon} />
              </div>
              {isOpen && (
                <div
                  className={`flex flex-col w-[91px] h-[70px] rounded-[2px]  absolute top-8 right-4  ${
                    dark(theme)
                      ? 'bg-[#2d2d2d] border border-white/40'
                      : 'border border-[#e5e5e5]'
                  }`}
                  ref={modalRef}
                >
                  <div
                    className={`flex justify-center items-center text-[12px] h-[34px] cursor-pointer ${
                      dark(theme) ? 'text-[#ffffff]/70' : ''
                    }`}
                    onClick={clickUpdateHandler}
                  >
                    수정하기
                  </div>
                  <hr
                    className={` ${
                      dark(theme) ? 'border-[#878787]' : 'opacity-10'
                    }`}
                  />

                  <div
                    className="flex justify-center items-center text-[12px] text-[#FF0404] h-[34px] cursor-pointer"
                    onClick={clickDeleteHandler}
                  >
                    삭제하기
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex flex-col px-[55px] py-[15px] gap-[22px]">
          <div
            className={`text-[20px] font-semibold ${
              dark(theme) ? 'text-[#ffffff]' : 'text-[#111111]'
            }`}
          >
            {JSON.parse(title).title}
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                editCodeStyle(JSON.parse(title).content)
              ),
            }}
            className={`text-[15px] font-normal ${
              dark(theme) ? 'text-[#ffffff]' : 'text-[#111111]'
            }`}
          />
          {/* 투표 옵션이 있을 경우 */}
          {pollOptions.length > 0 && (
            <div className="mt-4">
              <PollOptionsVoteView
                options={pollOptions}
                comments={comments}
                theme={theme}
              />
            </div>
          )}
        </div>
        <div className="flex justify-end pr-5 pb-[9px] text-[#808080] text-sm font-light">
          {getElapsedTime(createdAt)}
        </div>
        <hr className="mx-[18px] text-[#b2b2b2]" />
        <div className="h-[59px]">
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
        <div>
          {commentListItem.length === 0 && <></>}
          {commentListItem
            .filter((item) => {
              try {
                const parsed = JSON.parse(item.comment);
                return parsed.type !== 'vote';
              } catch {
                return true;
              }
            })
            .sort(
              (a, b) =>
                new Date(getDatetimeSortFormat(a.updatedAt)).getTime() -
                new Date(getDatetimeSortFormat(b.updatedAt)).getTime()
            )
            .map((item) => (
              <CommentListItem
                key={item._id}
                {...item}
                updateReloadTrigger={updateReloadTrigger}
                theme={theme}
              />
            ))}
        </div>
      </div>
      {isDeleteModalOpen && (
        <CheckDeleteModal
          type="POST"
          channel={String(channelId)}
          _id={_id}
          closeDeleteModalHanlder={closeDeleteModalHanlder}
          updateReloadTrigger={updateReloadTrigger}
          theme={theme}
        />
      )}
    </>
  );
}
