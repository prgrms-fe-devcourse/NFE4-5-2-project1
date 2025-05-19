import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { getConversations } from "../../../apis/message";
import defaultProfileImage from "../../../assets/images/profileImg_circle.svg";
import { useAuthStore } from "../../../store/authStore";
import { useThemeStore } from "../../../store/themeStore";
import Icon from "../../commons/Icon";
import UserListModal from "../user/UserListModal";

export default function ConversationList() {
	const isDark = useThemeStore((state) => state.isDark);
	const [conversations, setConversations] = useState<ConversationData[]>([]);
	const navigate = useNavigate();
	const myUserId = useAuthStore((state) => state.userId);
	const [hoveredField, setHoveredField] = useState<string | null>(null);
	const [searchRoom, setSearchRoom] = useState("");
	const [openModal, setOpenModal] = useState(false);

	const totalUnread = conversations.filter(
		(conv) => conv.receiver._id === myUserId && !conv.seen
	).length;

	useEffect(() => {
		const fetchConversations = async () => {
			try {
				const data = await getConversations();
				setConversations(data);
			} catch (err) {
				console.log("대화 목록 불러오기 실패", err);
			}
		};
		fetchConversations();

		const interval = setInterval(fetchConversations, 3000);
		return () => clearInterval(interval);
	}, []);

	const getDisplayName = (fullName: string | User) => {
		if (typeof fullName === "string") {
			try {
				const parsed = JSON.parse(fullName);
				return parsed.nickname || parsed.name || "이름없음";
			} catch {
				return fullName;
			}
		} else {
			return fullName.nickname || fullName.name;
		}
	};

	if (conversations.length === 0) {
		return (
			<>
				<div className="text-gray-400 text-center mt-10">
					아직 대화한 사람이 없습니다.
					<br />
					사람들과 대화를 시작해보세요!
				</div>
				<div className="sm:hidden fixed bottom-25 right-8">
					<button
						className="w-[70px] h-[70px]
						   rounded-full bg-[#06B796] px-5 cursor-pointer
						   flex items-center justify-center"
						onClick={() => setOpenModal(true)}
					>
						<Icon position="-19px -161px" size="21px" />
					</button>
				</div>
				{openModal &&
					createPortal(
						<>
							<div className="fixed inset-0 bg-black opacity-30 z-50" />
							<UserListModal
								className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
								onClose={() => setOpenModal(false)}
								navHandler={(opponentId: string) => {
									setOpenModal(false);
									navigate(`/message/${opponentId}`);
								}}
							/>
						</>,
						document.body
					)}
			</>
		);
	}

	const filteredConversations = conversations.filter((conv) => {
		const opponent = conv.sender._id === myUserId ? conv.receiver : conv.sender;
		const opponentName = getDisplayName(opponent.fullName);

		return opponentName.toLowerCase().includes(searchRoom.trim().toLowerCase());
	});

	return (
		<div className="flex flex-col w-full sm:h-full h-screen p-2">
			<div className="shrink-0 flex items-center gap-[10px]">
				<Icon
					onClick={() => navigate(-1)}
					position={isDark ? "50.218% 27.747%" : "39.301% 27.747%"}
					size="16px"
					className="sm:hidden block cursor-pointer"
				/>
				<div className="pl-2 sm:py-0 py-3 sm:text-[20px] font-semibold text-[#333333] dark:text-[#FFFFFF]">
					메시지{" "}
					{totalUnread > 0 && (
						<span className="text-[#FD346E] font-bold">{totalUnread}</span>
					)}
				</div>
			</div>
			<div
				className="sm:mt-[25px] mt-4 sm:mb-0 mb-25 w-full h-[50px] bg-white dark:bg-[#2A2A2A] rounded-[10px] shadow-[0_2px_8px_0_rgba(189,189,189,0.2)] relative group"
				onMouseEnter={() => setHoveredField("search")}
				onMouseLeave={() => setHoveredField(null)}
			>
				<input
					type="text"
					placeholder="검색"
					value={searchRoom}
					onChange={(e) => setSearchRoom(e.target.value)}
					className="w-full h-full pl-11 pr-4 sm:text-[16px] text-sm text-[#616161] dark:text-[#dadada] placeholder-[#616161] bg-transparent focus:outline-none"
				/>
				<div className="absolute left-4 top-[54%] -translate-y-1/2 w-[24px] h-[24px]">
					<Icon
						size="24px"
						position={
							hoveredField === "search" ? "-145px -345px" : "-31px -124px"
						}
					/>
				</div>
			</div>
			<div className="flex-1 mt-4 overflow-y-auto none-scrollbar">
				{filteredConversations.length === 0 ? (
					<div className="text-[#616161] dark:text-[#ACACAC] text-center mt-6">
						검색 결과가 없습니다.
					</div>
				) : (
					filteredConversations.map((conv) => {
						const opponent =
							conv.sender._id === myUserId ? conv.receiver : conv.sender;

						const formattedTime = new Date(conv.createdAt).toLocaleTimeString(
							[],
							{
								hour: "2-digit",
								minute: "2-digit"
							}
						);

						return (
							<div
								key={conv._id?.toString()}
								className="flex flex-col items-center"
							>
								<div
									className="group w-full h-[80px] bg-[#FFFFFF] dark:bg-[#2A2A2A] sm:rounded-[10px] sm:shadow-[0_2px_8px_0_rgba(189,189,189,0.2)]
								flex items-center px-4 justify-between sm:mt-4 hover:bg-[#CEE6E2] dark:hover:bg-[#686868] cursor-pointer transition-colors "
									onClick={() => navigate(`/message/${opponent._id}`)}
								>
									<div className="flex items-center gap-4 overflow-hidden">
										<div className="relative w-[56px] h-[56px]">
											<img
												src={opponent.image?.trim() || defaultProfileImage}
												alt="프로필"
												className="w-[56px] h-[56px] rounded-full object-cover"
											/>

											{conv.receiver._id === myUserId && !conv.seen && (
												<span className="absolute top-0 right-0 w-[8px] h-[8px] bg-[#FD346E] rounded-full"></span>
											)}
										</div>

										<div className="flex flex-col overflow-hidden z-10">
											<div className="sm:text-[18px] font-bold text-[#333333] dark:text-[#FFFFFF] leading-none">
												{getDisplayName(opponent.fullName)}
											</div>
											<div className="sm:text-[16px] text-sm text-[#808080] mt-[9px] truncate max-w-[200px] dark:group-hover:text-[#B1B1B1]">
												{conv.message}
											</div>
										</div>
									</div>

									<div className="sm:text-[14px] text-[13px] text-[#7F7F7F] whitespace-nowrap ml-2 relative top-[14px]">
										{formattedTime}
									</div>
								</div>
								<div className="sm:hidden inline-block w-[76%] border-b-1 border-[#FAFAFA] dark:border-[#2f3033] z-0"></div>
							</div>
						);
					})
				)}
			</div>
			<div className="sm:hidden fixed bottom-25 right-8">
				<button
					className="w-[70px] h-[70px]
						   rounded-full bg-[#06B796] px-5 cursor-pointer
						   flex items-center justify-center"
					onClick={() => setOpenModal(true)}
				>
					<Icon position="-19px -161px" size="21px" />
				</button>
			</div>
			{openModal &&
				createPortal(
					<>
						<div className="fixed inset-0 bg-black opacity-30 z-50" />
						<UserListModal
							className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
							onClose={() => setOpenModal(false)}
							navHandler={(opponentId: string) => {
								setOpenModal(false);
								navigate(`/message/${opponentId}`);
							}}
						/>
					</>,
					document.body
				)}
		</div>
	);
}
