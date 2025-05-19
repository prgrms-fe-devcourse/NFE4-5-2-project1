import menuIcon from '../../assets/images/menu/menu-icon.svg';
import menuIconWhite from '../../assets/images/menu/menu-icon-white.svg';
import { Search } from 'lucide-react';
import Avatar from '../../components/avatar/Avatar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsersData } from '../../api/memberbox/member';
import { useAuthStore } from '../../stores/authStore';
import ChatModal from '../../pages/message/ChatModal';
import useChatClose from '../../utils/changeMessageIcon';
import { handleFollow, handleUnfollow } from '../../utils/followHandlers';
import { Theme } from '../../types/darkModeTypes';
import { dark } from '../../utils/darkModeUtils';

export default function FollowerMember({
  followData,
  followType,
  targetUserId,
  theme,
}: {
  followData: {
    followers: Follow[];
    following: Follow[];
  };
  followType: 'following' | 'follower';
  targetUserId?: string;
  theme: Theme;
}) {
  const { user, setUser } = useAuthStore();
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [openUser, setOpenUser] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatTargetUser, setChatTargetUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'following' | 'follower'>(followType);
  const onClose = useChatClose(setIsChatOpen);
  const modalRef = useRef<HTMLUListElement>(null);
  const isMyProfile = user?._id === targetUserId;
  const navigate = useNavigate();

  useEffect(() => {
    setActiveTab(followType);
  }, [followType]);

  const isFollowingUser = (targetUserId: string) => {
    return user?.following?.some((follow) => follow.user === targetUserId);
  };

  const fetchUsers = useCallback(async () => {
    const { data } = await getAllUsersData();
    let fetchedUsers = data;

    if (user && !fetchedUsers.find((u: User) => u._id === user._id)) {
      fetchedUsers = [...fetchedUsers, user];
    }

    setUsers(
      fetchedUsers.sort((a, b) => {
        if (a.isOnline === b.isOnline) {
          return a.fullName.localeCompare(b.fullName);
        }
        return a.isOnline ? -1 : 1;
      })
    );
  }, [user]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value.toUpperCase());
  };

  const filterUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      user.email.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const filteredMembers = filterUsers.filter((targetUser) =>
    activeTab === 'following'
      ? isMyProfile
        ? user?.following?.some((follow) => follow.user === targetUser._id)
        : followData.following?.some((follow) => follow.user === targetUser._id)
      : isMyProfile
      ? user?.followers?.some((follow) => follow.follower === targetUser._id)
      : followData.followers?.some((follow) => follow.follower === targetUser._id)
  );

  const ToggleHandler = (id: string) => {
    setOpenUser(openUser === id ? '' : id);
  };

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setOpenUser('');
      }
    };
    window.addEventListener('mousedown', clickHandler);
    return () => window.removeEventListener('mousedown', clickHandler);
  }, []);

  return (
    <div
      className={`w-[448px] h-[75vh] rounded-[10px] shadow-md pl-[30px] pr-[26px] pt-[20px] relative overflow-hidden ${
        dark(theme) ? 'bg-[#2d2d2d]' : 'bg-[#ffffff]'
      }`}
    >
      {/* 탭 버튼 영역 */}
      <div className='flex justify-around mb-[13px]'>
        {(['follower', 'following'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-1/2 py-2 px-4 text-sm font-medium border-b-2 ${
              activeTab === tab
                ? dark(theme)
                  ? 'border-[#acacaa] text-[#acacaa]'
                  : 'border-black text-black'
                : dark(theme)
                ? 'border-[#1e1e1e] text-[#1e1e1e]'
                : 'border-gray-300 text-gray-400'
            }`}
          >
            {tab === 'follower' ? 'Followers' : 'Following'}
          </button>
        ))}
      </div>

      {/* 검색창 */}
      <div className='flex items-center text-[#898FA3] bg-[#F6F8FA] px-3 py-2 rounded-[5.54px] text-[14px] gap-4 mb-[13px]'>
        <Search className='w-[19.94px] h-[19.94px] text-[#86879C]' />
        <input
          type='text'
          placeholder={activeTab === 'follower' ? '팔로워를 검색해 보세요' : '팔로잉을 검색해 보세요'}
          className='outline-none placeholder:text-[#898FA3] placeholder:text-[14px] w-full'
          onChange={searchHandler}
        />
      </div>

      {/* 유저 리스트 */}
      <div
        className={`member-list overflow-y-auto pt-2 pb-2 h-[calc(75vh-140px)] ${
          dark(theme) ? 'dark-member-list' : ''
        }`}
      >
        {filteredMembers.length === 0 ? (
          <div
            className={`h-[50vh] flex items-center justify-center text-[15px] ${
              dark(theme) ? 'text-[#acacaa]' : 'text-gray-600'
            }`}
          >
            표시할 사용자가 없습니다.
          </div>
        ) : (
          filteredMembers.map((listedUser) => (
            <div className='relative' key={listedUser._id} id={listedUser._id}>
              <div className='memberCard cursor-pointer' onClick={() => ToggleHandler(listedUser._id)}>
                <Avatar name={listedUser.fullName} email={listedUser.email} image={listedUser.image} theme={theme} />
              </div>
              <button className='absolute right-0 top-4 cursor-pointer' onClick={() => ToggleHandler(listedUser._id)}>
                <img src={dark(theme) ? menuIconWhite : menuIcon} className='rotate-90' />
                {openUser === listedUser._id && (
                  <ul
                    ref={modalRef}
                    className={`avatarMenu absolute text-xs w-27 right-5 top-0 rounded-[5px] text-left z-2 py-1 ${
                      dark(theme) ? 'bg-[#2d2d2d] border border-white/40' : 'bg-[#ffffff] border border-[#ddd]'
                    }`}
                  >
                    <li
                      className='px-3 py-1 block opacity-70 hover:opacity-100 cursor-pointer'
                      onClick={() => {
                        navigate('/profile', { state: { userid: listedUser._id } });
                      }}
                    >
                      프로필 보기
                    </li>
                    <li
                      className='px-3 py-1 block opacity-70 hover:opacity-100'
                      onClick={() => {
                        setChatTargetUser(listedUser);
                        setIsChatOpen(true);
                      }}
                    >
                      메세지 보내기
                    </li>
                    {user?._id !== listedUser._id &&
                      (isFollowingUser(listedUser._id) ? (
                        <li
                          className='px-3 py-1 block opacity-70 hover:opacity-100'
                          onClick={() => user && handleUnfollow(user, listedUser._id, setUser)}
                        >
                          팔로우 취소
                        </li>
                      ) : (
                        <li
                          className='px-3 py-1 block opacity-70 hover:opacity-100'
                          onClick={() => user && handleFollow(user, listedUser._id, setUser)}
                        >
                          팔로우
                        </li>
                      ))}
                  </ul>
                )}
              </button>
            </div>
          ))
        )}
        <div className='h-4' />
      </div>

      <ChatModal initialUser={chatTargetUser} isOpen={isChatOpen} onClose={onClose} theme={theme} />
    </div>
  );
}
