import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";
import { createLike, deleteLike } from "../../../apis/like";
import { createNoti } from "../../../apis/notification";
import { useAuthStore } from "../../../store/authStore";
import { usePostStore } from "../../../store/postStore";
import Icon from "../../commons/Icon";

export default function Likes() {
	const navigate = useNavigate();
	const userId = useAuthStore((state) => state.userId);
	const postData = usePostStore((state) => state.postData);
	const [likes, setLikes] = useState<{
		number: number;
		likeId: string | undefined;
	}>({
		number: 0,
		likeId: undefined
	});

	const initLikes = useCallback(
		(likesList: LikeData[]) => {
			setLikes({
				number: likesList.length,
				likeId: likesList.find((like) => like.user === userId)?._id
			});
		},
		[setLikes, userId]
	);

	useEffect(() => {
		if (!postData) return;
		const likesList = postData.likes;
		initLikes(likesList);
	}, [postData, initLikes]);

	if (!postData) return;

	const isAuthor = userId === postData.author._id;

	const likeBtnHandler = async () => {
		if (!userId) {
			navigate("/login");
			return;
		}
		if (isAuthor) {
			return;
		}
		if (likes.likeId) {
			const prevLiked = likes.likeId;
			setLikes((prev) => ({
				number: prev.number - 1,
				likeId: undefined
			}));
			try {
				await deleteLike(likes.likeId);
			} catch (error) {
				console.error(error);
				setLikes((prev) => ({
					number: prev.number + 1,
					likeId: prevLiked
				}));
			}
		} else {
			setLikes((prev) => ({
				number: prev.number + 1,
				likeId: "temp"
			}));

			try {
				const myLike: LikeData = await createLike(postData._id);
				setLikes((prev) => ({
					number: prev.number,
					likeId: myLike._id
				}));
				//추가
				await createNoti({
					notificationType: "LIKE",
					notificationTypeId: myLike._id,
					userId: postData.author._id,
					postId: postData._id
				});
				// console.log("좋아요 알림생성:", likeNoti);
				// console.log("알림 받을 대상:", postData.author._id);
				// console.log("현재 사용자:", userId);
			} catch (error) {
				console.error(error);
				setLikes((prev) => ({
					number: prev.number - 1,
					likeId: undefined
				}));
			}
		}
	};

	return (
		<div
			onClick={likeBtnHandler}
			className={twMerge(
				"cursor-pointer flex self-center px-[30px] pt-[10px] pb-[7.5px]  border-[1px] border-[#CDCDCD] rounded-[15px]",
				isAuthor
					? "hover:bg-gray-100 dark:hover:bg-[#333]"
					: "hover:border-[#06b796]",
				likes.likeId &&
					"bg-[#06b796] text-white border-[#06b796] hover:bg-[#038383] hover:border-[#038383]"
			)}
		>
			<Icon
				position={likes.likeId ? "70.222% 35.359%" : "59.556% 35.359%"}
				size="22px"
			/>
			<span className="text-lg leading-4 ml-2">{likes.number}</span>
		</div>
	);
}
