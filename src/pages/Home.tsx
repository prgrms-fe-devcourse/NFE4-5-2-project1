import { useState } from "react";
import { Link, Outlet } from "react-router";
import AddPostButt from "../components/features/home/AddPostButt";
import ChannelList from "../components/features/home/ChannelList";
import FilterAndSort from "../components/features/home/FilterAndSort";
import MainVisual from "../components/features/home/MainVisual";
import PostSearch from "../components/features/home/PostSearch";

export default function Home() {
	const [sort, setSort] = useState("최신순");
	const [selectFilter, setSelectFilter] = useState<string[]>([]);
	const [isChecked, setIsChecked] = useState(false);
	const [search, setSearch] = useState("");

	return (
		<>
			<div className="w-full flex justify-center pb-[95px] px-4 sm:px-0">
				{/* 본문 */}
				<div className="flex flex-col items-center w-full sm:max-w-[1100px] min-h-screen sm:px-0">
					{/* 슬라이드 이미지 */}
					<div className="flex items-center sm:mt-[20px] mt-[13px] w-full sm:pb-[46px] pb-0 min-w-0">
						<MainVisual />
					</div>
					{/* 배너+검색 */}
					<div className="w-full flex justify-between mt-[20px] gap-4">
						{/* 배너 */}
						<ChannelList />
						{/* 동행글 검색창*/}
						<div className="hidden sm:block">
							<PostSearch search={search} setSearch={setSearch} />
						</div>
					</div>
					{/* 필터,정렬 */}
					<FilterAndSort
						sort={sort}
						setSort={setSort}
						selectFilter={selectFilter}
						setSelectFilter={setSelectFilter}
						isChecked={isChecked}
						setIsChecked={setIsChecked}
					/>
					{/* 게시글들 */}
					<div className="w-full flex items-center">
						<Outlet context={{ sort, selectFilter, isChecked, search }} />
						<Link to={"/postCreate"}>
							<AddPostButt />
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
