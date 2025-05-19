// import { useEffect } from "react";
// import { getPostById } from "../../../apis/post";
import { useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";
import profileImg from "../../../assets/images/profileImg_circle.svg";
import { useNoti } from "../../../context/useNoti";

export default function NotiRequestItem({
	notice,
	onClose
	// setNotiInfo
}: {
	notice: NotiData;
	onClose: () => void;
	// setNotiInfo: React.Dispatch<React.SetStateAction<NotiData[]>>;
}) {
	const navigate = useNavigate();
	// const [parsedTitle, setParsedTitle] = useState<string>("");
	const { setNotiInfo } = useNoti();
	const formatTime = (time: string): string => {
		if (!time) return "시간정보없음";

		const date = new Date(time);
		let hours = date.getHours();
		const min = date.getMinutes();
		const period = hours >= 12 ? "PM" : "AM";

		hours = hours % 12;
		if (hours === 0) hours = 12;
		return `${String(hours).padStart(2, "0")}:${String(min).padStart(2, "0")} ${period}`;
	};

	// useEffect(() => {
	// 	const fetchPost = async () => {
	// 		try {
	// 			const post = await getPostById(notice.post as string);
	// 			// const parsed = JSON.parse(post.title);
	// 			// setParsedTitle(parsed.title);
	// 		} catch (error) {
	// 			console.error("게시글 불러오기 실패:", error);
	// 			// setParsedTitle("제목 없음");
	// 		}
	// 	};
	// 	fetchPost();
	// }, [notice.post]);
	const nickname = JSON.parse(notice.author.fullName).nickname;
	const userImage = notice.author.image || profileImg;
	const time = formatTime(notice.createdAt);

	const handleClick = async () => {
		try {
			if (notice.post) {
				// setIsSeen(true);
				setNotiInfo((noti) => {
					const newNoti = noti.map((n) =>
						n._id === notice._id ? { ...n, seen: true } : n
					);
					console.log("동행요청 알림 읽음:", newNoti);
					return newNoti;
				});
				navigate(`/post/detail/${notice.post}`);
				onClose();
			}
		} catch (e) {
			console.error("알람 읽음 처리 실패", e);
		}
	};

	return (
		<div
			className={twMerge(
				"flex items-center w-full sm:h-[100px] sm:py-0 py-4 border-b border-[#CDCDCD] cursor-pointer hover:bg-[#F3F4F6] transition-colors duration-150"
			)}
			onClick={handleClick}
		>
			<div className="relative flex items-center">
				<img
					className="w-[60px] h-[60px] rounded-full ml-[30px]"
					src={userImage}
					alt="사용자이미지"
				/>
				{!notice.seen && (
					<div className="absolute w-[10px] h-[10px] rounded-full top-[-5px] right-[-5px] bg-[#FD346E]" />
				)}
			</div>

			<div className="flex flex-col ml-[14px] w-[426px] sm:px-0 px-2">
				<div className="w-full">
					<div className="flex justify-between items-center w-full">
						<div className="text-sm sm:text-[16px]">
							{nickname}님이 동행요청을 보내셨습니다.
						</div>
						<div className="text-[13px] sm:text-[14px] whitespace-nowrap">
							{time}
						</div>
					</div>
					{/* <div className="text-[14px]">
						{parsedTitle ? `게시글: ${parsedTitle}` : "게시글:   "}
					</div> */}
				</div>
			</div>
		</div>
	);
}
