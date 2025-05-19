import { updatePost } from "../../../apis/post";
import { usePostStore } from "../../../store/postStore";
import ProfileImage from "../../commons/ProfileImage";

export default function ApplyMembers({
	postInfo,
	postData
}: {
	postInfo: PostDetail;
	postData: PostData;
}) {
	const applicants = usePostStore((state) => state.applicants);
	const members = usePostStore((state) => state.members);
	const addMember = usePostStore((state) => state.addMembers);
	const deleteApplicant = usePostStore((state) => state.deleteApplicant);

	const applyMembers = applicants.filter((applicant) =>
		members.every((member) => member !== applicant.author._id)
	);

	const approveHandler = async (applicant: UserData) => {
		try {
			const newData: PostDetail = { ...postInfo };
			newData.memberList.push(applicant._id);
			if (newData.memberList.length > postInfo.memberLimit) {
				newData.memberLimit = newData.memberList.length;
			}
			const formData = new FormData();
			formData.append("title", JSON.stringify(newData));
			formData.append("channelId", postData.channel._id);
			formData.append("postId", postData._id);
			await updatePost(formData);
			deleteApplicant(applicant._id);
			addMember(applicant._id);
		} catch (error) {
			console.error(error);
		}
	};

	const rejectHandler = async (userId: string) => {
		try {
			const newData: PostDetail = { ...postInfo };
			newData.rejectList.push(userId);
			const formData = new FormData();
			formData.append("title", JSON.stringify(newData));
			formData.append("channelId", postData.channel._id);
			formData.append("postId", postData._id);
			await updatePost(formData);
			deleteApplicant(userId);
		} catch (error) {
			console.error(error);
		}
	};
	return (
		<div className="flex flex-col gap-4 mb-26">
			{applyMembers.length !== 0 && (
				<div>
					<span className="post-sub-title inline">승인 대기 멤버</span>
					<span className="sub_title_number">{applyMembers.length}</span>
				</div>
			)}

			{applyMembers.map((applicant) => {
				const userInfo: Profile = JSON.parse(applicant.author.fullName);
				return (
					<div className="relative text-sm items-center" key={applicant._id}>
						<div className="flex gap-2 mr-[50px]">
							<ProfileImage
								userId={applicant.author._id}
								image={applicant.author.image}
							/>
							<div className="flex flex-col justify-center">
								<span>{userInfo.nickname}</span>
								<span className="text-[#616161]">{userInfo.name}</span>
							</div>
						</div>
						<div className="absolute sm:left-50 right-0 top-3">
							<button
								onClick={() => approveHandler(applicant.author)}
								className="w-18 h-10 handleApply bg-[#06b796] sm:hover:bg-[#038383] active:bg-[#038383] mr-2"
							>
								승인
							</button>
							<button
								onClick={() => rejectHandler(applicant.author._id)}
								className="w-18 h-10 handleApply bg-[#FD346E] sm:hover:bg-[#E11D48] active:bg-[#E11D48]"
							>
								거절
							</button>
						</div>
					</div>
				);
			})}
		</div>
	);
}
