import { useLocation, useParams } from 'react-router-dom';
import ChannelName from '../components/channel/ChannelName';
import PostDetailItem from '../components/post/PostDetailItem';
import WriteCommentItem from '../components/post/WriteCommentItem';
import { getPostList } from '../api/post/post';
import { usePostStore } from '../stores/postStore';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Theme } from '../types/darkModeTypes';
import PostDetailSkeleton from '../components/post/PostDetailSkeleton';

export default function PostDetail({ theme }: { theme: Theme }) {
  const params = useParams();
  const channel = params.channelId;
  const post = params.postId;

  const location = useLocation();

  // 채널 id 값 받아오기
  const channelIdList = usePostStore((state) => state.channelIdList);

  // 댓글 작성 컴포넌트를 나타내는 div 요소
  const commentRef = useRef<HTMLDivElement | null>(null);

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);

  // 게시글 상태
  const [postItem, setPostItem] = useState<Post | null>(null);

  // 댓글 작성할 때마다 useEffect를 재실행하기 위한 트리거
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const updateReloadTrigger = () => {
    setReloadTrigger((reloadTrigger) => reloadTrigger + 1);
  };

  // 해당 게시글만 필터링
  const filteringItem = useCallback(
    (data: Post[]) => {
      for (const res of data) {
        if (res._id === post) {
          setPostItem(structuredClone(res));
        }
      }
    },
    [post]
  );

  // 게시글 목록 불러오기 (게시글 id에 해당하는 게시글만 필터링)
  const getPostItem = useCallback(async () => {
    try {
      const { data } = await getPostList(channelIdList[Number(channel) - 1]);
      filteringItem(data);
      setIsLoading(false);
    } catch (e) {
      console.log(e instanceof Error && e.message);
    }
  }, [channel, channelIdList, filteringItem]);

  useEffect(() => {
    getPostItem();
  }, [reloadTrigger, getPostItem]);

  // 댓글 아이콘 클릭 후 현재 페이지 접근 시, 댓글 작성 컴포넌트가 화면에 보이도록 스크롤 조정
  useEffect(() => {
    if (location.state?.scrollToComment && postItem) {
      const timeout = setTimeout(() => {
        if (commentRef.current) {
          commentRef.current.scrollIntoView({
            block: 'center',
            behavior: 'smooth',
          });
        }
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [location.state, commentRef, postItem]);

  return (
    <>
      <div className="grid grid-rows-[auto_1fr_auto] h-full">
        <div className="flex justify-between items-end pb-[20px]">
          <ChannelName channelId={String(channel)} theme={theme} />
        </div>
        {isLoading ? (
          Array.from({ length: 1 }).map((_, i) => (
            <PostDetailSkeleton key={i} theme={theme} />
          ))
        ) : (
          <>
            {postItem && (
              <div className="flex flex-col gap-[30px] h-full overflow-auto scroll-custom pb-[30px]">
                <PostDetailItem
                  {...postItem}
                  updateReloadTrigger={updateReloadTrigger}
                  theme={theme}
                />
                <div ref={commentRef}>
                  <WriteCommentItem
                    channelId={String(channel)}
                    postId={String(post)}
                    postUserId={postItem.author._id}
                    updateReloadTrigger={updateReloadTrigger}
                    theme={theme}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
