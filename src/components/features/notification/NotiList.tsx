import { useEffect, useState } from "react";
import { readNoti } from "../../../apis/notification";
import { useNoti } from "../../../context/useNoti";
import { useThemeStore } from "../../../store/themeStore";
import Icon from "../../commons/Icon";
import NotiMessage from "./NotiMessage";
import NotiPosts from "./NotiPosts";
import NotiRequest from "./NotiRequest";
import NotiWhole from "./NotiWhole";

export default function NotiList({
	notiOpen,
	setNotiOpen
}: {
	notiOpen: boolean;
	setNotiOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const bannerArr = ["전체", "게시글", "메시지", "동행요청"];
	const [notiContents, setNotiContents] = useState("전체");
	const { notiInfo, setNotiInfo } = useNoti();

	useEffect(() => {
		setNotiInfo((notice) => {
			let updated = false;

			const updatedNotice = notice.map((n) => {
				const isEmpty =
					("like" in n && !n.like) ||
					("comment" in n && !n.comment) ||
					("message" in n && !n.message);
				if (isEmpty && !n.seen) {
					updated = true;
					return { ...n, seen: true };
				}
				return n;
			});
			return updated ? updatedNotice : notice;
		});
	}, [setNotiInfo]);
	const handleClose = () => {
		setNotiOpen(false);
	};
	const handleRead = async () => {
		try {
			await readNoti();
			setNotiInfo((notice) => notice.map((n) => ({ ...n, seen: true })));
		} catch (e) {
			console.error("모두 읽음처리 실패", e);
		}
	};
	const filtered = () => {
		switch (notiContents) {
			case "게시글":
				return notiInfo.filter(
					(notice) => "like" in notice || "comment" in notice
				);
			case "메시지":
				return notiInfo.filter((notice) => "message" in notice);
			case "동행요청":
				return notiInfo.filter(
					(notice) =>
						!("comment" in notice) &&
						!("like" in notice) &&
						!("message" in notice)
				);
			default:
				return notiInfo;
		}
	};

	const filteredBannerNoti = () => {
		const filterNoti = filtered();
		switch (notiContents) {
			case "전체":
				return <NotiWhole noti={filterNoti} onClose={handleClose} />;
			case "게시글":
				return <NotiPosts noti={filterNoti} onClose={handleClose} />;
			case "메시지":
				return <NotiMessage noti={filterNoti} onClose={handleClose} />;
			case "동행요청":
				return <NotiRequest noti={filterNoti} onClose={handleClose} />;
			default:
				return null;
		}
	};

	// darkmode
	const isDark = useThemeStore((state) => state.isDark);
	const closeIconPosition = isDark ? "72.727% 27.869%" : "28.571% 27.869%";
	return (
		<>
			<div className="sm:w-[560px] w-full sm:min-h-[664px] sm:rounded-[10px] bg-[#fff] border border-[#D9D9D9] shadow-[0px_2px_8px_rgba(0,0,0,0.20)] dark:bg-[#313131] dark:shadow-[0px_2px_8px_rgba(195,195,195,0.3)] dark:border-[#1f1f1f]">
				{/* 상단-알림,x버튼*/}
				<div className="sm:w-[500px] flex items-center justify-between mt-6 mx-6">
					<div className="sm:text-[24px] text-xl  font-bold">알림</div>
					{notiOpen && (
						<button
							onClick={() => setNotiOpen(!notiOpen)}
							className="cursor-pointer"
						>
							<Icon position={closeIconPosition} size="22px" />
						</button>
					)}
				</div>

				{/* 배너 */}
				<div className="w-full h-[37px] border-b-[1px] border-[#ececec] dark:border-b-[#7F7F7F]">
					<div className="flex flex-row w-[416px] h-[37px] mt-5 gap-[2px]">
						{bannerArr.map((banner) => (
							<button
								key={banner}
								className={
									"relative w-[100px] h-[37px] flex items-center justify-center cursor-pointer"
								}
								onClick={() => {
									setNotiContents(banner);
								}}
							>
								<span
									className={`z-10 ${notiContents === banner ? "text-[#06B796]" : "text-[#333333] dark:text-[#dadada]"}`}
								>
									{banner}
								</span>
								{banner === notiContents && (
									<div className="absolute bottom-0 w-[90px] border-b-[3px] border-[#06B796]" />
								)}
							</button>
						))}
					</div>
				</div>

				{/* 알림 내용들 */}
				<div className="w-full sm:h-[500px] h-[60vh] overflow-y-auto custom-scrollbar">
					{filteredBannerNoti()}
				</div>
				{/* 모두읽음 */}
				<div className="flex justify-end items-center border-t border-t-[#ececec] dark:border-t-[#7F7F7F] h-[58px]">
					<button
						className="flex items-center h-[22px] sm:text-[18px] mr-[30px] cursor-pointer"
						onClick={handleRead}
					>
						모두 읽음
					</button>
				</div>
			</div>
		</>
	);
}
