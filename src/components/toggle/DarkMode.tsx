import { useEffect, useState } from 'react';
import logoLight from '../../assets/images/header/logo.svg';
import logoDark from '../../assets/images/header/logo-white.svg';
import { Theme } from '../../types/darkModeTypes';

interface DarkModeProps {
  children: (
    theme: Theme,
    nextTheme: () => void,
    nextThemeIndex: number
  ) => React.ReactNode;
}

export default function DarkMode({ children }: DarkModeProps) {
  const themes: Theme[] = [
    {
      name: 'Light',
      bg: 'bg-gradient-to-b from-white to-[#c0cfe7]',
      logo: logoLight,
    },
    {
      name: 'Dark',
      bg: 'bg-gradient-to-b from-[#7C7C7C] to-[#313235]',
      logo: logoDark,
    },
  ];

  // 테마 불러오기
  const getTheme = () => {
    const storeTheme = localStorage.getItem('themeIndex');
    return storeTheme ? Number(storeTheme) : 0;
  };

  const [themeIndex, setThemeIndex] = useState(getTheme);

  // themeIndex 바뀔 떄마다 localSotrage에 저장해주기
  useEffect(() => {
    localStorage.setItem('themeIndex', String(themeIndex));
  }, [themeIndex]);

  // 사용할 테마 정보
  const theme = themes[themeIndex];

  // dark, light 전환
  const nextTheme = () => {
    setThemeIndex((currentTheme) => (currentTheme + 1) % themes.length);
  };

  // 다음 테마 계산 0->1 1->0
  const nextThemeIndex = (themeIndex + 1) % 2;
  return (
    <div
      className={`min-h-screen ${theme.bg} transition-colors duration-300 flex flex-col`}
    >
      <main>{children(theme, nextTheme, nextThemeIndex)}</main>
    </div>
  );
}
