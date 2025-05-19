import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAuthStore } from "../../store/authStore";

export default function PublicOnlyRoute() {
	const [show, setShow] = useState(false);
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
	const navigate = useNavigate();
	useEffect(() => {
		if (isLoggedIn) {
			navigate("/");
			return;
		}
		setShow(true);
	}, [isLoggedIn, navigate]);
	return <>{show && <Outlet />}</>;
}
