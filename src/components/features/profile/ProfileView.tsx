interface ProfileViewProps {
	profile: Profile;
	image: string;
}

export default function ProfileView({ profile, image }: ProfileViewProps) {
	return (
		<div className="flex flex-col items-center justify-center sm:w-[1100px]">
			<div className="h-[auto] text-center sm:space-y-[14px] space-y-[10px]">
				<img
					src={image}
					alt="프로필 이미지"
					className="select-none w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] rounded-full mx-auto mb-[20px] object-cover"
				/>
				{/* 유저 프로필 정보 */}
				<p className="sm:text-[18px] sm:font-medium text-[16px] font-bold">
					{profile.name}({profile.nickname})님
				</p>
				<div className="flex justify-center sm:gap-x-[3px] gap-x-[4px]">
					<p className="text-[16px]">{profile.age}</p>
					<p className="text-[16px]">{profile.gender}</p>
				</div>
				{/* 태그 뱃지*/}
				<div className="flex flex-wrap justify-center gap-[14px] m-0 px-[50px]">
					{profile.tagList?.map((tag, index) => (
						<span
							key={index}
							className="inline-flex items-center justify-center w-[auto] sm:h-[35px] h-[27px] bg-[#F3F4F6] text-[#06b796] text-[16px] px-[12px] py-[4px] rounded-[8px] dark:bg-[#1B1D22] dark:border dark:border-[#06b796]"
						>
							{tag}
						</span>
					))}
				</div>
			</div>
		</div>
	);
}
