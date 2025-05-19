import { useParams } from "react-router";
import { twMerge } from "tailwind-merge";
import Message from "../../../pages/Message";
import ConversationList from "./ConversationList";

export default function MessageLayout() {
	const { id } = useParams();
	return (
		<div className="w-full flex sm:justify-center bg-[#F6FAF9] dark:bg-[#1B1D22] h-screen">
			<div className="sm:w-[1280px] flex w-full">
				<div
					className={twMerge(
						"sm:w-auto w-full sm:block",
						id && "hidden sm:block"
					)}
				>
					<div className="sm:hidden left-0 right-0 top-[18%] absolute bottom-0 bg-white dark:bg-[#2A2A2A] rounded-t-[40px] shadow-[0_2px_8px_0_rgba(189,189,189,0.2)]" />
					<aside className="sm:w-[400px] w-full sm:p-4 px-4 overflow-y-auto h-full">
						<ConversationList />
					</aside>
				</div>

				<main
					className={twMerge(
						"flex-1 h-full overflow-y-auto",
						!id && "hidden sm:block"
					)}
				>
					{id ? (
						<Message />
					) : (
						<div className="flex items-center justify-center h-full text-gray-400">
							대화할 사용자를 선택해주세요.
						</div>
					)}
				</main>
			</div>
		</div>
	);
}
