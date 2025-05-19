import { NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import Icon from "../components/commons/Icon";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";

export default function Footer() {
	const userId = useAuthStore((state) => state.userId);
	const isDark = useThemeStore((state) => state.isDark);

	return (
		<div
			className={twMerge(
				"sm:hidden text-sm fixed flex items-center text-[#616161] bottom-0 w-full h-[70px] bg-white border-t border-[#F3F3F3] z-[50]",
				"dark:bg-[#333333] dark:border-[#161616] dark:text-[#fff]"
			)}
		>
			<NavLink
				to={"/channel/전체글"}
				className={"flex flex-1 flex-col items-center gap-[2px]"}
				children={({ isActive }) => (
					<>
						<Icon
							position={isActive ? "79.295% 65.934%" : "92.07% 65.659%"}
							size="20px"
							className={twMerge(isDark && "invert brightness-0")}
						/>
						<span>홈</span>
					</>
				)}
			/>
			<NavLink
				to={"/notification"}
				className={"flex flex-1 flex-col items-center gap-[2px]"}
				children={({ isActive }) => (
					<>
						<Icon
							position={isActive ? "79.646% 73.13%" : "92.478% 73.13%"}
							size="20px"
							className={twMerge(isDark && "invert brightness-0")}
						/>
						<span>알림</span>
					</>
				)}
			/>
			<NavLink
				to={"/message"}
				className={"flex flex-1 flex-col items-center gap-[2px]"}
				children={({ isActive }) => (
					<>
						<Icon
							position={isActive ? "79.556% 80.939%" : "92.444% 80.939%"}
							size="20px"
							className={twMerge(isDark && "invert brightness-0")}
						/>
						<span>채팅</span>
					</>
				)}
			/>
			<NavLink
				to={userId ? `/profile/${userId}` : "/login"}
				className={"flex flex-1 flex-col items-center gap-[2px]"}
				children={({ isActive }) => (
					<>
						<Icon
							position={isActive ? "79.039% 88.154%" : "92.14% 88.122%"}
							size="20px"
							className={twMerge(isDark && "invert brightness-0")}
						/>
						<span>마이페이지</span>
					</>
				)}
			/>
		</div>
	);
}
