export const applyTheme = (theme: "light" | "dark") => {
  const root = document.documentElement;

  if (theme === "light") {
    root.classList.remove("dark");
    root.classList.add("light");
  } else {
    root.classList.remove("light");
    root.classList.add("dark");
  }

  localStorage.setItem("theme", theme);
};

export const loadSavedTheme = () => {
  const saved = localStorage.getItem("theme") as "light" | "dark" | null;
  if (saved === "light" || saved === "dark") {
    applyTheme(saved);
  } else {
    applyTheme("dark");
  }
};

export const getCurrentTheme = (): "light" | "dark" => {
  if (typeof document === "undefined") return "dark"; 

  const root = document.documentElement;
  if (root.classList.contains("light")) return "light";
  return "dark";
};
