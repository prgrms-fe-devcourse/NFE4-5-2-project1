import ChannelName from '../components/channel/ChannelName';
import PostListItem from '../components/post/PostListItem';
import postBtn from '../assets/images/post/post-btn.svg';
import postBtnWhite from '../assets/images/post/post-btn-white.svg';
import topBtn2 from '../assets/images/top-btn/top-btn.png';
import topBtn2White from '../assets/images/top-btn/top-btn-white.png';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPostList, getSearchPostList } from '../api/post/post';
import { usePostStore } from '../stores/postStore';
import dayjs from 'dayjs';
import { useAuthStore } from '../stores/authStore';
import { Theme } from '../types/darkModeTypes';
import { dark } from '../utils/darkModeUtils';
import PostSkeleton from '../components/post/PostSkeleton';
import NotLoginModal from '../components/post/NotLoginModal';

export default function PostList({ theme }: { theme: Theme }) {
  const params = useParams();
  const channel = params.channelId;

  const navigate = useNavigate();

  // 로그인한 사용자 정보 받아오기
  const user = useAuthStore((state) => state.user);
  // 채널 id 값 받아오기
  const channelIdList = usePostStore((state) => state.channelIdList);

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);
  // 로그인 상태
  const [isLogin, setIsLogin] = useState(false);
  // 로그인 관련 모달 상태
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // 게시글 목록 상태
  const [postListItem, setPostListItem] = useState<Post[]>([]);

  // 검색한 내용 상태
  const [input, setInput] = useState('');
  const changeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // 정렬 상태 (최신순, 인기순)
  const [select, setSelect] = useState('recent');
  const changeSelectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelect(e.target.value);
  };

  // Top 버튼 표시 상태
  const [showTopButton, setShowTopButton] = useState(false);
  // 전체 게시글 목록을 나타내는 div 요소
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const imgSize = dark(theme) ? 'w-[32px] h-[32px]' : 'w-5 h-5';

  // 최신순 정렬을 위한 날짜 포맷 설정
  const getDatetimeFormat = (update: string): string => {
    const date = dayjs(update);
    return date.format('YYYY-MM-DD HH:mm:ss');
  };

  // 스크롤 값에 따른 Top 버튼 표시 여부
  const scrollHandler = () => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      const scrollTop = scrollElement.scrollTop;
      setShowTopButton(scrollTop > 200);
    }
  };

  // 스크롤을 최상단으로 올리기
  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  // 게시글 작성 페이지로 이동
  const createNewPost = () => {
    if (!isLogin) {
      setIsLoginModalOpen(true);
      return;
    }
    navigate(`/channel/${channel}/write`);
  };

  // 엔터 입력 시에도 메시지 전송하기
  const keyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (input.trim() === '') return;
      clickSearchHandler();
    }
  };

  // 검색한 내용에 해당하는 게시글만 필터링
  const filteringItem = (data: Post[]) => {
    const temp = [];
    for (const item of postListItem) {
      for (const res of data) {
        if (item._id === res._id) {
          temp.push(item);
        }
      }
    }
    setPostListItem(temp);
  };

  // 검색한 결과 불러오기 (이 data에는 누락된 필드가 있으므로 다시 필터링을 거쳐서 해당 게시글들을 가져옴)
  const clickSearchHandler = async () => {
    try {
      const { data } = await getSearchPostList(input);
      filteringItem(data);
      setInput('');
    } catch (e) {
      console.log(e instanceof Error && e.message);
    }
  };

  // 채널의 전체 게시글 목록 가져오기
  const getPostListItem = useCallback(async () => {
    try {
      const { data } = await getPostList(channelIdList[Number(channel) - 1]);
      setPostListItem(data);
      setIsLoading(false);
    } catch (e) {
      console.log(e instanceof Error && e.message);
    }
  }, [channel, channelIdList]);

  // 로그인 관련 모달 닫기
  const closeLoginModalHanlder = () => {
    setIsLoginModalOpen(false);
  };

  useEffect(() => {
    if (user) setIsLogin(true);
    getPostListItem();
  }, [user, channel, getPostListItem]);

  // 스크롤 조작을 위한 이벤트 적용
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', scrollHandler);
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', scrollHandler);
      }
    };
  }, []);

  return (
    <>
      <div className="h-full">
        <div className="w-full h-full grid grid-rows-[auto_1fr_auto] relative">
          <div className="flex justify-between items-end pb-[20px] flex-wrap channel-top">
            <div className="mr-3">
              <ChannelName channelId={String(channel)} theme={theme} />
            </div>
            <div className="flex gap-2.5 ml-auto mt-3.5">
              <div className="w-[225px] h-[38px] flex items-center bg-white rounded-[5px] px-2.5 py-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => changeInputHandler(e)}
                  onKeyDown={keyDownHandler}
                  placeholder="검색"
                  className="flex-grow text-[13px] outline-none placeholder-[#989898]"
                />
                <Search
                  className="w-[19.94px] h-[19.94px] text-[#86879C] cursor-pointer"
                  onClick={() => {
                    if (input.trim() === '') return;
                    clickSearchHandler();
                  }}
                />
              </div>
              <select
                value={select}
                onChange={(e) => changeSelectHandler(e)}
                className={`w-[86px] h-[38px] bg-white pl-[11px] py-1.5 rounded-[5px] cursor-pointer text-[13px] appearance-none select-custom`}
              >
                <option value="recent">최신순</option>
                <option value="popular">인기순</option>
              </select>
            </div>
          </div>
          <div
            className="flex flex-col gap-[30px] pb-7.5 overflow-y-auto scroll-custom"
            ref={scrollRef}
          >
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <PostSkeleton key={i} theme={theme} />
              ))
            ) : (
              <>
                {postListItem.length === 0 && (
                  <div
                    className={`flex flex-col justify-center items-center gap-5 text-lg font-semibold pt-16 opacity-60 ${
                      dark(theme) ? 'text-[#ffffff]' : ''
                    }`}
                  >
                    <div>게시글이 없습니다!</div>
                    <div>새로운 게시글을 작성해 보세요!</div>
                  </div>
                )}
                {postListItem.length !== 0 &&
                  select === 'recent' &&
                  [...postListItem]
                    .sort(
                      (a, b) =>
                        new Date(getDatetimeFormat(b.createdAt)).getTime() -
                        new Date(getDatetimeFormat(a.createdAt)).getTime()
                    )
                    .map((item) => (
                      <PostListItem key={item._id} {...item} theme={theme} />
                    ))}
                {postListItem.length !== 0 &&
                  select === 'popular' &&
                  [...postListItem]
                    .sort((a, b) => {
                      if (b.likes.length - a.likes.length !== 0)
                        return b.likes.length - a.likes.length;
                      else return b.comments.length - a.comments.length;
                    })
                    .map((item) => (
                      <PostListItem key={item._id} {...item} theme={theme} />
                    ))}
              </>
            )}
          </div>
          {showTopButton && (
            <div
              className={`absolute right-[50%] translate-x-1/2 bottom-[35px] cursor-pointer flex justify-center items-center w-14 h-14 rounded-[50%]  shadow-[1px_3px_3px_rgba(0,0,0,0.25)] ${
                dark(theme) ? 'bg-[#1e1e1e]' : 'bg-[#ffffff]'
              }`}
              onClick={scrollToTop}
            >
              <img
                src={dark(theme) ? topBtn2White : topBtn2}
                onClick={scrollToTop}
                alt="top 버튼"
                className={`w-5 h-5 ${imgSize} cursor-pointer`}
              />
            </div>
          )}
          {isLogin && (
            <div className="post-write-button absolute -right-[90px] bottom-[25px] cursor-pointer">
              <img
                src={dark(theme) ? postBtnWhite : postBtn}
                onClick={createNewPost}
                alt="게시글 작성 버튼"
              />
            </div>
          )}
        </div>
      </div>
      {isLoginModalOpen && (
        <NotLoginModal
          closeLoginModalHanlder={closeLoginModalHanlder}
          theme={theme}
        />
      )}
    </>
  );
}
