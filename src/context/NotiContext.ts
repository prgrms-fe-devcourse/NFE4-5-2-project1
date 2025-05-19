import { createContext } from "react";

interface NotiContextType {
	notiInfo: NotiData[];
	setNotiInfo: React.Dispatch<React.SetStateAction<NotiData[]>>;
	refetchNotiList: () => Promise<void>;
}
export const NotiContext = createContext<NotiContextType | null>(null);
