import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getChannels } from "../../../apis/channel";

//채널 목록
export default function ChannelList() {
	const [channels, setChannels] = useState<ChannelData[]>([]); //채널 목록
	const navigate = useNavigate();
	const { channelName } = useParams();
	const [selected, setSelected] = useState(channelName || "");
	const handleChannelClick = (channelName: string) => {
		navigate(`/channel/${channelName}`); //
	};

	const getDisplayName = (name: string) => {
		if (name === "crews") return "⛵ 크루모집";
		if (name === "review") return "📜 항해일지";
		if (name === "전체글") return "🌊 전체 항해 보기";
		if (name === "긴급 모집") return "🚨 지금 탑승 가능!";
		return name;
	};
	const mobDisplayName = (name: string) => {
		if (name === "crews") return "⛵ 크루모집";
		if (name === "review") return "📜 항해일지";
		if (name === "전체글") return "🌊 전체보기";
		if (name === "긴급 모집") return "🚨 긴급탑승!";
		return name;
	};
	useEffect(() => {
		const fetchChannels = async () => {
			try {
				const data = await getChannels();
				const extraChannels: ChannelData[] = [
					{
						posts: [],
						_id: "all",
						name: "전체글",
						description: "crews와 review 채널의 글들",
						createdAt: "",
						updatedAt: ""
					},
					...data,
					{
						posts: [],
						_id: "urgent",
						name: "긴급 모집",
						description: "3일 남은 게시글들",
						createdAt: "",
						updatedAt: ""
					}
				];
				setChannels(extraChannels);
			} catch (error) {
				console.error("채널 불러오기 실패", error);
			}
		};
		fetchChannels();
	}, []); //한번만 채널목록 불러오기
	useEffect(() => {
		if (channelName) setSelected(channelName); //
	}, [channelName]);

	return (
		<div className="sm:w-auto w-full flex gap-[6px] flex-wrap sm:bg-[#F3F4F6] rounded-[12px] dark:bg-[#333]">
			{channels.map((channel) => (
				<button
					key={channel._id}
					onClick={() => handleChannelClick(channel.name)}
					className={` flex-1 sm:flex-none text-center sm:px-4 px-[1px] py-2 sm:rounded-[12px] sm:text-[20px] text-[16px] cursor-pointer ${
						selected === channel.name
							? "sm:bg-[#06B796] sm:text-white text-[#06B796] border-b border-b-[#06B796]"
							: "text-[#333333] dark:text-[#dadada]"
					}`}
				>
					<span className="sm:hidden">{mobDisplayName(channel.name)}</span>
					<span className="hidden sm:inline">
						{getDisplayName(channel.name)}
					</span>
				</button>
			))}
		</div>
	);
}
