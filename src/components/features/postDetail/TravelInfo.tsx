import parse from "html-react-parser";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { twMerge } from "tailwind-merge";
import { useThemeStore } from "../../../store/themeStore";
import { formatDate, getDiffInDays } from "../../../utils/date";
import Icon from "../../commons/Icon";

export default function TravelInfo({
	isRecruitChannel,
	postInfo
}: {
	isRecruitChannel: boolean;
	postInfo: PostDetail;
}) {
	const converter = new QuillDeltaToHtmlConverter(postInfo.contents.ops, {});
	const html = converter.convert();
	const days = getDiffInDays(postInfo.dateRange[0], postInfo.dateRange[1]);
	const { isDark } = useThemeStore();

	return (
		<div className="sm:mb-[30px] mb-12 mt-5">
			<div className="sm:mb-[30px] mb-12">
				<span className="post-sub-title">
					여행 {isRecruitChannel ? "소개" : "후기"}
				</span>
				<div className="contents-wrapper">{parse(html)}</div>
			</div>
			<div>
				<span className="post-sub-title">여행 일정</span>
				<div
					className={twMerge(
						"flex flex-col sm:gap-4 gap-2 py-5 px-4 bg-[#F9F9F9] rounded-[15px] text-[#616161]",
						"sm:text-base text-sm dark:bg-[#333333] dark:text-[#dadada]"
					)}
				>
					<span className="flex items-center gap-[10px]">
						<Icon
							position={isDark ? "75.983% 20.604%" : "35.808% 20.604%"}
							size="16px"
						/>
						{postInfo.dateRange
							.map((date) => formatDate(new Date(date)))
							.join(" - ")}
						<span>({days}일)</span>
					</span>
					<span className="flex items-center gap-[10px]">
						<Icon
							position={isDark ? "93.133% 20.604%" : "45.923% 20.604%"}
							size="16px"
						/>
						<span className="relative bottom-[2px]">{postInfo.location}</span>
					</span>
					{isRecruitChannel && (
						<span className="flex items-center gap-[10px]">
							<Icon
								position={isDark ? " 66.079% 20.765%" : "15.419% 20.765%"}
								size="18px"
							/>
							<span className="relative bottom-[2px]">
								{postInfo.memberLimit} 명
							</span>
						</span>
					)}
				</div>
			</div>
		</div>
	);
}
