import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAuthStore } from "../../store/authStore";

export default function ProtectedRoute() {
	const [show, setShow] = useState(false);
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
	const navigate = useNavigate();
	useEffect(() => {
		if (!isLoggedIn) {
			navigate("/login");
			return;
		}
		setShow(true);
	}, [isLoggedIn, navigate]);
	return <>{show && <Outlet />}</>;
}
