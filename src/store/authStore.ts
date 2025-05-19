import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import profileCircle from "../assets/images/profileImg_circle.svg";

type AuthStore = {
	isLoggedIn: boolean;
	accessToken: string | null;
	userId: string | null;
	userData: UserData | null;
	userInfo: Profile | null;

	login: (accessToken: string, userData: UserData) => void;
	logout: () => void;
	setImage: (image: string) => void;
	setNickname: (nickname: string) => void;
};

export const useAuthStore = create<AuthStore>()(
	persist(
		(set) => ({
			isLoggedIn: false,
			accessToken: null,
			userId: null,
			userData: null,
			userInfo: null,

			login: (accessToken, userData) => {
				const userInfo = JSON.parse(userData.fullName);
				set({
					isLoggedIn: true,
					accessToken,
					userId: userData._id,
					userData: userData.image
						? userData
						: { ...userData, image: profileCircle },
					userInfo
				});
			},

			logout: () =>
				set({
					isLoggedIn: false,
					accessToken: null,
					userId: null,
					userData: null,
					userInfo: null
				}),
			setImage: (image) =>
				set((state) => ({
					userData: state.userData ? { ...state.userData, image } : null
				})),
			setNickname: (nickname) =>
				set((state) => ({
					userInfo: state.userInfo ? { ...state.userInfo, nickname } : null
				}))
		}),
		{
			name: "auth-storage",
			storage: createJSONStorage(() => sessionStorage)
		}
	)
);
