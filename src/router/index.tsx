import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import Home from "../pages/HomePage";
import FanPage from "../pages/FanPage";
import ProfileLayout from "../layout/ProfileLayout";
import FollowBox from "../components/Profile/FollowBox";
import LogIn from "../pages/LogInPage";
import SignUp from "../pages/SignUpPage";
import NotFoundPage from "../pages/NotFoundPage";
import EditProfile from "../pages/EditProfilePage";
import MyThreadsList from "../components/Profile/MyThreadsList";
import AuthLayout from "../layout/RejectIfAuth";
import RequireAuth from "../layout/RequireAuth";
import NewMessage from "../components/Message/NewMessage";
import MessagePage from "../pages/MessagePage";
import MessageContainer from "../components/Message/MessageContainer";
import EmptyMessage from "../components/Message/EmptyMessage";
import DetailFanPage from "../pages/DetailFanPage";

export const routes = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "profile/:id",
        element: <ProfileLayout />,
        children: [
          { path: "posts", element: <MyThreadsList /> },
          { path: "follower", element: <FollowBox isFollower={true} /> },
          { path: "following", element: <FollowBox isFollower={false} /> },
        ],
      },
      {
        path: "fanpage/:teamName/:channelId",
        children: [
          { index: true, element: <FanPage /> },
          { path: ":postId", element: <DetailFanPage /> },
        ],
      },
      {
        element: <RequireAuth />,
        children: [
          {
            path: "message",
            element: <MessagePage />,
            children: [
              { index: true, element: <EmptyMessage /> },
              { path: "new", element: <NewMessage /> },
              { path: ":id", element: <MessageContainer /> },
            ],
          },
          { path: "profile/edit", element: <EditProfile /> },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LogIn /> },
      { path: "signup", element: <SignUp /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
];

export const router = createBrowserRouter(routes);
