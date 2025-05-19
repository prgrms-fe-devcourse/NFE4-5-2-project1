import { useAuthStore } from "../../../store/authStore";
import NotiPostItem from "./NotiPostItem";

export default function NotiPosts({
	noti,
	onClose
	// setNotiInfo
}: {
	noti: NotiData[];
	onClose: () => void;
	// setNotiInfo: React.Dispatch<React.SetStateAction<NotiData[]>>;
}) {
	const userId = useAuthStore((state) => state.userId)!;
	// console.log("noti:", noti);

	return (
		<>
			{noti.length > 0 ? (
				noti
					.filter(
						(notice) =>
							(notice.like || notice.comment) &&
							(notice.user as UserData)._id === userId &&
							notice.author._id !== userId
					)
					.map((notice) => (
						<NotiPostItem
							key={notice._id}
							notice={notice}
							onClose={onClose}
							// setNotiInfo={setNotiInfo}
						/>
					))
			) : (
				<div className="flex items-center justify-center w-full h-[500px]">
					표시할 알림이 없습니다
				</div>
			)}
		</>
	);
}
