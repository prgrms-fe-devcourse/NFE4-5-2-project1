import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { useAuthStore } from '../../stores/authStore';

export default function PublicRouter() {
    const navigate = useNavigate();
    // 화면에 보여줄지말지의 상태
    const [show, setIsShow] = useState(false);
    // 상태관리에서 로그인 상태 확인 가져온다.
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    // 상태관리에서 관리자인지 확인을위해 역할을 가져온다.
    const userRole = useAuthStore((state) => state.userRole);
    useEffect(() => {
        // 로그인 상태라면 채널화면으로 이동
        if (isLoggedIn) {
            // 역할이 어드민이면 관리자페이지로 이동
            if (userRole === 'SuperAdmin') {
                navigate('/superadmin');
            } else {
                navigate('/channel');
            }
        }
        setIsShow(true);
    }, [isLoggedIn, userRole, navigate]);

    // show가 true이면 (Outlet) 자식 라우터 컴포넌트를 보여준다.
    return <>{show && <Outlet />}</>;
}
