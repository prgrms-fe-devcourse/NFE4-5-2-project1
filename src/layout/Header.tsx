import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../api/axios';
import LogoImg from '../assets/images/headerLogoImg.svg';
import LogoText from '../assets/images/headerLogoText.svg';
import LogoTextDark from '../assets/images/headerLogoTextDark.svg';
import { useAuthStore } from '../stores/authStore';
import { useDarkModeStore } from '../stores/darkModeStore';
import { useEffect } from 'react';

export default function Header() {
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isLoggedIn);
  const navigate = useNavigate();
  const logoutHandler = async () => {
    const { status } = await axiosInstance.post('/logout');
    if (status === 200) {
      console.log('logout');
      logout();
      navigate('/');
    }
  };
  const { isDarkMode } = useDarkModeStore();
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);
  return (
    <>
      <header className="bg-[var(--color-header)] h-[85px] transition-all duration-300">
        <div className="max-w-8xl mx-auto px-[30px] sm:px-5 py-2.5 h-full">
          <div className="flex justify-between h-full">
            <div className="flex">
              <div className="items-center gap-2.5 flex-shrink-0 flex">
                <Link to="/">
                  <img
                    src={LogoImg}
                    alt="TravelMate 로고이미지"
                    className="h-11"
                  />
                </Link>
                <Link to="/">
                  <img
                    src={isDarkMode ? LogoTextDark : LogoText}
                    alt="TravelMate 로고텍스트"
                    className="h-9.5"
                  />
                </Link>
              </div>
            </div>
            <ul className="hidden sm:flex gap-[30px] items-center">
              {/* /로그인상태일때 */}
              {isAuthenticated ? (
                <>
                  <li
                    className="montserrat text-xl w-auto text-center font-semibold text-[var(--color-notSelected)] cursor-pointer hover:font-bold hover:text-[var(--color-main-blue)] hover:text-shadow-custom transition-all duration-200"
                    onClick={logoutHandler}
                  >
                    Log Out
                  </li>
                  <Link
                    to="/myprofile"
                    className="montserrat text-xl w-auto text-center font-semibold text-[var(--color-notSelected)] cursor-pointer hover:font-bold hover:text-[var(--color-main-blue)] hover:text-shadow-custom transition-all duration-200"
                  >
                    My Page
                  </Link>
                </>
              ) : (
                //로그아웃 상태일때
                <>
                  <Link
                    to="/login"
                    className="montserrat text-xl w-auto text-center font-semibold text-[var(--color-notSelected)] cursor-pointer hover:font-bold hover:text-[var(--color-main-blue)] hover:text-shadow-custom transition-all duration-200"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="montserrat text-xl w-auto text-center font-semibold text-[var(--color-notSelected)] cursor-pointer hover:font-bold hover:text-[var(--color-main-blue)] hover:text-shadow-custom transition-all duration-200"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </ul>
          </div>
          <div className="flex items-center sm:hidden">
            {' '}
            <button className="inline-flex items-center justify-center">
              <span className="sr-only">Open main menu</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
