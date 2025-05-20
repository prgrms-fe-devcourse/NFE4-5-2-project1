// stores/darkModeStore.ts
import { create } from 'zustand';

type DarkModeState = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
};

export const useDarkModeStore = create<DarkModeState>((set) => ({
  isDarkMode: localStorage.getItem('darkMode') === 'true',
  toggleDarkMode: () =>
    set((state) => {
      const newValue = !state.isDarkMode;
      localStorage.setItem('darkMode', String(newValue));
      document.documentElement.classList.toggle('dark', newValue);
      return { isDarkMode: newValue };
    }),
  setDarkMode: (value) => {
    localStorage.setItem('darkMode', String(value));
    document.documentElement.classList.toggle('dark', value);
    set({ isDarkMode: value });
  },
}));
