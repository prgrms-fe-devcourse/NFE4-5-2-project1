import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useClickAway } from "react-use";
import { twMerge } from "tailwind-merge";
import { deletePost } from "../../../apis/post";
import useConfirm from "../../../hooks/useConfirm";
import { usePostStore } from "../../../store/postStore";
import { useThemeStore } from "../../../store/themeStore";
import { getDiffInDays } from "../../../utils/date";
import Confirm from "../../commons/Confirm";
import Icon from "../../commons/Icon";
import Modal from "../../commons/Modal";
import ModalItem from "../../commons/ModalItem";
import { showToast } from "../../commons/Toast";

export default function PostTitle({
	isRecruitChannel,
	isRecruiting,
	title,
	isAuthor
}: {
	isRecruitChannel: boolean;
	isRecruiting: boolean | undefined;
	title: string | undefined;
	isAuthor: boolean;
}) {
	const navigate = useNavigate();
	const [modalOpen, setModalOpen] = useState(false);
	const modalRef = useRef<HTMLDivElement | null>(null);
	const { confirmOpen, toggleConfirm } = useConfirm();
	const { isDark } = useThemeStore();
	const { postData, postInfo } = usePostStore();
	const toggleRecruit = usePostStore((state) => state.toggleRecruit);

	useClickAway(modalRef, () => {
		setModalOpen(false);
	});

	if (!postData || !postInfo) return;

	const isEnded = getDiffInDays(new Date(), postInfo.dateRange[0]) < 0;

	const modifyPostHandler = () => {
		if (isEnded) {
			setModalOpen(false);
			showToast({
				type: "warning",
				message: "이미 완료된 여정은 수정이 불가능합니다"
			});
			return;
		}
		navigate(`/post/edit/${postData._id}`, {
			state: {
				postData
			}
		});
	};

	const deletePostHandler = async () => {
		toggleConfirm();
		try {
			navigate("/");
			await deletePost(postData._id);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="flex justify-between items-center sm:relative sm:z-1 z-20 w-full fixed left-0 dark:bg-[#1B1D22] bg-[#fff] p-4 sm:mb-2 sm:border-0 border-b border-[#f3f3f3] dark:border-[#4a4b4d] h-[70px]">
			<Icon
				position={isDark ? "50.218% 27.747%" : "39.301% 27.747%"}
				size="16px"
				onClick={() => navigate(-1)}
				className="cursor-pointer"
			/>
			<h2 className="items-center inline-block">
				<span
					onClick={() => {
						if (!isAuthor || !isRecruitChannel || isEnded) return;
						showToast({
							type: "warning",
							message: `${isRecruiting ? "모집완료" : "모집중으"}로 변경되었습니다`
						});
						toggleRecruit();
					}}
					className={twMerge(
						"mr-4 sm:text-xl text-sm px-3 py-[5.5px] rounded-lg border border-transparent sm:hover:border-[#06b796] sm:hover:text-[#038383]",
						"active:border-[#06b796] active:text-[#038383]",
						isRecruitChannel
							? "cursor-pointer text-[#06B796] bg-[#F3F4F6]"
							: "cursor-default bg-[#06b796] text-white",
						"dark:bg-[#1B1D22] dark:border-1 dark:border-[#06b796]"
					)}
				>
					{isRecruitChannel
						? isEnded
							? "여정완료"
							: isRecruiting
								? "모집중"
								: "모집완료"
						: "후기"}
				</span>
				<span className="sm:text-[28px] text-lg font-medium">{title}</span>
			</h2>
			{isAuthor ? (
				<Icon
					position={isDark ? "61.778% 28.342%" : "36.444% 35.561%"}
					size="20px"
					className="cursor-pointer"
					onClick={() => {
						if (!modalOpen) setModalOpen(true);
					}}
				/>
			) : (
				<div />
			)}
			{modalOpen && (
				<Modal className="right-2 z-100" ref={modalRef}>
					<ModalItem noIcon clickHandler={modifyPostHandler}>
						<span className="inline-block w-full text-center">수정</span>
					</ModalItem>
					<ModalItem
						noIcon
						clickHandler={() => {
							setModalOpen(false);
							toggleConfirm();
						}}
					>
						<span className="inline-block w-full text-center">삭제</span>
					</ModalItem>
				</Modal>
			)}
			{confirmOpen && (
				<Confirm
					confirmHandler={deletePostHandler}
					cancelHandler={toggleConfirm}
					title="게시글을 삭제하시겠습니까?"
					description="삭제된 게시글은 복구할 수 없습니다."
					confirmBtn="삭제"
				/>
			)}
		</div>
	);
}
