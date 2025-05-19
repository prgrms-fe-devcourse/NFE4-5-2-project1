import { useEffect, useState } from "react";
import { useParams } from "react-router";
import LoadingSpinner from "../assets/images/SailLoadingSpinner.gif";
import Button from "../components/commons/Button";
import Confirm from "../components/commons/Confirm";
import ApplyMembers from "../components/features/postDetail/ApplyMembers";
import CommentsList from "../components/features/postDetail/CommentsList";
import Likes from "../components/features/postDetail/Likes";
import MemberList from "../components/features/postDetail/MemberList";
import OpenTalkLink from "../components/features/postDetail/OpenTalkLink";
import PostHeader from "../components/features/postDetail/PostHeader";
import { CHANNELS } from "../constants/posts";
import useConfirm from "../hooks/useConfirm";
import { useAuthStore } from "../store/authStore";
import { usePostStore } from "../store/postStore";
import { checkAgeMatch } from "../utils/checkCondition";
import { getDiffInDays } from "../utils/date";

export default function PostDetail() {
	const { id } = useParams();
	const userId = useAuthStore((state) => state.userId)!;
	const userInfo = useAuthStore((state) => state.userInfo)!;
	const isLoading = usePostStore((state) => state.isLoading);
	const applicants = usePostStore((state) => state.applicants);
	const { confirmOpen, toggleConfirm } = useConfirm();
	const [isReady, setIsReady] = useState(false);

	const {
		postData,
		postInfo,
		isRecruiting,
		isApplying,
		members,
		getData,
		submitApplication,
		cancelApplication,
		cancelAccompany
	} = usePostStore();

	useEffect(() => {
		if (!id) return;
		const fetchData = async () => {
			try {
				await getData(id, userId);
				setIsReady(true);
			} catch (error) {
				console.error(error);
			}
		};
		fetchData();
	}, [id, userId, getData]);

	if (!postData || !postInfo || isLoading || !isReady)
		return (
			<div className="flex h-screen justify-center items-center">
				<img src={LoadingSpinner} alt="로딩 중" />
			</div>
		);

	const authorInfo: Profile = JSON.parse(postData.author.fullName);

	const isAuthor = userId === postData.author._id;
	const isMember = postInfo.memberList.includes(userId);
	const isRejected = postInfo.rejectList.includes(userId);
	const isRecruitChannel = postData.channel._id === CHANNELS.RECRUITMENT;
	const isCanceledAppication =
		applicants.every((applicant) => applicant.author._id !== userId) &&
		!members.includes(userId);
	const isMatchedCondition = userInfo
		? checkAgeMatch(postInfo.recruitCondition, {
				gender: userInfo.gender + "성",
				age: userInfo.age
			})
		: false;
	const isEnded = getDiffInDays(new Date(), postInfo.dateRange[0]) < 0;
	const hasApplicants = applicants.some(
		(applicant) => !members.includes(applicant.author._id)
	);

	const fiveDaysLeft = getDiffInDays(new Date(), postInfo.dateRange[0]) < 5;

	return (
		<main className="flex flex-col justify-center items-center sm:mt-[49px] mb-20">
			<div className="flex flex-col sm:gap-[30px] gap-12 sm:w-275 w-full relative px-4">
				<PostHeader
					postData={postData}
					postInfo={postInfo}
					authorInfo={authorInfo}
					isRecruitChannel={isRecruitChannel}
					isRecruiting={isRecruiting}
				/>
				{isRecruitChannel && (
					<>
						<MemberList />
						<div className="sm:text-base text-sm">
							<span className="post-sub-title">동행 조건 사항</span>
							<div>
								<span className="text-[#616161] mr-[10px] dark:text-[#dadada]">
									성별
								</span>
								<span>{postInfo.recruitCondition.gender}</span>
							</div>
							<div>
								<span className="text-[#616161] mr-[10px] dark:text-[#dadada]">
									나이
								</span>
								{postInfo.recruitCondition.ageRange.join(", ")}
							</div>
						</div>
					</>
				)}
				{isAuthor && isRecruiting && hasApplicants && (
					<ApplyMembers postInfo={postInfo} postData={postData} />
				)}
				{isMember && !isCanceledAppication && <OpenTalkLink />}
				<Likes />
				<CommentsList authorId={postData.author._id} />
				{!isAuthor && userId && isRecruitChannel && !isMember && !isEnded && (
					<Button
						reverse={isApplying}
						onClick={() =>
							isApplying ? cancelApplication(userId) : submitApplication()
						}
						className="w-full disabled:cursor-auto disabled:bg-[#808080]"
						disabled={
							!postInfo.isRecruiting || isRejected || !isMatchedCondition
						}
					>
						{postInfo.isRecruiting
							? isRejected
								? "거절 되었습니다"
								: isApplying
									? "동행 신청 취소"
									: isMatchedCondition
										? "동행 신청하기"
										: "동행 조건 불일치"
							: "모집이 마감되었습니다"}
					</Button>
				)}
				{!isAuthor && isMember && !isCanceledAppication && !isEnded && (
					<Button
						onClick={toggleConfirm}
						disabled={fiveDaysLeft}
						reverse={!fiveDaysLeft}
						className="w-full disabled:cursor-auto disabled:bg-[#808080] sm:text-xl text-lg"
					>
						{fiveDaysLeft ? "철회 불가능" : "동행 철회"}
					</Button>
				)}
				{confirmOpen && !isEnded && (
					<Confirm
						confirmHandler={() => {
							toggleConfirm();
							cancelAccompany(userId);
						}}
						cancelHandler={toggleConfirm}
						title="동행을 철회하시겠습니까?"
						description="철회 시, 다시 신청이 불가능합니다."
						confirmBtn="동행 철회"
					/>
				)}
			</div>
		</main>
	);
}
