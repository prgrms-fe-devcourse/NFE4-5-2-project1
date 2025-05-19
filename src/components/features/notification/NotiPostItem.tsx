import { useNavigate } from "react-router";
import profileImg from "../../../assets/images/profileImg_circle.svg";
import { useNoti } from "../../../context/useNoti";
import { getDiffInDays } from "../../../utils/date";

export default function NotiPostItem({
	notice,
	onClose
	// setNotiInfo
}: {
	notice: NotiData;
	onClose: () => void;
	// setNotiInfo: React.Dispatch<React.SetStateAction<NotiData[]>>;
}) {
	const navigate = useNavigate();
	const { setNotiInfo } = useNoti();
	const formatTime = (time: string): string => {
		if (!time) return "시간정보없음";

		const date = new Date(time);
		const currentTime = new Date();
		if (getDiffInDays(new Date(time), currentTime) >= 1) {
			const month = date.getMonth();
			const dates = date.getDate();
			return `${String(month).padStart(2, "0")}.${String(dates).padStart(2, "0")}`;
		}
		let hours = date.getHours();
		const min = date.getMinutes();
		const period = hours >= 12 ? "PM" : "AM";

		hours = hours % 12;
		if (hours === 0) hours = 12;

		return `${String(hours).padStart(2, "0")}:${String(min).padStart(2, "0")} ${period}`;
	};
	// console.log("notice,notice.seen:", notice, notice.seen);
	// console.log("user:", notice.user);
	// console.log("author:", notice.author);
	const nickname = JSON.parse(notice.author.fullName)?.nickname || "알수없음";
	const userImage = notice.author.image || profileImg;
	const time = formatTime(notice.createdAt);

	const handleClick = async () => {
		try {
			setNotiInfo((noti) => {
				const newNoti = noti.map((n) =>
					n._id === notice._id ? { ...n, seen: true } : n
				);
				console.log("게시글 알림 읽음", newNoti);
				return newNoti;
			});
			navigate(`/post/detail/${notice.post}`);
			onClose();
		} catch (e) {
			console.error("알람 읽음 처리 실패", e);
		}
	};

	return (
		<div
			className="flex items-center w-full sm:h-[100px] sm:py-0 py-4 border-b border-[#CDCDCD] cursor-pointer hover:bg-[#F3F4F6] transition-colors duration-150"
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
				{notice.like && (
					<div className="flex justify-between items-center w-full">
						<div className="text-sm sm:text-[16px]">
							{nickname}님이 게시글에 좋아요를 남기셨습니다.
						</div>
						<div className="text-[13px] sm:text-[14px]">{time}</div>
					</div>
				)}

				{notice.comment && (
					<div className="w-full">
						<div className="flex justify-between items-center w-full">
							<div className="text-sm sm:text-[16px]">
								{nickname}님이 게시글에 댓글을 남기셨습니다.
							</div>
							<div className="text-[13px] sm:text-[14px] whitespace-nowrap">
								{time}
							</div>
						</div>
						<div className="text-[13px] sm:text-[14px]">
							{JSON.parse(notice.comment?.comment).value || ""}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
