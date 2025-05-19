import { Link } from "react-router";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getPostsByAuthor } from "../../../apis/post";
import { formatDateRange, getDiffInDays } from "../../../utils/date";
import Icon from "../../../components/commons/Icon";
import postThumbnail from "../../../assets/images/primaryImage.png";
import { useThemeStore } from "../../../store/themeStore";

const CrewTab = ({
	authorId,
	isMyPage
}: {
	authorId: string;
	isMyPage: boolean;
}) => {
	const [posts, setPosts] = useState<ProfilePost[]>([]);
	const crewPosts = posts.filter((post) => post.channel.name === "crews");
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await getPostsByAuthor(authorId);
				setPosts(result);
			} catch (error) {
				console.error("포스트 불러오기 실패:", error);
			}
		};
		fetchData();
	}, [authorId]);
	// darkmode
	const isDark = useThemeStore((state) => state.isDark);
	const locationIconPosition = isDark ? "56.034% 20.708%" : "6.466% 20.708%";
	const memberIconPosition = isDark ? "66.079% 20.765%" : "15.419% 20.765%";
	const calendarIconPosition = isDark ? "75.983% 20.604%" : "25.764% 20.604%";
	const likesIconPosition = isDark ? "83.5% 96.15%" : "74.3% 96.15%";

	return (
		<div>
			<div className="sm:flex my-[30px] text-[18px] font-medium gap-x-[8px] hidden">
				<h1>크루모집</h1>
				<p className="text-[#06B796]">{crewPosts.length}</p>
			</div>
			{!isMyPage && crewPosts.length === 0 ? (
				<div className="w-[418px] flex sm:w-[1100px] h-auto justify-center py-[120px] text-[#808080] text-[16px] sm:text-[18px] font-medium">
					<p>아직 작성한 게시글이 없습니다.</p>
			  	</div>
			) : (
				<div className="w-[418] sm:w-auto grid grid-cols-2 sm:grid-cols-3 mt-[26px] sm:mt-0 gap-x-[18px] gap-y-[18px] sm:gap-x-[58px] sm:gap-y-[30px]">
					{isMyPage && (
						<Link to={"/postCreate"}>
							<div className="group flex flex-col items-center justify-center sm:w-[328px] sm:h-[382px] w-[200px] h-[252px] border border-[#06B796] rounded-[15px] shadow-[0px_2px_4px_rgba(0,0,0,0.16)] hover:shadow-[0px_4px_10px_rgba(0,0,0,0.3)] hover:border-[#038383] transition duration-300">
								<div className="w-[50px] h-[50px] sm:w-[80px] sm:h-[80px] rounded-full flex items-center justify-center bg-[#06b796] group-hover:bg-[#038383] transition duration-300">
									<Icon position="-12px -153px" size="35px" />
								</div>
								<p className="font-medium sm:font-bold text-[14px] sm:text-[16px] text-[#06B796] mt-[14px] sm:mt-[34px] group-hover:text-[#038383] transition duration-300">
									함께할 크루를 찾아보세요.
								</p>
							</div>
						</Link>
					)}
					{posts
						.filter((post) => post.channel.name === "crews")
						.map((post) => {
							const parsedTitle = JSON.parse(post.title);
							return (
								<div
									key={post._id}
									className="group sm:w-[328px] sm:h-[382px] w-[200px] h-[252px] overflow-hidden rounded-[10px] bg-white cursor-pointer shadow-[0px_2px_4px_rgba(0,0,0,0.16)] hover:shadow-[0px_4px_10px_rgba(0,0,0,0.3)] transition duration-300 dark:bg-transparent dark:border dark:border-[#616161] dark:hover:shadow-[0px_4px_10px_rgba(100,100,100,0.3)]"
									onClick={() => navigate(`/post/detail/${post._id}`)}
								>
									{/* 상단 영역 */}
									<div className="relative block">
										{getDiffInDays(new Date(), parsedTitle.dateRange[0]) < 0 ? (
											<p className="z-10 absolute select-none top-0 right-0 flex items-center justify-center w-[50px] h-[20px] sm:w-[60px] sm:h-[26px] px-[2px] sm:px-[4px] py-[3px] m-[8px] rounded-[8px] text-white text-[12px] sm:text-[14px] bg-[#808080]">
												여정완료
											</p>
										) : parsedTitle.isRecruiting === true ? (
											<p className="z-10 absolute select-none top-0 right-0 flex items-center justify-center w-[50px] h-[20px] sm:w-[60px] sm:h-[26px] px-[2px] sm:px-[4px] py-[3px] m-[8px] rounded-[8px] text-white text-[12px] sm:text-[14px] bg-[#FD346E]">
												모집중
											</p>
										) : (
											<p className="z-10 absolute select-none top-0 right-0 flex items-center justify-center w-[50px] h-[20px] sm:w-[60px] sm:h-[26px] px-[2px] sm:px-[4px] py-[3px] m-[8px] rounded-[8px] text-white text-[12px] sm:text-[14px] bg-[#1C274C]">
												모집완료
											</p>
										)}
										<img
											src={parsedTitle.images[0] ? parsedTitle.images[0] : postThumbnail}
											alt="Post Thumbnail"
											className="z-0 rounded-t-[10px] h-[100px] sm:h-[180px] w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
										/>
									</div>
									{/* 하단 영역 */}
									<div className="p-[10px] sm:p-[16px]">
										{/* 하단 영역 -1 */}
										<div className="flex flex-col gap-y-[5px] sm:gap-y-[8px]">
											<h1 className="font-bold text-[14px] sm:text-[16px] line-clamp-1">
												{parsedTitle.title}
											</h1>
											<h2 className="h-[38px] text-[12px] sm:text-[14px] line-clamp-2">
												{parsedTitle.description}
											</h2>
										</div>

										{/* 하단 영역 -2 */}
										<div className="flex flex-col mt-[8px] sm:mt-[5px] sm:my-2">
											{/* 비행기 */}
											<div className="flex items-center gap-1.5">
												<Icon position={locationIconPosition} size="18px" />
												<h3 className="text-[12px] sm:text-[14px]">{parsedTitle.location}</h3>
											</div>

											{/* 인원 */}
											<div className="flex items-center gap-1.5">
												<Icon position={memberIconPosition} size="18px" />
												<h3 className="text-[12px] sm:text-[14px]">
													{parsedTitle.memberList.length} /{" "}
													{parsedTitle.memberLimit}
												</h3>
											</div>

											{/* 달력 */}
											<div className="flex items-center gap-1.5">
												<Icon position={calendarIconPosition} size="18px" />
												<h3 className="text-[12px] sm:text-[14px]">
													{formatDateRange(parsedTitle.dateRange)}
												</h3>
											</div>
										</div>


										<div className="hidden sm:flex justify-between mt-[2px] text-[14px]">
											{/* 나이,성별 */}
											<div className="flex gap-4">
												{parsedTitle.recruitCondition.gender &&
													`#${parsedTitle.recruitCondition.gender}`}
												{parsedTitle.recruitCondition.ageRange &&
													parsedTitle.recruitCondition.ageRange.map((age: string) => (
														<span key={age} className="min-w-[35px] h-[19px]">
															#{age}
														</span>
													))}					
											</div>
											{/* 좋아요 */}
											<div className="hidden sm:flex items-center gap-[5px]">
												<h3 className="text-[#808080] dark:text-[#cdcdcd]">{post.likes.length}</h3>
												<Icon position={likesIconPosition} size="18px" />
											</div>	
										</div>
									</div>
								</div>
							);
						})}
				</div>
			)}
		</div>
	);
};

export default CrewTab;
