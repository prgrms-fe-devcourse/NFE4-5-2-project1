import { useState } from "react";
import { createMessage } from "../../../apis/message";
import { createNoti } from "../../../apis/notification";
import Icon from "../../commons/Icon";

interface MessageInputProps {
	receiverId: string;
	onMessageSent: (newMessage: MessageData) => void;
}

export default function MessageInput({
	receiverId,
	onMessageSent
}: MessageInputProps) {
	const [text, setText] = useState("");

	const handleSend = async () => {
		if (!text.trim()) return;
		try {
			const data = await createMessage(text, receiverId);
			onMessageSent(data);
			setText("");

			await createNoti({
				notificationType: "MESSAGE",
				notificationTypeId: data._id,
				userId: data.receiver._id,
				postId: null
			});
		} catch (err) {
			console.error("메시지 전송 실패", err);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<div className="p-4 flex justify-center w-full sm:relative absolute sm:bottom-0 bottom-1/12">
			<div className="w-[680px] h-[66px] bg-white dark:bg-[#2A2A2A] rounded-[8px] flex items-center px-4 shadow-[0_2px_8px_0_rgba(189,189,189,0.2)]">
				<input
					value={text}
					onChange={(e) => setText(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="메시지를 입력하세요"
					className="flex-1 h-full bg-transparent focus:outline-none text-[16px] placeholder:text-[#DADADA] "
				/>
				<button
					onClick={handleSend}
					className="w-[50px] h-[46px] bg-[#06B796] hover:bg-[#05A187] rounded-[8px] flex items-center justify-center ml-2 transition-colors duration-200 cursor-pointer"
				>
					<Icon size="24px" position="-24px -200px" />
				</button>
			</div>
		</div>
	);
}
