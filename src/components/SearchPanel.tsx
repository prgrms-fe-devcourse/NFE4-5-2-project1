import React, { useEffect } from 'react';
import { useState } from 'react';
import profile from '../assets/images/profile.svg';
import online from '../assets/icons/onLine.svg';
import offline from '../assets/icons/offLine.svg';
import { axiosInstance } from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Channel from './Channel';
import Loading from './Loading';
import { useDarkModeStore } from '../stores/darkModeStore';

interface SearchPanelProps {
  onClose: () => void;
}

interface User {
  _id: string;
  image: string;
  fullName: string;
  followers: string[];
  isOnline: boolean;
}

interface Channel {
  _id: string;
  name: string;
}

interface Post {
  _id: string;
  title: string;
  author: {
    _id: string;
    fullName: string;
    image: string;
  };
}

export default function SearchPanel({
  onClose,
}: SearchPanelProps): React.ReactElement {
  const [users, setUsers] = useState<User[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchType, setSearchType] = useState<'user' | 'post'>('post');

  const [recentSearches, setRecentSearches] = useState<User[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(
    null
  );
  const [channels, setChannels] = useState<Channel[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [recentPostSearches, setRecentPostSearches] = useState<Post[]>([]);

  const navigate = useNavigate();

  const { isDarkMode } = useDarkModeStore();

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // 검색어가 없으면 전체 users, 있으면 필터링된 filteredUsers
  // 검색어가 없으면 전체 users, 있으면 필터링된 filteredUsers
  const displayUsers = (searchInput.trim() === '' ? users : filteredUsers)
    .slice() // 원본 배열 변경 방지용 복사
    .sort((a, b) => {
      // 온라인 상태면 앞으로 오도록 정렬
      if (a.isOnline === b.isOnline) return 0;
      if (a.isOnline) return -1;
      return 1;
    });

  useEffect(() => {
    if (searchType === 'post') {
      if (searchInput.trim() === '') {
        setFilteredPosts([]);
        return;
      }
      const filtered = posts.filter(
        (post) =>
          post.title &&
          post.title.trim() !== '' &&
          post.title.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [searchInput, posts, searchType]);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await axiosInstance.get('/channels');
        setChannels(res.data);
      } catch (error) {
        console.error('채널 불러오기 실패:', error);
      }
    };

    fetchChannels();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!selectedChannelId) return;
      try {
        const res = await axiosInstance.get(
          `/posts/channel/${selectedChannelId}`
        );
        console.log(
          `게시물 API 응답 (/posts/channel/${selectedChannelId}):`,
          res.data
        );
        setPosts(res.data);
      } catch (err) {
        console.error('게시글 목록을 가져오는 데 실패했습니다:', err);
      }
    };

    if (searchType === 'post') {
      fetchPosts();
    } else {
      setPosts([]);
      setFilteredPosts([]);
    }
  }, [searchType, selectedChannelId]);

  // 사용자 목록 불러오기
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get('/users/get-users');
        setUsers(res.data);
      } catch (err) {
        console.error('사용자 목록을 가져오는 데 실패했습니다:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 실시간 검색 필터링
  useEffect(() => {
    if (searchInput.trim() === '') {
      setFilteredUsers([]);
      return;
    }
    const filtered = users.filter((user) =>
      user.fullName.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchInput, users]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = () => {
    console.log('검색 실행:', searchInput);
  };

  const handleUserClick = (user: User) => {
    // 프로필 이동 & 최근 검색 기록 업뎃
    navigate(`/profile/${user._id}`);
    setRecentSearches((prev) => {
      const filtered = prev.filter((u) => u._id !== user._id);
      return [user, ...filtered].slice(0, 3);
    });
  };

  const handleDeleteRecent = (userId: string) => {
    setRecentSearches((prev) => prev.filter((user) => user._id !== userId));
  };

  const handlePostClick = (post: Post) => {
    if (post.author && post.author._id) {
      navigate(`/profile/${post.author._id}`);
      setRecentPostSearches((prev) => {
        const filtered = prev.filter((p) => p._id !== post._id);
        return [post, ...filtered].slice(0, 3);
      });
    } else {
      console.warn('작성자 정보가 없어 프로필로 이동할 수 없습니다:', post);
    }
  };

  const handleDeleteRecentPost = (postId: string) => {
    setRecentPostSearches((prev) => prev.filter((post) => post._id !== postId));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="px-4 flex flex-col text-[var(--color-notice-text)] text-sm bg-[var(--color-notice-bg)] h-full w-[22.5rem] shadow-[4px_0_6px_rgba(0,0,0,0.15)]">
      <div className="flex justify-between items-center pt-4">
        {' '}
        <h2 className="text-2xl font-semibold flex-shrink-0 mr-28.5"> 검색</h2>
        <div className="flex space-x-4 flex-grow justify-end">
          {' '}
          <label className="flex items-right cursor-pointer text-sm">
            <input
              type="radio"
              name="searchType"
              value="post"
              checked={searchType === 'post'}
              onChange={() => {
                setSearchType('post');
                setSearchInput('');
              }}
              className="mr-1 accent-blue-500"
            />
            게시글
          </label>
          <label className="flex items-right cursor-pointer text-sm">
            <input
              type="radio"
              name="searchType"
              value="user"
              checked={searchType === 'user'}
              onChange={() => {
                setSearchType('user');
                setSearchInput('');
              }}
              className="mr-1 accent-blue-500"
            />
            사용자
          </label>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-sm flex-shrink-0 ml-3 mb-10" // 너비 줄어들지 않게, 왼쪽 마진 추가
          aria-label="Close search panel"
        >
          ✕
        </button>
      </div>{' '}
      {searchType === 'post' && (
        <div className="relative mb-4 flex justify-end">
          <select
            value={selectedChannelId || ''}
            onChange={(e) => {
              setSelectedChannelId(e.target.value || null);
              setSearchInput('');
            }}
            className="w-1/2 p-2 rounded appearance-none border border-[var(--color-main-skyBlue-hover)] 
                        shadow-[0_0_0_1px_var(--color-lightGray-focus)] focus:outline-none"
          >
            <option value="" disabled={!selectedChannelId}>
              채널 선택
            </option>
            {channels.map((channel) => (
              <option key={channel._id} value={channel._id}>
                {channel.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      )}
      {/* 검색 입력창 */}
      <div className="relative mb-4">
        {' '}
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none"
          value={searchInput}
          onChange={handleSearchInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
        />
      </div>
      <div className="flex-grow border-t pt-3 pb-4">
        {/* 검색 결과 */}
        <h3 className="text-base font-bold mb-2 text-black-700">검색 결과</h3>
        <div className="flex-grow overflow-y-auto pt-3 pb-4 max-h-90">
          {loading ? (
            <Loading />
          ) : searchType === 'user' ? (
            <>
              {displayUsers.length > 0 ? (
                <ul>
                  {displayUsers.map((user) => (
                    <li
                      key={user._id}
                      className="flex justify-between items-center py-1.5 mb-1 group cursor-pointer"
                      onClick={() => handleUserClick(user)}
                    >
                      <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                        <img
                          src={user.image || profile}
                          alt="프로필"
                          className="w-8 h-8 rounded-full mr-1 object-cover"
                        />
                        <span className="text-[var(--color-notice-text)]">
                          {user.fullName}
                        </span>
                      </div>
                      {/* 온라인 상태 아이콘 */}
                      <div className="mr-4">
                        <img
                          src={user.isOnline ? online : offline}
                          alt={user.isOnline ? '온라인' : '오프라인'}
                          className="w-5 h-5"
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[var(--color-notice-text)] text-center">
                  일치하는 사용자가 없습니다.
                </p>
              )}
            </>
          ) : (
            <>
              <div></div>
              {Array.isArray(filteredPosts) && filteredPosts.length > 0 ? (
                <ul>
                  {filteredPosts.map((post) => (
                    <li
                      key={post._id}
                      className="flex justify-between items-center py-1.5 mb-1 group cursor-pointer"
                      onClick={() => handlePostClick(post)}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={post.author?.image || profile}
                          alt={post.author?.fullName || '작성자'}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <span className="text-[var(--color-notice-text)] group-hover:text-blue-600 block font-medium">
                            <div>
                              {(() => {
                                try {
                                  const parsed = JSON.parse(post.title);
                                  return (
                                    <>
                                      <h3 className="text-lg font-bold overflow-hidden text-ellipsis line-clamp-1 mb-2">
                                        {parsed.writtenTitle}
                                      </h3>
                                      <p className="overflow-hidden text-ellipsis line-clamp-2">
                                        {parsed.context}
                                      </p>
                                    </>
                                  );
                                } catch (e) {
                                  return '오류';
                                }
                              })()}
                            </div>
                          </span>
                          {post.author?.fullName && (
                            <span className="text-xs text-gray-500 group-hover:text-blue-500">
                              작성자: {post.author.fullName}
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[var(--color-notice-text)] text-center">
                  일치하는 게시글이 없습니다.
                </p>
              )}
            </>
          )}
        </div>

        {searchType === 'user' && recentSearches.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold mb-2">최근 검색 항목</h4>
            <ul>
              {recentSearches.map((user) => (
                <li
                  key={user._id}
                  className="flex justify-between items-center py-1.5 mb-1 group cursor-pointer"
                  onClick={() => handleUserClick(user)}
                >
                  <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                    <img
                      src={user.image || profile}
                      alt="프로필"
                      className="w-8 h-8 rounded-full mr-1 object-cover"
                    />
                    <span className="text-[var(--color-notice-text)]">
                      {user.fullName}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRecent(user._id);
                    }}
                    className="text-[var(--color-notice-text)] hover:text-[var(--color-red)] mr-8"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {searchType === 'post' && recentPostSearches.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold mb-2">최근 검색 항목</h4>
            <ul>
              {recentPostSearches.map((post) => (
                <li
                  key={post._id}
                  className="flex justify-between items-center py-1.5 mb-1 group cursor-pointer"
                  onClick={() => handlePostClick(post)}
                >
                  <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                    <span className="text-[var(--color-notice-text)]">
                      {(() => {
                        try {
                          const parsed = JSON.parse(post.title);
                          return (
                            <>
                              <h3 className="text-lg font-bold overflow-hidden text-ellipsis line-clamp-1 mb-2">
                                {parsed.writtenTitle}
                              </h3>
                              <p className="overflow-hidden text-ellipsis line-clamp-2">
                                {parsed.context}
                              </p>
                            </>
                          );
                        } catch (e) {
                          return '오류';
                        }
                      })() || '제목 없음'}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRecentPost(post._id);
                    }}
                    className="text-[var(--color-notice-text)] hover:text-[var(--color-red)]"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
