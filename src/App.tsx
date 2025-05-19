import UpcomingConcerts from "./pages/UpcomingConcerts";
import { Route, Routes, Navigate } from "react-router";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Playlist from "./pages/Playlist";
import BopsCommunity from "./features/community/components/BopsCommunity";
import ConcertCommunity from "./features/community/components/ConcertCommunity";
import OpenCommunity from "./features/community/components/OpenCommunity";
import Community from "./pages/Community";
import AddBopPost from "./features/community/components/AddBopPost";
import AddCommunityPost from "./features/community/components/AddCommunityPost";
import ProtectedRoute from "./components/common/ProtectedRoute";
import CommunityPostDetail from "./features/community/components/CommunityPostDetail";
import EditCommunityPost from "./features/community/components/EditCommunityPost";
import EditBopPost from "./features/community/components/EditBopPost";
import Chat from "./pages/Chat";
import AboutUs from "./pages/AboutUs";
import NotFound from "./pages/NotFound";
import Login from "./components/login/Login";
import SignupAgree from "./components/login/SignupAgree";
import SignupForm from "./components/login/SignupForm";
import MyPage from "./features/mypage/components/MyPage";
import PostsByUser from "./features/mypage/components/PostsByUser";
import UserDetail from "./features/mypage/components/UserDetail";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/postsbyuser" element={<PostsByUser />} />
        <Route path="/userdetail/:userId" element={<UserDetail />} />

        <Route path="/login" element={<Login />} />
        <Route path="/SignupAgree" element={<SignupAgree />} />
        <Route path="/SignupForm" element={<SignupForm />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/playlist" element={<Playlist />} />
        </Route>
        <Route path="/upcoming-concerts" element={<UpcomingConcerts />} />

        <Route path="/community" element={<Community />}>
          <Route index element={<Navigate to="bops-community" replace />} />

          <Route path="bops-community" element={<BopsCommunity />} />
          <Route path="concert-community" element={<ConcertCommunity />} />
          <Route path="open-community" element={<OpenCommunity />} />

          <Route element={<ProtectedRoute />}>
            <Route
              path="bops-community/add"
              element={<AddBopPost channelName="BopsCommunity" />}
            />
            <Route
              path="bops-community/post/:postId/edit"
              element={<EditBopPost />}
            />

            <Route
              path="concert-community/add"
              element={<AddCommunityPost channelName="ConcertCommunity" />}
            />
            <Route
              path="concert-community/post/:postId/edit"
              element={<EditCommunityPost />}
            />
            <Route
              path="concert-community/post/:postId"
              element={<CommunityPostDetail />}
            />

            <Route
              path="open-community/add"
              element={<AddCommunityPost channelName="OpenCommunity" />}
            />
            <Route
              path="open-community/post/:postId/edit"
              element={<EditCommunityPost />}
            />
            <Route
              path="open-community/post/:postId"
              element={<CommunityPostDetail />}
            />
          </Route>
        </Route>
        <Route path="/aboutus" element={<AboutUs />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:userId" element={<Chat />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
