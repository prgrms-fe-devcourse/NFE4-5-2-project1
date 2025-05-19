import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { axiosInstance } from "../apis/axios";
import { getMessageList, readMessage } from "../apis/message";
import Icon from "../components/commons/Icon";
import MessageInput from "../components/features/message/MessageInput";
import MessageList from "../components/features/message/MessageList";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";

export default function Message() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [messages, setMessages] = useState<MessageData[]>([]);
	const myUserId = useAuthStore((state) => state.userId);
	const isDark = useThemeStore((state) => state.isDark);
	const [fallbackOp, setFallbackOp] = useState<UserData | null>(null);

	const opponent =
		messages.length > 0
			? messages[0].sender._id === myUserId
				? messages[0].receiver
				: messages[0].sender
			: fallbackOp;

	useEffect(() => {
		if (!id) return;

		const fetchMessages = async () => {
			try {
				const data = await getMessageList(id);
				setMessages(data);
				readMessage(id); // 읽음 처리

				if (data.length === 0) {
					const { data: userData } = await axiosInstance.get(`/users/${id}`);
					setFallbackOp(userData);
				}
			} catch (err) {
				console.error("메시지 로딩 실패", err);
			}
		};
		fetchMessages();

		const interval = setInterval(fetchMessages, 3000);
		return () => clearInterval(interval);
	}, [id]);

	const handleNewMessage = (newMsg: MessageData) => {
		setMessages((prev) => [...prev, newMsg]);
	};

	return (
		<div className="flex flex-col h-full">
			{opponent && (
				<div className="dark:border-[#4a4b4d] h-[70px] sm:bg-[#f6faf9] bg-white dark:bg-[#1B1D22] flex items-center sm:px-0 px-6 border-[#f3f3f3] z-50">
					<Icon
						onClick={() => navigate(-1)}
						position={isDark ? "50.218% 27.747%" : "39.301% 27.747%"}
						size="16px"
						className="sm:hidden block cursor-pointer"
					/>
					<h2 className="px-4 sm:text-[20px] font-semibold text-[#333] dark:text-[#FFFFFF] mt-[25px] mb-[25px]">
						{typeof opponent.fullName === "string"
							? JSON.parse(opponent.fullName).nickname ||
								JSON.parse(opponent.fullName).name
							: (opponent.fullName as User).nickname ||
								(opponent.fullName as User).name}
					</h2>
				</div>
			)}

			<MessageList key={id} messages={messages} myUserId={myUserId!} />

			<MessageInput receiverId={id!} onMessageSent={handleNewMessage} />
		</div>
	);
}
