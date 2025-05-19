import { useState } from "react";
import { applyTheme } from "../../utils/theme";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);
  const toggleTheme = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDark((prev) => !prev);
    const current = document.documentElement.classList.contains("light")
      ? "light"
      : "dark";

    applyTheme(current === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`relative flex items-center justify-between w-[40px] h-[19px] rounded-full px-2 py-2 transition-colors duration-300 ${
        isDark ? "bg-[color:var(--bg-color)]" : "bg-[color:var(--bg-color)]"
      }`}
    >
      <Moon
        className={`w-[12px] h-[12px] text-[color:var(--white)] absolute left-[4px] transition-opacity duration-300 ${
          isDark ? "opacity-100" : "opacity-0"
        }`}
        fill="white"
        strokeWidth={0}
      />
      <Sun
        className={`w-[10px] h-[10px] text-[color:var(--white)] absolute right-[4px] transition-opacity duration-300 ${
          !isDark ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`absolute w-[11px] h-[11px] rounded-full transform transition-transform duration-300 ${
          isDark
            ? "translate-x-[16px] bg-[color:var(--white)]"
            : "translate-x-[-2px] bg-[color:var(--white)]"
        }`}
      />
    </button>
  );
};

export default ThemeToggle;
