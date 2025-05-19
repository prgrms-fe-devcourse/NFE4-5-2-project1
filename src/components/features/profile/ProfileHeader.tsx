import { useNavigate } from "react-router";
import { useThemeStore } from "../../../store/themeStore";
import Icon from "../../commons/Icon";

export default function ProfileHeader({
	onEditClick,
	isMyPage,
	userId
}: {
	userId: string | null;
	isMyPage: boolean;
	onEditClick: () => void;
}) { 
	const navigate = useNavigate();
	// darkmode
	const isDark = useThemeStore((state) => state.isDark);
	const backIconPosition = isDark ? "50.218% 27.747%" : "39.301% 27.747%";

	return (
		<div className="dark:bg-[#1B1D22] border-b border-[#4a4b4d] sm:border-0 px-[16px] sm:p-0 fixed top-0 left-0 w-full z-50 bg-white h-[70px] flex items-center justify-between mb-[36px] sm:static">
			<div className="flex">
				<button
					className="mr-[10px] sm:mr-[12px] mt-[1.6px] sm:mt-[3px] cursor-pointer"
					aria-label="Go Back"
					onClick={() => navigate("/")}
				>
					<Icon position={backIconPosition} size="16px" />
				</button>
				<h2 className="font-medium text-[16px] sm:text-[20px] text-[#333333] dark:text-[#dadada]">
					마이페이지 & 리뷰
				</h2>
			</div>
			{isMyPage ? (
				<button
					onClick={onEditClick}
					className="select-none inline-flex items-center justify-center w-[116px] h-[43px] sm:w-[160px] sm:h-[40px] font-medium text-[16px] sm:text-[18px] text-white bg-[#06b796] p-[12px] sm:px-[27px] sm:py-[7px] rounded-[8px] cursor-pointer"
				>
					회원정보 수정
				</button>
			) : (
				<button
					onClick={() => navigate(`/message/${userId}`)}
					className="inline-flex items-center justify-center w-[116px] h-[43px] sm:w-[160px] sm:h-[40px] font-medium text-[16px] sm:text-[18px] text-white bg-[#1C274C] p-[12px] sm:px-[27px] sm:py-[7px] rounded-[8px] cursor-pointer"
				>
					채팅 보내기
				</button>
			)}
		</div>
	);
}