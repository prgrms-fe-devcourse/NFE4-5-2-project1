import { Outlet } from 'react-router-dom';
import Header from '../components/header/Header';
import ChannelBox from '../components/sidebar/ChannelBox';
import MemberBox from '../components/sidebar/MemberBox';
import '../css/layout/layout.css';
import { dark } from '../utils/darkModeUtils';
import { Theme } from '../types/darkModeTypes';
import { useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export default function MainLayout({
  theme,
  nextTheme,
  nextThemeIndex,
}: {
  theme: Theme;
  nextTheme: () => void;
  nextThemeIndex: number;
}) {
  const [mobileSide, setMobileSide] = useState(false);
  const sideBarButtonRef = useRef<HTMLButtonElement>(null);
  const sideBarRef = useRef<HTMLElement>(null);

  return (
    <>
      <div className='max-w-[1500px] mx-auto'>
        <Header
          theme={theme}
          nextTheme={nextTheme}
          nextThemeIndex={nextThemeIndex}
        />
        <button
          ref={sideBarButtonRef}
          className={`mobile-side-menu-button fixed text-5xl top-[22px] left-[30px] cursor-pointer z-21 hidden ${
            dark(theme) && 'text-white'
          }`}
          onClick={() => setMobileSide(!mobileSide)}
        >
          =
        </button>
        <div className='main-layout-content flex px-[60px] h-[calc(100dvh-100px)]'>
          <aside
            ref={sideBarRef}
            className={twMerge(
              'side-bar flex flex-col h-full mr-[30px] box-border pb-[30px]',
              mobileSide && 'open'
            )}
          >
            <div className='mb-[30px]'>
              <ChannelBox theme={theme} />
            </div>
            <MemberBox theme={theme} />
          </aside>

          <main className='h-full w-full min-w-0 max-w-full'>
            {/* 컨텐츠 영역 */}
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
