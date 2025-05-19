import { useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../../apis/axios";
import defaultProfileImage from "../../../assets/images/profileImg_circle.svg";

interface ChattingComponentProps {
	message: string;
	sender: UserData;
	createdAt: string;
	isMe: boolean;
	seen: boolean;
	showProfileImage: boolean;
	showTime: boolean;
	isFirstOfGroup: boolean;
}

export default function ChattingComponent({
	message,
	sender,
	createdAt,
	isMe,
	seen,
	showProfileImage,
	showTime,
	isFirstOfGroup
}: ChattingComponentProps) {
	const nickname = isMe
		? "나"
		: typeof sender.fullName === "string"
			? JSON.parse(sender.fullName).nickname || JSON.parse(sender.fullName).name
			: (sender.fullName as User).nickname || (sender.fullName as User).name;
	const time = new Date(createdAt).toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit"
	});

	const { id: opponentId } = useParams();

	useEffect(() => {
		const markAsSeen = async () => {
			try {
				await axiosInstance.put("/messages/update-seen", {
					sender: opponentId
				});
			} catch (err) {
				console.error("읽음 처리 실패", err);
			}
		};
		markAsSeen();
	}, [opponentId]);

	return (
		<div
			className={`flex ${isFirstOfGroup ? "my-4" : "my-[3px]"} ${isMe ? "justify-end" : ""}`}
		>
			{!isMe && (
				<div className="flex items-start gap-2 ml-3">
					{showProfileImage ? (
						<Link to={`/profile/${sender._id}`}>
							<img
								src={sender.image?.trim() || defaultProfileImage}
								alt="상대 프로필"
								className="sm:w-[60px] sm:h-[60px] w-13 h-13 rounded-full object-cover mt-1 cursor-pointer"
							/>
						</Link>
					) : (
						<div className="sm:w-[60px] sm:h-[60px] w-13 h-13" /> // 자리 유지를 위한 빈 박스 (선택)
					)}
					<div>
						{showProfileImage && (
							<p className="sm:text-[16px] text-sm text-[#333] dark:text-[#FFFFFF] mb-1">
								{nickname}
							</p>
						)}
						<div className="flex items-baseline gap-1">
							<div className="p-3 bg-[#FFFFFF] dark:bg-[#2A2A2A] rounded-md max-w-[300px] break-words">
								<span className="sm:text-[16px] text-[15px] text-[#333] dark:text-[#E0E0E0]">
									{message}
								</span>
							</div>
							{showTime && (
								<div className="sm:text-[14px] text-[13px] text-[#616161] dark:text-[#7F7F7F] ml-2 self-end">
									{time}
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{isMe && (
				<div className="flex justify-end items-end gap-2 my-2 mr-3">
					<div className="flex items-center gap-1">
						{isMe && !seen && (
							<span className="text-[16px] text-[#808080] dark:text-[#ACACAC] w-[16px] h-[16px] flex items-center justify-center">
								1
							</span>
						)}
						{showTime && (
							<span className="text-[14px] text-[#616161] dark:text-[#7F7F7F]">
								{time}
							</span>
						)}
					</div>

					<div className="p-3 bg-[#E0F4F2] dark:bg-[#C2CFCE] rounded-md max-w-[300px] break-words">
						<span className="text-[16px] text-[#333] dark:text-[#1B1B1B]">
							{message}
						</span>
					</div>
				</div>
			)}
		</div>
	);
}
