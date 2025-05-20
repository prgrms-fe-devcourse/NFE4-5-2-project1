// src/components/organisms/Header.tsx
import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Logo from '../atoms/Logo';
import SignupPopup from '../molecules/SignupPopup';
import LoginPopup from '../molecules/LoginPopup';
import Navigation from '../atoms/Navigation';
import SearchBar from '../atoms/SearchBar';
import Icon from '../atoms/Icon';
import UserAvatar from '../atoms/UserAvatar';
import { logout } from '../../api/auth';
import AlarmIcon from '../molecules/AlarmIcon';
import { useLoginStore } from '../../stores/loginStore';
import ChatWindow from './ChatWindow';
import Button from '../atoms/Button';
import { useDarkModeStore } from '../../stores/darkModeStore';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';

export default function Header() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const isLoggedIn = useLoginStore((state) => state.isLoggedIn);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false); // 추가: 모바일 네비게이션 상태
  const avatarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const storedImage = localStorage.getItem('myImage');
  const validImageUrl =
    storedImage && storedImage !== 'undefined' ? storedImage : undefined;

  const isDarkMode = useDarkModeStore((state) => state.isDarkMode);
  const toggleDarkMode = useDarkModeStore((state) => state.toggleDarkMode);

  const openLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };
  const openSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        avatarRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ESC 키로 닫기
  useEffect(() => {
    if (!showMobileNav) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowMobileNav(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showMobileNav]);

  // 바깥 클릭으로 닫기
  useEffect(() => {
    if (!showMobileNav) return;
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowMobileNav(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showMobileNav]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error('Logout failed:', e);
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('myId');
    localStorage.removeItem('myImage');
    useLoginStore.getState().logout();
    toast.success('로그아웃 되었습니다.');
    setShowDropdown(false);
    setShowChatWindow(false); // 로그아웃 시 채팅창 닫기
    navigate('/'); // 로그아웃 시 메인화면으로 이동
  };

  return (
    <>
      <div className="nanum-gothic-regular flex h-[80px] w-full max-w-[1300px] items-center px-7">
        {/* Logo & Navigation */}
        <div className="flex flex-shrink-0 items-center space-x-7">
          <Link to="/">
            <Logo />
          </Link>
          {/* 데스크탑 네비게이션 */}
          <div className="hidden md:flex">
            <Navigation />
          </div>
          {/* 모바일 네비게이션 버튼 */}
          <div className="dark:hover:bg-dark-card rounded hover:bg-gray-100 md:hidden dark:contrast-75 dark:invert">
            <Icon
              name="menuIcon"
              size={24}
              onClick={() => setShowMobileNav((prev) => !prev)}
            />
          </div>
        </div>

        {/* Search & Icons */}

        <div className="relative flex min-w-[150px] flex-grow items-center">
          <div className="mr-5 ml-auto hidden max-w-[350px] min-w-[120px] flex-1 sm:block">
            <SearchBar />
          </div>

          <div className="flex flex-shrink-0 items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="z-10 mt-[5px] ml-3 cursor-pointer">
                  <AlarmIcon />
                </div>
                <div
                  className="ml-3 cursor-pointer duration-200 hover:scale-110 dark:contrast-75 dark:invert"
                  onClick={() => setShowChatWindow(true)}
                >
                  <Icon name="chatIcon" size={26} />
                </div>

                {/* Avatar & Dropdown */}
                <div className="relative ml-3 inline-block">
                  <div
                    ref={avatarRef}
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="ml-2 flex cursor-pointer duration-200 hover:scale-110"
                  >
                    <UserAvatar imageUrl={validImageUrl} size={30} />
                  </div>

                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        ref={dropdownRef}
                        className="dark:bg-dark-card dark:text-dark-text absolute right-0 z-50 mt-2 w-25 origin-top-right rounded-md border border-[#d9d9d9] bg-white text-[14px] shadow-md drop-shadow-sm"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                      >
                        <Link
                          to={`/${localStorage.getItem('myId')}`}
                          onClick={() => setShowDropdown(false)}
                          className="block px-4 py-2 hover:text-[#4b4744]"
                        >
                          마이페이지
                        </Link>
                        <Link
                          to="/setting"
                          onClick={() => setShowDropdown(false)}
                          className="block px-4 py-2 hover:text-[#4b4744]"
                        >
                          설정
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full cursor-pointer px-4 py-2 text-left text-red-600 hover:text-red-400"
                        >
                          로그아웃
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Button onClick={openLogin} size="m">
                  로그인
                </Button>
                <Button onClick={openSignup} size="m" full>
                  회원가입
                </Button>
              </>
            )}
          </div>

          {showLogin && (
            <LoginPopup
              onClose={() => setShowLogin(false)}
              onSwitchToSignup={openSignup}
            />
          )}

          {showSignup && <SignupPopup onClose={() => setShowSignup(false)} />}
          <div className="absolute right-[-50px]">
            <input
              type="checkbox"
              id="light-switch"
              className="light-switch sr-only"
              checked={isDarkMode} // 🌗 라이트 모드일 때 체크됨
              onChange={toggleDarkMode}
            />
            <label className="relative cursor-pointer" htmlFor="light-switch">
              <svg
                className={`${isDarkMode ? 'hidden' : 'rounded duration-200 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                width="30"
                height="30"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g transform="translate(7 7)">
                  <path
                    className="fill-slate-400"
                    d="M7 0h2v2H7zM12.88 1.637l1.414 1.415-1.415 1.413-1.413-1.414zM14 7h2v2h-2zM12.95 14.433l-1.414-1.413 1.413-1.415 1.415 1.414zM7 14h2v2H7zM2.98 14.364l-1.413-1.415 1.414-1.414 1.414 1.415zM0 7h2v2H0zM3.05 1.706 4.463 3.12 3.05 4.535 1.636 3.12z"
                  />
                  <path
                    className="fill-slate-500"
                    d="M8 4C5.8 4 4 5.8 4 8s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4Z"
                  />
                </g>
              </svg>
              <svg
                className={`${isDarkMode ? 'rounded duration-200 hover:bg-slate-200 dark:hover:bg-slate-700' : 'hidden'}`}
                width="30"
                height="30"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g transform="translate(7 7)">
                  <path
                    className="fill-slate-400"
                    d="M6.2 1C3.2 1.8 1 4.6 1 7.9 1 11.8 4.2 15 8.1 15c3.3 0 6-2.2 6.9-5.2C9.7 11.2 4.8 6.3 6.2 1Z"
                  />

                  <path
                    className="fill-slate-500"
                    d="M12.5 5a.625.625 0 0 1-.625-.625 1.252 1.252 0 0 0-1.25-1.25.625.625 0 1 1 0-1.25 1.252 1.252 0 0 0 1.25-1.25.625.625 0 1 1 1.25 0c.001.69.56 1.249 1.25 1.25a.625.625 0 1 1 0 1.25c-.69.001-1.249.56-1.25 1.25A.625.625 0 0 1 12.5 5Z"
                  />
                </g>
              </svg>
              <span className="sr-only">Switch to light / dark version</span>
            </label>
          </div>
        </div>
      </div>

      {/* 모바일 네비게이션 드로어 */}
      <AnimatePresence>
        {showMobileNav && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              ref={modalRef}
              className="dark:bg-dark-bg relative w-[90vw] max-w-[350px] rounded-lg bg-white p-6 shadow-xl"
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.95 }}
              transition={{ duration: 0.1 }}
            >
              <div className="flex flex-col items-center space-y-5">
                <Logo />
                <div className="w-[200px]">
                  <SearchBar />
                </div>
                <Navigation /> {/* 네비게이션바 추가 */}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {showChatWindow && (
          <ChatWindow onClose={() => setShowChatWindow(false)} />
        )}
      </AnimatePresence>

      <Outlet />
    </>
  );
}
