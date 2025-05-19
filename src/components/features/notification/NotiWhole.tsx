import NotiMessageItem from "./NotiMessageItem";
import NotiPostItem from "./NotiPostItem";
import NotiRequestItem from "./NotiRequestItem";
import { useAuthStore } from "../../../store/authStore";

export default function NotiWhole({
	noti,
	onClose
	// setNotiInfo
}: {
	noti: NotiData[];
	onClose: () => void;
	// setNotiInfo: React.Dispatch<React.SetStateAction<NotiData[]>>;
}) {
	const userId = useAuthStore((state) => state.userId)!;

	const sortNoti = [...noti]
		.filter((notice) => (notice.user as UserData)._id === userId)
		.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		);
	return (
		<>
			{sortNoti.length > 0 ? (
				// 알림 필터링해서 각 타입별로 컴포넌트 렌더링
				sortNoti.some(
					(notice) =>
						"like" in notice ||
						"comment" in notice ||
						"message" in notice ||
						(!("like" in notice) &&
							!("comment" in notice) &&
							!("message" in notice))
				) ? (
					sortNoti.map((notice) => {
						if ("like" in notice || "comment" in notice) {
							return (
								(notice.like || notice.comment) && (
									<NotiPostItem
										key={notice._id}
										notice={notice}
										onClose={onClose}
									/>
								)
							);
						} else if ("message" in notice) {
							return (
								notice.message && (
									<NotiMessageItem
										key={notice._id}
										notice={notice}
										onClose={onClose}
									/>
								)
							);
						} else if (
							!("like" in notice) &&
							!("comment" in notice) &&
							!("message" in notice)
						) {
							return (
								<NotiRequestItem
									key={notice._id}
									notice={notice}
									onClose={onClose}
								/>
							);
						} else {
							return null; // 해당 조건 외엔 아무것도 렌더링 안 함
						}
					})
				) : (
					<div className="flex items-center justify-center w-full h-[500px]">
						표시할 알림이 없습니다
					</div>
				)
			) : (
				<div className="flex items-center justify-center w-full h-[500px]">
					표시할 알림이 없습니다
				</div>
			)}
		</>
	);
}
