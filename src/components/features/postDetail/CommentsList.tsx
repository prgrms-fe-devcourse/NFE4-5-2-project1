import { useState } from "react";
import { useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";
import { useAuthStore } from "../../../store/authStore";
import { usePostStore } from "../../../store/postStore";
import CommentItem from "./CommentItem";

export default function Comments({ authorId }: { authorId: string }) {
	const navigate = useNavigate();
	const [value, setValue] = useState("");
	const addComment = usePostStore((state) => state.addComment);
	const comments = usePostStore((state) => state.comments);
	const userId = useAuthStore((state) => state.userId);
	return (
		<div className="mb-10">
			<span className="post-sub-title inline">댓글</span>
			<span className="sub_title_number">{comments.length}</span>
			<ul className="border-t border-[#CDCDCD] mt-4 dark:border-[#616161]">
				{comments
					.filter((commentData) => {
						const parsed: CommentType = JSON.parse(commentData.comment);
						return parsed.type === "comment";
					})
					.map((commentData) => {
						return (
							<CommentItem
								key={commentData._id}
								comment={commentData}
								authorId={authorId}
							/>
						);
					})}
			</ul>

			<form
				className="relative"
				onSubmit={(e) => {
					if (userId) {
						addComment(e, value, userId);
						setValue("");
					} else {
						navigate("/login");
					}
				}}
			>
				<input
					className={twMerge(
						"w-full sm:h-15 h-13 mt-[35px] px-4 border border-[#CDCDCD] rounded-[10px] text-sm placeholder:text-[#CDCDCD] text-black focus:outline-0",
						"dark:border-[#616161] dark:placeholder:text-[#616161] dark:text-[#dadada]"
					)}
					type="text"
					placeholder="댓글을 입력해주세요"
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
				<button
					type="submit"
					className={twMerge(
						"absolute sm:top-[42px] top-[41px] sm:right-2 right-1 w-20 sm:h-[46px] h-10 bg-[#f3f4f6] text-[#06b796] font-medium rounded-lg",
						"sm:hover:text-white sm:hover:bg-[#06b796] cursor-pointer sm:text-base text-sm",
						"active:text-white active:bg-[#06b796]",
						"dark:bg-[#333] dark:border dark:border-[#06b796]"
					)}
				>
					등록
				</button>
			</form>
		</div>
	);
}
