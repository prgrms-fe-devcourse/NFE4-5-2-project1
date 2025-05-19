import { useAuthStore } from "../../../store/authStore";
import NotiMessageItem from "./NotiMessageItem";

export default function NotiMessage({
	noti,
	onClose
	// setNotiInfonpm
}: {
	noti: NotiData[];
	onClose: () => void;
	// setNotiInfo: React.Dispatch<React.SetStateAction<NotiData[]>>;
}) {
	const userId = useAuthStore((state) => state.userId)!;

	return (
		<>
			{noti.length > 0 ? (
				//메세지
				noti
					.filter(
						(notice) =>
							notice.message && (notice.user as UserData)._id === userId
					)
					.map((notice) => (
						<NotiMessageItem
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
