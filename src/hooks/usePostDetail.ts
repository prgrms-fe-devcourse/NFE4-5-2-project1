import { useCallback, useEffect, useState } from "react";
import { getPostById } from "../apis/post";

export const usePostDetail = (id: string, userId: string) => {
	const [postData, setPostData] = useState<PostData | null>(null);
	const [applicants, setApplicants] = useState<CommentData[]>([]);
	const [comments, setComments] = useState<CommentData[]>([]);
	const [members, setMembers] = useState<string[]>([]);
	const [isRecruiting, setIsRecruiting] = useState(false);
	const [isApplying, setIsApplying] = useState(false);

	const getData = useCallback(async () => {
		try {
			const postData: PostData = await getPostById(id!);
			const postInfo: PostDetail = JSON.parse(postData.title);
			const applyList = postData.comments.filter((commentData) => {
				const parsed: CommentType = JSON.parse(commentData.comment);
				return (
					parsed.type === "apply" &&
					postInfo.rejectList.every(
						(applicant) => applicant !== commentData.author._id
					)
				);
			});
			const isMember = postInfo.memberList.includes(userId);
			const isRejected = postInfo.rejectList.includes(userId);
			const isApplying =
				applyList.some((applicant) => applicant.author._id === userId) &&
				!isMember &&
				!isRejected;
			const commentList = postData.comments.filter((commentData) => {
				const parsed: CommentType = JSON.parse(commentData.comment);
				return parsed.type === "comment";
			});

			setPostData(postData);
			setIsApplying(isApplying);
			setMembers(
				postInfo.memberList.filter(
					(member) =>
						applyList.some((apply) => apply.author._id === member) ||
						member === postData.author._id
				)
			);
			setIsRecruiting(postInfo.isRecruiting);
			setApplicants(applyList);
			setComments(commentList);
		} catch (error) {
			console.error(error);
		}
	}, [id, userId]);

	useEffect(() => {
		getData();
	}, [getData]);

	return {
		postData,
		applicants,
		comments,
		members,
		isRecruiting,
		isApplying,
		setApplicants,
		setComments,
		setMembers,
		setIsRecruiting,
		setIsApplying
	};
};
