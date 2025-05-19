import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ThemeState {
	isDark: boolean;
	toggleTheme: () => void;
	initializeTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
	persist(
		(set, get) => ({
			isDark: false,
			toggleTheme: () => {
				const next = !get().isDark;
				document.documentElement.classList.toggle("dark", next);
				set({ isDark: next });
			},
			initializeTheme: () => {
				let isDark = false;
				try {
					const stored = sessionStorage.getItem("theme-storage");
					isDark = stored ? JSON.parse(stored).state?.isDark : false;
				} catch (e) {
					console.error("다크모드 상태 초기화 실패", e);
				}

				document.documentElement.classList.toggle("dark", isDark);
				set({ isDark });
			}
		}),
		{
			name: "theme-storage", // localStorage에 저장될 key 이름
			storage: createJSONStorage(() => sessionStorage)
		}
	)
);
