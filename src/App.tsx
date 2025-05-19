import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import { axiosInstance } from './api/axios';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/login/Login';
import SignUp from './pages/signup/SignUp';
import Error from './pages/Error';
import MainLayout from './layout/MainLayout';
import MainContent from './pages/MainContent';
import PostList from './pages/PostList';
import PostDetail from './pages/PostDetail';
import WritePostRouter from './route/WritePostRouter';
import UpdatePostRouter from './route/UpdatePostRouter';
import ProfilePage from './pages/profile/ProfilePage';
import EditProfilePage from './pages/profile/profile-edit/EditProfilePage';
import DarkMode from './components/toggle/DarkMode';

export default function App() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (accessToken) {
      axiosInstance
        .get('/auth-user')
        .then((res) => {
          setUser(res.data);
          useAuthStore.setState({ isLoading: false });
        })
        .catch(() => {
          useAuthStore.getState().logout();
          useAuthStore.setState({ isLoading: false });
        });
    } else {
      useAuthStore.setState({ isLoading: false });
    }
  }, [accessToken, setUser]);

  return (
    <DarkMode>
      {(theme, nextTheme, nextThemeIndex) => (
        <Routes>
          <Route
            element={
              <MainLayout
                theme={theme}
                nextTheme={nextTheme}
                nextThemeIndex={nextThemeIndex}
              />
            }
          >
            <Route path="/" element={<MainContent theme={theme} />} />
            <Route path="/profile" element={<ProfilePage theme={theme} />} />
            <Route
              path="/profile/edit"
              element={<EditProfilePage theme={theme} />}
            />
            <Route
              path="/channel/:channelId"
              element={<PostList theme={theme} />}
            />
            <Route
              path="/channel/:channelId/post/:postId"
              element={<PostDetail theme={theme} />}
            />
            <Route
              path="/channel/:channelId/write"
              element={<WritePostRouter theme={theme} />}
            />
            <Route
              path="/channel/:channelId/update/:postId"
              element={<UpdatePostRouter theme={theme} />}
            />
          </Route>
          <Route path="/login" element={<Login theme={theme} />} />
          <Route path="/signup" element={<SignUp theme={theme} />} />
          <Route path="*" element={<Error theme={theme} />} />
        </Routes>
      )}
    </DarkMode>
  );
}
