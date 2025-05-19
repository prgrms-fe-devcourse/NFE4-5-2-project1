import { useCallback, useEffect, useState } from 'react';
import Pagination from 'react-js-pagination';
import { getAuthorPostData, getPostData } from '../../api/post/post';
import commentWhite from '../../assets/images/comment/comment-white.svg';
import commentIcon from '../../assets/images/comment/comment-outline.svg';
import { useNavigate } from 'react-router-dom';
import { Theme } from '../../types/darkModeTypes';
import { dark } from '../../utils/darkModeUtils';
import { useAuthStore } from '../../stores/authStore';
import NotLoginModal from '../../components/post/NotLoginModal';

interface ProfileRightProps extends UserPostInfo {
  theme: Theme;
}

export default function ProfileRight({ userData, theme }: ProfileRightProps) {
  const userId = userData?._id;
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [userPostData, setUserPostData] = useState<Post[] | null>(null);
  const [selectedTab, setSelectedTab] = useState<
    'posts' | 'likes' | 'comments'
  >('posts');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const navigate = useNavigate();

  const fetchUserPosts = useCallback(async () => {
    if (!userData?.posts) return;
    const { data } = await getAuthorPostData(userId || '');
    setUserPostData(data);
  }, [userData?.posts, userId]);

  // 좋아요 목록을 시간순 정렬 후 해당 post들을 가져와 표시
  const fetchLikedPosts = useCallback(async () => {
    if (!userData?.likes) return;
    const sortedLikes = [...userData.likes].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const likedPostIds = sortedLikes.map((like) => like.post);
    const likedPosts = await Promise.all(
      likedPostIds.map((postId) => getPostData(postId).then((res) => res.data))
    );
    setUserPostData(likedPosts);
  }, [userData?.likes]);

  // 댓글에서 투표수는 제외
  const filterOutVoteComments = (comments: Comment[]): Comment[] => {
    return comments.filter((comment) => {
      try {
        const parsed = JSON.parse(comment.comment);
        return parsed.type !== 'vote';
      } catch {
        return true;
      }
    });
  };

  // 댓글단 게시글에 몇 번 댓글 단지와 최근 댓글 달았는 지 확인 후, 최신 댓글 기준으로 정렬
  const fetchCommentedPosts = useCallback(async () => {
    if (!userData?.comments) return;

    const filteredComments = filterOutVoteComments(userData.comments || []);

    const sortedComments = [...filteredComments].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const commentCountMap = new Map<string, number>();
    const latestCommentTimeMap = new Map<string, string>();

    sortedComments.forEach((comment) => {
      const count = commentCountMap.get(comment.post) || 0;
      commentCountMap.set(comment.post, count + 1);

      if (!latestCommentTimeMap.has(comment.post)) {
        latestCommentTimeMap.set(comment.post, comment.createdAt);
      }
    });

    const uniquePostIds = Array.from(commentCountMap.keys());
    const commentPosts = await Promise.all(
      uniquePostIds.map((postId) => getPostData(postId).then((res) => res.data))
    );

    const postsWithCommentData = commentPosts.map((post) => ({
      ...post,
      myCommentCount: commentCountMap.get(post._id) || 0,
      latestCommentAt: latestCommentTimeMap.get(post._id) || '',
    }));

    postsWithCommentData.sort(
      (a, b) =>
        new Date(b.latestCommentAt).getTime() -
        new Date(a.latestCommentAt).getTime()
    );

    setUserPostData(postsWithCommentData);
  }, [userData?.comments]);

  // selectedTab이 변경될 때마다 각 탭에 맞는 데이터를 가져옴
  useEffect(() => {
    setCurrentPage(1);
    const fetchData = async () => {
      switch (selectedTab) {
        case 'posts':
          return fetchUserPosts();
        case 'likes':
          return fetchLikedPosts();
        case 'comments':
          return fetchCommentedPosts();
      }
    };
    fetchData();
  }, [selectedTab, fetchCommentedPosts, fetchLikedPosts, fetchUserPosts]);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts =
    userPostData?.slice(indexOfFirstPost, indexOfLastPost) || [];

  let totalTab: Record<string, number> = {
    posts: 0,
    likes: 0,
    comments: 0,
  };
  if (userData) {
    const filteredComments = filterOutVoteComments(userData.comments || []);

    totalTab = {
      posts: userData.posts?.length ?? 0,
      likes: userData.likes?.length ?? 0,
      comments: filteredComments.length,
    };
  }
  const emptyText: Record<string, string> = {
    posts: '게시글을 작성해 주세요.',
    likes: '좋아요를 누른 게시글이 없습니다.',
    comments: '댓글을 단 게시글이 없습니다.',
  };

  const getChannelInfo = (name: string) => {
    const info = {
      Vote: {
        id: 3,
        label: '골라봐',
        bg: {
          light: 'bg-[#60A7F7]',
          dark: 'bg-[#9E68E9]',
        },
      },
      MysteryCode: {
        id: 1,
        label: '이게 왜 되지?',
        bg: {
          light: 'bg-[#10215C]',
          dark: 'bg-[#19A9BE]',
        },
      },
      Default: {
        id: 2,
        label: '이거 왜 안 쓰지?',
        bg: {
          light: 'bg-[#3380DE]',
          dark: 'bg-[#3380DE]',
        },
      },
    };
    return info[name as keyof typeof info] || info.Default;
  };

  const closeLoginModalHanlder = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <div className="w-full min-w-0 px-[26px] pb-[40px] profile-right">
      <div className="w-full flex justify-between items-center mt-[40px] text-[18px] font-semibold">
        <div
          className={`flex pb-[10px] whitespace-nowrap ${
            dark(theme) ? 'text-[#ffffff]' : ''
          }`}
        >
          <div
            className={`cursor-pointer mb-[-13px] px-4 ${
              selectedTab === 'posts'
                ? `border-b-4 ${dark(theme) ? 'border-white' : 'border-black'}`
                : 'opacity-30'
            }`}
            onClick={() => setSelectedTab('posts')}
          >
            <p className="pb-[12px]">포스트</p>
          </div>
          <div
            className={`cursor-pointer mb-[-13px] px-4 ${
              selectedTab === 'likes'
                ? `border-b-4 ${dark(theme) ? 'border-white' : 'border-black'}`
                : 'opacity-30'
            }`}
            onClick={() => setSelectedTab('likes')}
          >
            <p className="pb-[12px]">좋아요</p>
          </div>
          <div
            className={`cursor-pointer mb-[-13px] px-4 ${
              selectedTab === 'comments'
                ? `border-b-4 ${dark(theme) ? 'border-white' : 'border-black'}`
                : 'opacity-30'
            }`}
            onClick={() => setSelectedTab('comments')}
          >
            <p className="pb-[12px]">댓글</p>
          </div>
        </div>

        <p
          className={`font-normal text-[12px] ${
            dark(theme) ? 'text-[#ffffff]/60' : 'text-[#111111]/60'
          }`}
        >
          전체 : {totalTab[selectedTab]}
        </p>
      </div>
      <div
        className={`w-full min-h-[365px]   ${
          dark(theme)
            ? 'border-t-2 border-t-[#ffffff]/30'
            : 'border-t-2 border-t-[#111111]/30'
        }`}
      >
        {userPostData && userPostData.length === 0 && (
          <p
            className={`text-center whitespace-pre-line  text-sm py-45  leading-[3rem] ${
              dark(theme) ? 'text-[#ffffff]/60' : 'text-gray-500'
            }`}
          >
            {emptyText[selectedTab]}
          </p>
        )}

        {currentPosts.map((post) => {
          const { id, label, bg } = getChannelInfo(post.channel.name);
          return (
            <div
              key={post._id}
              className={`relative flex flex-col  border-b-2 ${
                dark(theme) ? 'border-b-[#ffffff]/30' : 'border-b-[#111111]/30'
              } ${selectedTab === 'comments' ? 'py-[6px]' : 'py-4'}`}
            >
              <div className="relative flex flex-wrap items-center py-0.5 px-2 gap-y-2.5">
                <div className="w-[130px]">
                  <div
                    className={`inline-block rounded-[28px] text-[12px] font-bold text-white px-[10px] py-[3px] cursor-pointer ${
                      dark(theme) ? bg.dark : bg.light
                    }`}
                    onClick={() => navigate(`/channel/${id}`)}
                  >
                    {label}
                  </div>
                </div>
                <div className="flex items-center max-w-[calc(100%-130px)] w-full profile-post-title">
                  <div
                    className="min-w-0 flex flex-col cursor-pointer justify-center"
                    onClick={() => {
                      if (!isLoggedIn) {
                        setIsLoginModalOpen(true);
                        return;
                      }
                      navigate(`/channel/${id}/post/${post._id}`);
                    }}
                  >
                    <p
                      className={`font-semibold text-[15px] w-full truncate  ${
                        dark(theme) ? 'text-[#ffffff]' : ''
                      }`}
                    >
                      {JSON.parse(post.title).title}
                    </p>
                    {selectedTab === 'comments' && post.comments.length > 0 && (
                      <div className="mt-1 text-[12px] text-gray-700 flex">
                        <img
                          src={dark(theme) ? commentWhite : commentIcon}
                          className="w-5 h-5"
                        />
                        <p
                          className={`ml-[5px] ${
                            dark(theme) ? 'text-[#ffffff]' : ''
                          }`}
                        >
                          +{post.myCommentCount}개
                        </p>
                      </div>
                    )}
                  </div>
                  <p
                    className={`ml-auto w-[100px] font-normal shrink-0 text-right text-[13px] ${
                      dark(theme) ? 'text-[#ffffff]' : ''
                    }`}
                  >
                    {post.createdAt.slice(0, 10)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {userPostData && userPostData.length > postsPerPage && (
        <div
          className={`mt-8 flex justify-center ${
            dark(theme) ? 'text-[#ffffff]' : ''
          }`}
        >
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={postsPerPage}
            totalItemsCount={userPostData.length}
            pageRangeDisplayed={6}
            onChange={handlePageChange}
            prevPageText={
              <span className="text-xl leading-none flex items-center justify-center">
                ‹
              </span>
            }
            nextPageText={
              <span className="text-xl leading-none flex items-center justify-center">
                ›
              </span>
            }
            firstPageText={
              <span className="text-xl leading-none flex items-center justify-center">
                «
              </span>
            }
            lastPageText={
              <span className="text-xl leading-none flex items-center justify-center">
                »
              </span>
            }
            innerClass="flex gap-2 text-sm"
            itemClass="px-3 py-1 rounded-[5px] cursor-pointer"
            activeClass={`bg-[#1E293B] text-white ${
              dark(theme) ? 'bg-[#1e1e1e]' : ''
            }`}
          />
        </div>
      )}
      {isLoginModalOpen && (
        <NotLoginModal
          closeLoginModalHanlder={closeLoginModalHanlder}
          theme={theme}
        />
      )}
    </div>
  );
}
