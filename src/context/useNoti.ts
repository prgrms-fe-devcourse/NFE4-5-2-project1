import { useContext } from "react";
import { NotiContext } from "./NotiContext";
export const useNoti = () => {
	const context = useContext(NotiContext);
	if (!context) {
		throw new Error("useNoti must be used within a NotiProvider");
	}
	return context;
};
