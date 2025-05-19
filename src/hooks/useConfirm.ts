import { useState } from "react";

export default function useConfirm() {
	const [confirmOpen, setConfirmOpen] = useState(false);
	const toggleConfirm = () => {
		setConfirmOpen((state) => !state);
	};

	return { confirmOpen, toggleConfirm };
}
