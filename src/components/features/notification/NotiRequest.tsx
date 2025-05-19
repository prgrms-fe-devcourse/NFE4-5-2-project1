import { useAuthStore } from "../../../store/authStore";
import NotiRequestItem from "./NotiRequestItem";
// import profileImg from "../../../assets/images/profileImg_circle.svg";
export default function NotiRequest({
	noti,
	onClose
	// setNotiInfo
}: {
	noti: NotiData[];
	onClose: () => void;
	// setNotiInfo: React.Dispatch<React.SetStateAction<NotiData[]>>;
}) {
	const userId = useAuthStore((state) => state.userId)!;

	return (
		<>
			{noti.length > 0 ? (
				noti
					.filter((notice) => (notice.user as UserData)._id === userId)
					.map((notice) => (
						<NotiRequestItem
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
