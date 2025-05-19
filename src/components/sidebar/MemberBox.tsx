import menuIcon from '../../assets/images/menu/menu-icon.svg';
import menuIconWhite from '../../assets/images/menu/menu-icon-white.svg';

import { Search } from 'lucide-react';
import Avatar from '../avatar/Avatar';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllUsersData } from '../../api/memberbox/member';
import { useAuthStore } from '../../stores/authStore';
import { Theme } from '../../types/darkModeTypes';
import { dark } from '../../utils/darkModeUtils';
import ChatModal from '../../pages/message/ChatModal';
import useChatClose from '../../utils/changeMessageIcon';
import NotLoginModal from '../post/NotLoginModal';

export default function MemberBox({ theme }: { theme: Theme }) {
  const { isLoggedIn, user } = useAuthStore(); // 내 프로필
  const [searchKeyword, setSearchKeyword] = useState<string>(''); // 검색 키워드
  const [openUser, setOpenUser] = useState<string>(''); // 각 프로필 메뉴
  const [users, setUsers] = useState<User[]>([]); // 모든 사용자
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatTargetUser, setChatTargetUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const onClose = useChatClose(setIsChatOpen);
  const modalRef = useRef<HTMLUListElement>(null);
  const [follow, setFollow] = useState(user?.following);
  const navigate = useNavigate();

  // api 유저 요청, 접속 된 유저 먼저 정렬
  const fetchUsers = async () => {
    const result = await getAllUsersData();
    setUsers(
      result.data
        .filter((f) => f.role != 'SuperAdmin') // 관리자 계정 필터링
        .sort((a, b) => {
          if (a.isOnline === b.isOnline) {
            // 유저 이름 비교후 오름차순으로 정렬
            return a.fullName.localeCompare(b.fullName);
          }
          return a.isOnline ? -1 : 1;
        })
    );
  };

  // 유저가져오기, 유저들 접속 감지를 위해 10초마다 갱신
  useEffect(() => {
    fetchUsers();

    const interval = setInterval(fetchUsers, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setFollow(user?.following);
  }, [user]);

  // 검색창의 검색어 가져오기
  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value.toUpperCase());
  };

  // 유저 filter
  const filterUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      user.email.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // 헤딩 id값의 modal 열기
  const ToggleHandelr = (id: string) => {
    if (openUser === id) {
      setOpenUser('');
    } else {
      setOpenUser(id);
    }
  };

  // 로그인 관련 모달 닫기
  const closeLoginModalHanlder = () => {
    setIsLoginModalOpen(false);
  };

  // 해당 modal이 아닌 경우 열려 있는 modal 닫기
  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setOpenUser('');
      }
    };

    window.addEventListener('mousedown', clickHandler);
    return () => window.removeEventListener('mousedown', clickHandler);
  }, [modalRef]);

  return (
    <div
      className={`w-[291px] max-h-[calc(100%-240px)] h-[580px] rounded-[10px] shadow-md pl-[30px] pr-[26px]  pt-[20px]  relative overflow-hidden ${
        dark(theme) ? 'bg-[#2d2d2d]' : 'bg-[#ffffff]'
      }`}
    >
      <h2
        className={`font-medium text-[20px] mb-[13px]  ${
          dark(theme) ? 'text-[#acacaa]' : 'text-[#595956]'
        }`}
      >
        Member
      </h2>
      <div className='flex items-center text-[#898FA3] bg-[#F6F8FA] px-3 py-2 rounded-[5.54px] text-[14px] gap-4 mb-[13px]'>
        <div>
          <Search className='w-[19.94px] h-[19.94px] text-[#86879C]' />
        </div>
        <input
          type='text'
          placeholder='멤버를 검색해 보세요'
          className=' outline-none placeholder:text-[#898FA3] placeholder:text-[14px]w-full'
          onChange={(e) => searchHandler(e)}
        />
      </div>
      {isLoggedIn && (
        <div className={dark(theme) ? 'dark-myInfoCard' : 'myInfoCard'}>
          <Link to={`/profile`} state={{ userid: user?._id }}>
            <Avatar
              name={`(나) ${user !== null ? user.fullName : ''}`}
              email={user !== null ? user.email : ''}
              image={user !== null ? user.image : ''}
              isOnline={user !== null ? user.isOnline : false}
              theme={theme}
            ></Avatar>
          </Link>
        </div>
      )}
      <div
        className={` overflow-y-auto pt-2 ${
          dark(theme) ? 'dark-member-list' : 'member-list'
        }`}
        style={{
          height: isLoggedIn ? `calc(100% - 161px)` : `calc(100% - 91px)`,
        }}
      >
        {/* 유저멤버 카드 */}
        {filterUsers.map((user) => (
          <div className='relative' key={user._id} id={user._id}>
            <div
              className='memberCard cursor-pointer'
              onClick={() => ToggleHandelr(user._id)}
            >
              <Avatar
                name={user.fullName}
                email={user.email}
                image={user.image}
                isOnline={user.isOnline}
                theme={theme}
                follow={follow?.some((f) => f.user === user._id)}
              ></Avatar>
            </div>

            {/* 프로필 클릭시 나오는 modal */}
            <button
              className='absolute right-0 top-4 cursor-pointer'
              onClick={() => ToggleHandelr(user._id)}
            >
              <img
                src={dark(theme) ? menuIconWhite : menuIcon}
                className='rotate-90'
              />
              {openUser === user._id && (
                <ul
                  ref={modalRef}
                  className={`avatarMenu absolute text-xs w-27 right-5 top-0 rounded-[5px] text-left z-2 py-1 ${
                    dark(theme)
                      ? 'bg-[#2d2d2d] text-[#ffffff] border border-white/40'
                      : 'bg-[#ffffff] border border-[#ddd]'
                  }`}
                >
                  <li
                    className='px-3 py-1 block opacity-70 hover:opacity-100 cursor-pointer'
                    onClick={() => {
                      navigate('/profile', { state: { userid: user._id } });
                    }}
                  >
                    프로필 보기
                  </li>
                  <li
                    className='px-3 py-1 block  opacity-70 hover:opacity-100'
                    onClick={() => {
                      if (!isLoggedIn) setIsLoginModalOpen(true);
                      else {
                        setChatTargetUser(user);
                        setIsChatOpen(true);
                      }
                    }}
                  >
                    메세지 보내기
                  </li>
                </ul>
              )}
            </button>
          </div>
        ))}
      </div>
      <ChatModal
        initialUser={chatTargetUser}
        isOpen={isChatOpen}
        onClose={onClose}
        theme={theme}
      />
      {isLoginModalOpen && (
        <NotLoginModal
          closeLoginModalHanlder={closeLoginModalHanlder}
          theme={theme}
        />
      )}
    </div>
  );
}
