import "quill/dist/quill.snow.css";
import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/commons/ProtectedRoute";
import PublicOnlyRoute from "./components/commons/PublicOnlyRoute";
import RootLayout from "./layouts/rootlayout";
import Channel from "./pages/Channel";
import Home from "./pages/Home";
import Login from "./pages/Login";

import ScrollToTop from "./components/commons/ScrollToTop";
import MessageLayout from "./components/features/message/MessageLayout";
import { NotiProvider } from "./context/NotiProvider";
import NotFound from "./pages/NotFound";
import NotiLayout from "./pages/NotiLayout";
import PostCreate from "./pages/PostCreate";
import PostDetail from "./pages/PostDetail";
import PostEdit from "./pages/PostEdit";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import { useThemeStore } from "./store/themeStore";

export default function App() {
	// darkmode
	useEffect(() => {
		useThemeStore.getState().initializeTheme(); // 직접 호출
	}, []);

	return (
		<>
			<ScrollToTop />
			<NotiProvider>
				<Routes>
					<Route element={<RootLayout />}>
						<Route path="/" element={<Home />}>
							<Route index element={<Navigate to="channel/전체글" replace />} />
							<Route path="channel/:channelName" index element={<Channel />} />
						</Route>
						<Route path="/post/detail/:id" element={<PostDetail />} />
						<Route path="/profile/:id" element={<Profile />} />

						<Route element={<ProtectedRoute />}>
							<Route path="/postCreate" element={<PostCreate />} />
							<Route path="/post/edit/:id" element={<PostEdit />} />
							<Route path="/message" element={<MessageLayout />} />
							<Route path="/message/:id" element={<MessageLayout />} />
							<Route path="/notification" element={<NotiLayout />} />
						</Route>
					</Route>
					<Route element={<PublicOnlyRoute />}>
						<Route path="/login" element={<Login />} />
						<Route path="/signup" element={<Signup />} />
					</Route>
					<Route path="/404" element={<NotFound />} />
					<Route path="/*" element={<Navigate to="/404" replace />} />
				</Routes>
				<ToastContainer
					position="top-center"
					autoClose={2500}
					hideProgressBar
					closeOnClick={false}
					pauseOnHover
					draggable
					toastClassName={() =>
						"bg-transparent shadow-none p-0 m-0 flex justify-center"
					}
				/>
			</NotiProvider>
		</>
	);
}
