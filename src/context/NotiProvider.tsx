import { useCallback, useEffect, useState } from "react";
import { getNotiList, readNoti } from "../apis/notification";
import { useAuthStore } from "../store/authStore";
import { NotiContext } from "./NotiContext";

export function NotiProvider({ children }: { children: React.ReactNode }) {
	const [notiInfo, setNotiInfo] = useState<NotiData[]>([]);
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

	const refetchNotiList = useCallback(async () => {
		try {
			const res: NotiData[] = await getNotiList();
			setNotiInfo((prev) => {
				if (prev.length === 0) return res;
				const prevIdSet = new Set(prev.map((noti) => noti._id));
				const newNotis = res.filter((noti) => !prevIdSet.has(noti._id));
				const combined = [...newNotis, ...prev];
				const mergedMap = new Map<string, NotiData>();

				for (const noti of combined) {
					const existing = mergedMap.get(noti._id);
					if (existing) {
						mergedMap.set(noti._id, {
							...noti,
							seen: noti.seen || existing.seen
						});
					} else {
						mergedMap.set(noti._id, noti);
					}
				}
				const after = Array.from(mergedMap.values());
				return after;
			});
		} catch (err) {
			console.error("알림 목록 가져오기 실패:", err);
		}
	}, []);

	useEffect(() => {
		if (!isLoggedIn) return;
		const interval = setInterval(() => {
			refetchNotiList();
		}, 5000);
		return () => clearInterval(interval);
	}, [isLoggedIn, refetchNotiList]);

	useEffect(() => {
		if (notiInfo.length > 0 && notiInfo.every((noti) => noti.seen)) {
			readNoti(); // 모든 알림이 seen === true일 때만 실행
		}
	}, [notiInfo]);
	return (
		<NotiContext.Provider value={{ notiInfo, setNotiInfo, refetchNotiList }}>
			{children}
		</NotiContext.Provider>
	);
}
