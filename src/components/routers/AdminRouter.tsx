import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export default function AdminRouter() {
    const navigate = useNavigate();
    const [show, setIsShow] = useState(false);

    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const userRole = useAuthStore((state) => state.userRole);

    useEffect(() => {
        // 로그인 안 되어 있거나, 권한이 SuperAdmin이 아니면 채널 페이지로 이동
        if (!isLoggedIn || userRole !== 'SuperAdmin') {
            navigate('/channel');
            return;
        }

        // 조건을 만족할 때만 화면 보여주기
        setIsShow(true);
    }, [isLoggedIn, userRole, navigate]);

    return <>{show && <Outlet />}</>;
}
