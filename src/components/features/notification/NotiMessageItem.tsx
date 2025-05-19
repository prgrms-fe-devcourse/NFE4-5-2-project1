import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getMessageList } from "../../../apis/message";
import profileImg from "../../../assets/images/profileImg_circle.svg";
import { useNoti } from "../../../context/useNoti";
// import { useEffect } from "react";

export default function NotiMessageItem({
	notice,
	onClose
	// setNotiInfo
}: {
	notice: NotiData;
	onClose: () => void;
	// setNotiInfo: React.Dispatch<React.SetStateAction<NotiData[]>>;
}) {
	const navigate = useNavigate();
	// const [isSeen, setIsSeen] = useState(notice.seen);
	const [mess, setMess] = useState<MessageData>();
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
	const nickname = JSON.parse(notice.author.fullName).nickname;
	const userImage = notice.author.image || profileImg;
	const time = formatTime(notice.createdAt);

	useEffect(() => {
		const getMessages = async () => {
			try {
				const messages: MessageData[] = await getMessageList(notice.author._id);
				setMess(messages.find((m) => m._id === notice.message));
			} catch (error) {
				console.error("특정 사용자 메시지 목록 불러오기 실패", error);
			}
		};
		getMessages();
	}, [notice.author._id, notice.message]);

	const handleClick = async () => {
		try {
			if (notice.message) {
				setNotiInfo((noti) => {
					const newNoti = noti.map((n) =>
						n._id === notice._id ? { ...n, seen: true } : n
					);
					console.log("메시지 알림 읽음", newNoti);
					return newNoti;
				});
				// console.log("특정사용자Id:", notice.author._id);
				navigate(`/message/${notice.author._id}`);
				onClose();
			}
		} catch (e) {
			console.error("알람 읽음 처리 실패", e);
		}
	};
	return (
		<div
			className="flex items-center w-full sm:h-[100px] sm:py-0 py-4 border-b border-[#CDCDCD]  cursor-pointer hover:bg-[#F3F4F6] transition-colors duration-150 dark:hover:bg-[#6B6B6B] dark:border-[#7F7F7F]"
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
							{nickname}님이 메시지를 보내셨습니다.
						</div>
						<div className="text-[13px] sm:text-[14px] whitespace-nowrap">
							{time}
						</div>
					</div>
					<div className="text-[13px] sm:text-[14px]">{mess?.message}</div>
				</div>
			</div>
		</div>
	);
}
