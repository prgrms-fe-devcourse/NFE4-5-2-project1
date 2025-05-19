import { create } from "zustand";
import { createComment, deleteComment } from "../apis/comment";
import { createNoti } from "../apis/notification";
import { getPostById, updatePost } from "../apis/post";
import { showToast } from "../components/commons/Toast";

type PostStore = {
	postData: PostData | null;
	postInfo: PostDetail | null;
	applicants: CommentData[];
	comments: CommentData[];
	members: string[];
	isRecruiting: boolean;
	isApplying: boolean;
	isLoading: boolean;

	getData: (id: string, userId: string) => Promise<void>;
	toggleRecruit: () => void;
	addMembers: (newMember: string) => void;
	submitApplication: () => void;
	cancelApplication: (userId: string) => void;
	addComment: (
		e: React.FormEvent<HTMLFormElement>,
		value: string,
		userId: string
	) => void;
	deleteComment: (commentId: string) => void;
	deleteApplicant: (userId: string) => void;
	cancelAccompany: (userId: string) => void;
};

export const usePostStore = create<PostStore>((set, get) => ({
	postData: null,
	postInfo: null,
	applicants: [],
	comments: [],
	members: [],
	isRecruiting: false,
	isApplying: false,
	isLoading: false,

	getData: async (id: string, userId: string) => {
		try {
			set({ isLoading: true });
			const postData: PostData = await getPostById(id!);
			const postInfo: PostDetail = JSON.parse(postData.title);

			const applicants = postData.comments.filter((commentData) => {
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
				applicants.some((applicant) => applicant.author._id === userId) &&
				!isMember &&
				!isRejected;
			const comments = postData.comments.filter((commentData) => {
				const parsed: CommentType = JSON.parse(commentData.comment);
				return parsed.type === "comment";
			});

			set({
				postData,
				postInfo,
				applicants,
				comments,
				isApplying,
				isRecruiting: postInfo.isRecruiting,
				members: postInfo.memberList.filter(
					(member) =>
						applicants.some((apply) => apply.author._id === member) ||
						member === postData.author._id
				),
				isLoading: false
			});
		} catch (error) {
			console.error(error);
		}
	},

	toggleRecruit: async () => {
		try {
			const { postData, postInfo, isRecruiting } = get();
			if (!postData || !postInfo) return;

			const newData: PostDetail = { ...postInfo };
			newData.isRecruiting = !isRecruiting;
			set({ isRecruiting: newData.isRecruiting });

			const formData = new FormData();
			formData.append("title", JSON.stringify(newData));
			formData.append("channelId", postData.channel._id);
			formData.append("postId", postData._id);
			await updatePost(formData);
		} catch (error) {
			console.error(error);
		}
	},

	addMembers: (newMember) =>
		set((state) => ({ members: [...state.members, newMember] })),

	submitApplication: async () => {
		const { postData } = get();
		if (!postData) return;
		set({ isApplying: true });
		const data: CommentType = { type: "apply" };
		const newApplicant = await createComment(
			postData?._id,
			JSON.stringify(data)
		);
		set((state) => ({ applicants: [...state.applicants, newApplicant] }));

		const post: PostData = await getPostById(newApplicant.post);
		await createNoti({
			notificationType: "APPLY",
			notificationTypeId: newApplicant._id,
			userId: post.author._id,
			postId: newApplicant.post
		});
	},

	cancelApplication: async (userId) => {
		const { applicants } = get();
		set({
			applicants: applicants.filter(
				(applicant) => applicant.author._id !== userId
			),
			isApplying: false
		});
		const myApply = applicants.filter(
			(applicant) => applicant.author._id === userId
		);
		myApply.forEach(async (apply) => {
			await deleteComment(apply._id);
		});
	},

	deleteComment: async (commentId) => {
		try {
			set((state) => ({
				comments: state.comments.filter((comment) => comment._id !== commentId)
			}));
			await deleteComment(commentId);
		} catch (error) {
			console.error(error);
		}
	},

	deleteApplicant: (userId) => {
		set((state) => ({
			applicants: state.applicants.filter(
				(applicant) => applicant.author._id !== userId
			)
		}));
	},

	cancelAccompany: async (userId) => {
		const { postData } = get();
		if (!postData) return;
		try {
			set((state) => ({
				members: state.members.filter((member) => member !== userId),
				applicants: state.applicants.filter(
					(applicant) => applicant.author._id !== userId
				)
			}));
			const myApply = postData.comments.find((commentData) => {
				const parsed: CommentType = JSON.parse(commentData.comment);
				return parsed.type === "apply";
			});
			if (myApply) await deleteComment(myApply._id);
		} catch (error) {
			console.error(error);
		}
	},

	addComment: async (e, value, userId) => {
		e.preventDefault();
		const { postData } = get();
		if (!postData) return;

		if (value.trim().length === 0) {
			showToast({ type: "error", message: "댓글을 입력해주세요" });
			return;
		}
		try {
			const data: CommentType = { type: "comment", value };
			const newComment: CommentData = await createComment(
				postData?._id,
				JSON.stringify(data)
			);
			set((state) => ({ comments: [...state.comments, newComment] }));
			if (userId === postData.author._id) return;
			await createNoti({
				notificationType: "COMMENT",
				notificationTypeId: newComment._id,
				userId: postData.author._id,
				postId: newComment.post
			});
		} catch (error) {
			console.error(error);
		}
	}
}));
