import { useEffect } from 'react';
import { useDarkModeStore } from '../stores/darkModeStore';

export default function Loading() {
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
    <div className="flex items-center justify-center h-full w-full py-10 bg-[var(--color-loading-bg)]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-5 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-base text-gray-500">로딩 중입니다...</p>
      </div>
    </div>
  );
}
