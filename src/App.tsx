import Channel from './components/Channel';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import ProfileEdit from './pages/ProfileEdit';
import PublicRouter from './components/routers/PublicRouter';
import ProtectedRouter from './components/routers/ProtectedRouter';
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import MyProfile from './pages/MyProfile';
import Write from './pages/Write';
import UserList from './pages/UserList';
import SuperAdmin from './pages/SuperAdmin';
import AdminRouter from './components/routers/AdminRouter';
import Layout from './layout/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
    return (
        <>
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar closeOnClick closeButton={false} />
            <Routes>
                {/* 인증없이 사용가능한 라우터 */}
                <Route element={<PublicRouter />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                </Route>

                <Route path="/layout" element={<Layout />} />

                {/* 레이아웃 라우터 */}
                <Route element={<Layout />}>
                    <Route path="/channel" element={<Channel />} />
                    <Route path="/userprofile/:userId" element={<UserProfile />} />
                    <Route path="/profile/:userId" element={<UserProfile />} />
                    <Route path="/userlist" element={<UserList />} />

                    {/* 인증(로그인)이 있어야 사용가능한 라우터 */}
                    <Route element={<ProtectedRouter />}>
                        <Route path="/profileedit" element={<ProfileEdit />} />
                        <Route path="/myprofile" element={<MyProfile />} />
                        <Route path="/write" element={<Write />} />
                    </Route>

                    {/* SuperAdmin만 접근 가능한 관리자 페이지 */}
                    <Route path="/superadmin" element={<AdminRouter />}>
                        <Route index element={<SuperAdmin />} />
                    </Route>
                </Route>

                {/* 없는 라우터면 NotFound */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}
