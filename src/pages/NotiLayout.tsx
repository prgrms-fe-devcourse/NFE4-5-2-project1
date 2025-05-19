import { useState } from "react";
import NotiList from "../components/features/notification/NotiList";

export default function NotiLayout() {
	const [notiOpen, setNotiOpen] = useState(false);

	return (
		<div className="w-full">
			<NotiList notiOpen={notiOpen} setNotiOpen={setNotiOpen} />
		</div>
	);
}
