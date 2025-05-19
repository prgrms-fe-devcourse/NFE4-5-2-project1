import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import modeToggle from '../assets/icons/modeToggle.svg';
import modeToggleDark from '../assets/icons/modeToggleDark.svg';
import { useDarkModeStore } from '../stores/darkModeStore';

export default function Layout({ children }: { children?: React.ReactNode }) {
  const { isDarkMode, toggleDarkMode } = useDarkModeStore();
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      {/* 헤더 고정 */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      {/* 사이드바 고정 */}
      <div className="fixed top-[85px] left-0 z-40">
        <Sidebar />
      </div>

      {/* 본문 영역 */}
      <main className="ml-[235px] mt-[85px]  h-[calc(100vh-85px)] overflow-y-auto bg-[var(--color-main-bg)] transition-all duration-300 ">
        {children || <Outlet />}
        <button
          onClick={toggleDarkMode}
          className="absolute right-[30px] top-[90%] hover:scale-[1.1]"
        >
          <img
            src={isDarkMode ? modeToggleDark : modeToggle}
            alt="toggle"
            className="w-[60px] h-[60px]"
          />
        </button>
      </main>
    </div>
  );
}
