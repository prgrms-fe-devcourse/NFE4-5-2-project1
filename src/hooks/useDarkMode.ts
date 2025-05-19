import { useEffect, useState } from "react";

const DARK_CLASS = "dark";
const STORAGE_KEY = "theme";

export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === "dark"; // 기본값은 false (light)
    }
    return false;
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add(DARK_CLASS);
      localStorage.setItem(STORAGE_KEY, "dark");
    } else {
      html.classList.remove(DARK_CLASS);
      localStorage.setItem(STORAGE_KEY, "light");
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark((prev) => !prev);

  return { isDark, toggleDarkMode };
}
