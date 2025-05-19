import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import ChattingComponent from "./ChattingComponent";

interface MessageListProps {
	messages: MessageData[];
	myUserId: string;
}

export default function MessageList({ messages, myUserId }: MessageListProps) {
	const messageBoxRef = useRef<HTMLDivElement | null>(null);
	const [showScrollButton, setShowScrollButton] = useState(false);
	const [initScroll, setInitScroll] = useState(false);
	const { id } = useParams();

	useEffect(() => {
		const box = messageBoxRef.current;
		if (!box) return;

		const handleScroll = () => {
			const { scrollTop, scrollHeight, clientHeight } = box;
			const isNearBottom = scrollTop + clientHeight >= scrollHeight - 10;
			setShowScrollButton(!isNearBottom);
		};

		box.addEventListener("scroll", handleScroll);
		return () => box.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		if (!id) return;
		setInitScroll(false);
	}, [id]);

	useEffect(() => {
		if (!initScroll && id && messageBoxRef.current && messages.length > 0) {
			requestAnimationFrame(() => {
				setTimeout(() => {
					const box = messageBoxRef.current;
					if (box) {
						box.scrollTop = box.scrollHeight;
						setInitScroll(true);
					}
				}, 0);
			});
		}
	}, [messages.length, initScroll, id]);

	useEffect(() => {
		if (messageBoxRef.current && messages.length > 0) {
			const box = messageBoxRef.current;

			const scrollTop = box.scrollTop;
			const scrollHeight = box.scrollHeight;
			const clientHeight = box.clientHeight;

			const isNearBottom = scrollTop + clientHeight >= scrollHeight - 10;
			const isWayTooHigh = scrollTop < clientHeight * 0.6;

			if (isNearBottom || isWayTooHigh) {
				requestAnimationFrame(() => {
					setTimeout(() => {
						box.scrollTop = box.scrollHeight;
					}, 0);
				});
			}
		}
	}, [messages, id]);

	const scrollToBottom = () => {
		const box = messageBoxRef.current;
		if (box) {
			box.scrollTo({ top: box.scrollHeight, behavior: "smooth" });
		}
	};

	return (
		<div
			ref={messageBoxRef}
			className="flex flex-col px-4 pt-2 sm:mb-0 mb-[30%] overflow-y-auto h-full custom-scrollbar"
		>
			{messages.map((msg, idx) => {
				const isMe = msg.sender._id === myUserId;
				const previous = messages[idx - 1];
				const next = messages[idx + 1];

				const isFirstOfGroup =
					!previous || previous.sender._id !== msg.sender._id;

				const currentDate = new Date(msg.createdAt);
				const nextDate = next ? new Date(next.createdAt) : null;

				const isSameSenderAsNext = next && next.sender._id === msg.sender._id;

				const isSameDate =
					nextDate &&
					currentDate.getFullYear() === nextDate.getFullYear() &&
					currentDate.getMonth() === nextDate.getMonth() &&
					currentDate.getDate() === nextDate.getDate();

				const isSameMinute =
					nextDate &&
					Math.abs(currentDate.getTime() - nextDate.getTime()) < 60 * 1000;

				const showTime =
					!nextDate || !isSameSenderAsNext || !isSameDate || !isSameMinute;

				return (
					<ChattingComponent
						key={msg._id}
						message={msg.message}
						sender={msg.sender}
						createdAt={msg.createdAt}
						isMe={isMe}
						seen={msg.seen}
						showProfileImage={!isMe && isFirstOfGroup}
						showTime={showTime}
						isFirstOfGroup={isFirstOfGroup}
					/>
				);
			})}

			{showScrollButton && (
				<button
					onClick={scrollToBottom}
					className={`absolute sm:bottom-[82px] bottom-[20%] left-1/2 transform -translate-x-1/2 
						w-[40px] h-[40px] rounded-full bg-white border border-gray-300 
						flex items-center justify-center cursor-pointer text-black text-xl transition-all duration-300 hover:opacity-80 hover:ring hover:ring-gray-200 
						${showScrollButton ? "opacity-100" : "opacity-0 pointer-events-none"}`}
				>
					↓
				</button>
			)}
		</div>
	);
}
