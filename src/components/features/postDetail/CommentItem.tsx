import { useAuthStore } from "../../../store/authStore";
import { usePostStore } from "../../../store/postStore";
import { formatDate, formatTime } from "../../../utils/date";
import ProfileImage from "../../commons/ProfileImage";

export default function CommentItem({
	comment,
	authorId
}: {
	comment: CommentData;
	authorId: string;
}) {
	const userId = useAuthStore((state) => state.userId);
	const deleteComment = usePostStore((state) => state.deleteComment);
	const userInfo: Profile = JSON.parse(comment.author.fullName);
	const date = new Date(comment.createdAt);
	const { value }: CommentType = JSON.parse(comment.comment);

	return (
		<li className="flex items-center gap-[10px] sm:py-6 py-3 border-b border-[#d9d9d9] dark:border-[#616161]">
			<ProfileImage userId={comment.author._id} image={comment.author.image} />
			<div className="flex flex-col sm:gap-0 gap-[1px]">
				<div className="flex items-center gap-1">
					<span className="font-medium sm:text-base text-sm">
						{userInfo.nickname}
					</span>
					{comment.author._id === authorId && (
						<span className="text-[9px] bg-[#06b796] rounded-[10px] py-[1px] px-1 text-white">
							작성자
						</span>
					)}
				</div>
				<span className="sm:text-sm text-xs sm:mb-[2px]">{value}</span>
				<div className="flex text-[#616161] dark:text-[#dadada]">
					<span className=" text-[10px]">
						{`${formatDate(date)} ${formatTime(date)}`}
					</span>
					{userId === comment.author._id && (
						<span
							onClick={() => deleteComment(comment._id)}
							className="text-[10px] hover:text-black ml-5 cursor-pointer self-end dark:hover:text-[#fff]"
						>
							삭제
						</span>
					)}
				</div>
			</div>
		</li>
	);
}
