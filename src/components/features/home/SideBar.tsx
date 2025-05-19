import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";
import logoCircle from "../../../assets/images/logo_circle.png";
import { useAuthStore } from "../../../store/authStore";
import { useThemeStore } from "../../../store/themeStore";
import Icon from "../../commons/Icon";

export default function SideBar({
	sidebarOpen,
	signOut,
	toggleHandler,
	toggleUserList
}: {
	sidebarOpen: boolean;
	signOut: () => void;
	toggleHandler: () => void;
	toggleUserList: () => void;
}) {
	const navigate = useNavigate();
	const userInfo = useAuthStore((state) => state.userInfo);
	const userData = useAuthStore((state) => state.userData);
	const { isDark, toggleTheme } = useThemeStore();

	const userListIconPosition = isDark ? "90.135% 3.073%" : "90.135% 11.732%";
	const darkModeIconPosition = isDark ? "52.036% 81.18%" : "23.318% 81.006%";
	const logoutIconPosition = isDark ? "64.889% 88.056%" : "37.778% 80.833%";
	const closeIconPosition = isDark ? "72.727% 27.869%" : "28.571% 27.869%";

	const setDarkMode = () => {
		toggleTheme();
	};

	return createPortal(
		<div>
			{sidebarOpen && (
				<div
					onClick={toggleHandler}
					className="sm:hidden fixed inset-0 bg-black opacity-30 z-60"
				/>
			)}
			<div
				className={twMerge(
					"sm:hidden fixed flex flex-col gap-8 right-0 top-0 bottom-0 w-[270px] bg-white z-[100] rounded-l-[10px]",
					"p-6 dark:bg-[#333333] transform transition-transform duration-300 ease-in-out",
					sidebarOpen ? "translate-x-0" : "translate-x-full"
				)}
			>
				<Icon
					onClick={toggleHandler}
					position={closeIconPosition}
					size="14px"
				/>
				<div
					onClick={() => {
						if (userInfo) {
							navigate(`/profile/${userData?._id}`);
						} else {
							navigate("/login");
						}
						toggleHandler();
					}}
					className="flex items-center gap-4 pb-8 border-b border-[#EAEAEA] dark:border-[#4a4b4d]"
				>
					<img
						src={userData?.image ? userData.image : logoCircle}
						alt="프로필 이미지"
						className="w-20 h-20 rounded-full object-cover"
					/>
					<div className="flex flex-col items-center gap-2">
						{userInfo ? (
							<span className="font-medium">
								{userInfo?.name}({userInfo?.nickname})
							</span>
						) : (
							<span className="font-medium">로그인 해주세요</span>
						)}
						<div
							className={twMerge(
								"flex gap-2 bg-[#06B796] px-2 py-[2px] rounded-[12px] text-white font-medium",
								"select-none active:bg-[#038383]"
							)}
						>
							{userData ? <span>MY</span> : <span>LOGIN</span>}
							<span>&gt;</span>
						</div>
					</div>
				</div>

				<button
					onClick={() => {
						toggleUserList();
						toggleHandler();
					}}
					className="flex items-center gap-4 cursor-pointer"
				>
					<Icon size="24px" position={userListIconPosition} />
					<span>사용자 리스트</span>
				</button>

				<button
					onClick={() => {
						setDarkMode();
					}}
					className="flex items-center gap-4 cursor-pointer"
				>
					<Icon size="24px" position={darkModeIconPosition} />
					<span>{isDark ? "라이트 모드" : "다크 모드"}</span>
				</button>
				{userData && (
					<button
						onClick={async () => {
							toggleHandler();
							signOut();
						}}
						className="flex items-center gap-4 cursor-pointer absolute bottom-17"
					>
						<Icon size="24px" position={logoutIconPosition} />
						<span>로그아웃</span>
					</button>
				)}
			</div>
		</div>,
		document.body
	);
}
