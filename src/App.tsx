import { Route, Routes } from 'react-router-dom';
import Header from './components/organisms/Header';
import SubNavigation from './components/atoms/SubNavigation';
import Main from './components/templates/Main';
import NotFound from './components/templates/NotFound';
import Community from './components/templates/Community';
import Question from './components/templates/Question';
import Users from './components/templates/Users';
import Search from './components/templates/Search';
import Setting from './components/templates/Setting';
import Post from './components/templates/Post';
import Writer from './components/templates/Writer2';
import UserPage from './components/templates/UserPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDarkModeStore } from './stores/darkModeStore';
import { useEffect } from 'react';

export default function App() {
  const isDarkMode = useDarkModeStore((state) => state.isDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);
  return (
    <>
      <div className="dark:bg-dark-bg inset-0 m-auto flex min-h-screen flex-col items-center transition-colors duration-300 ease-in-out">
        <Routes>
          <Route path="/" element={<Header />}>
            <Route index element={<Main />} />
            <Route
              path="/community"
              element={<SubNavigation channel="community" />}
            >
              <Route index element={<Community />} />
              <Route path="daily" element={<Community />} />
              <Route path="develop" element={<Community />} />
              <Route path="employ" element={<Community />} />
              <Route path="recruit" element={<Community />} />
            </Route>

            <Route
              path="/question"
              element={<SubNavigation channel="question" />}
            >
              <Route index element={<Question />} />
              <Route path="solved" element={<Question />} />
              <Route path="unsolved" element={<Question />} />
            </Route>

            <Route path="/:userId" element={<SubNavigation channel="userId" />}>
              <Route index element={<UserPage />} />
              <Route path="question" element={<UserPage />} />
              <Route path="comments" element={<UserPage />} />
              <Route path="liked" element={<UserPage />} />
            </Route>

            <Route path="/users" element={<SubNavigation channel="users" />}>
              <Route index element={<Users />} />
              <Route path="online" element={<Users />} />
              <Route path="offline" element={<Users />} />
            </Route>

            <Route path="/post/:postId" element={<Post />} />
            <Route path="writer/:postId?" element={<Writer />} />

            <Route path="/search/:keyword">
              <Route index element={<Search />} />
              <Route path="community" element={<Search />} />
              <Route path="question" element={<Search />} />
              <Route path="user" element={<Search />} />
            </Route>
            <Route path="/setting" element={<Setting />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
        />
      </div>
    </>
  );
}
