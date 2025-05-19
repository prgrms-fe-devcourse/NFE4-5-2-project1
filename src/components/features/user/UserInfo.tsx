import ProfileImage from "../../commons/ProfileImage";
export default function UserInfo({
	isRecruitChannel,
	image,
	authorInfo,
	userId
}: {
	isRecruitChannel: boolean;
	image: string;
	authorInfo: Profile;
	userId: string;
}) {
	const { nickname, age, gender, tagList } = authorInfo;
	return (
		<div>
			<span className="post-sub-title">{isRecruitChannel && "캡틴"}</span>
			<div className="flex gap-[10px]">
				<ProfileImage userId={userId} image={image} />
				<div>
					<span className="block font-medium mb-[5px] sm:text-base text-sm">
						{nickname}
					</span>
					<div className="sm:text-sm text-xs flex gap-2 text-[#616161] dark:text-[#dadada]">
						<span>{Math.floor(age / 10) * 10}대</span>
						<span>{gender}</span>
						{tagList &&
							tagList.map((tag) => (
								<span key={tag} className="text-[#06B796]">
									#{tag}
								</span>
							))}
					</div>
				</div>
			</div>
		</div>
	);
}
