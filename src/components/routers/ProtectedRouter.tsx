import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { useAuthStore } from '../../stores/authStore';

export default function ProtectedRouter() {
    const navigate = useNavigate();
    const [show, setIsShow] = useState(false);
    // 화면에 보여줄지말지의 상태
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    // 상태관리에서 로그인 상태 확인 가져온다.

    useEffect(() => {
        // 로그인 상태가 아니라면 홈화면으로 이동
        if (!isLoggedIn) {
            navigate('/');
            return;
        }
        setIsShow(true);
    }, [isLoggedIn, navigate]);

    // show가 true이면 (Outlet) 자식 라우터 컴포넌트를 보여준다.
    return <>{show && <Outlet />}</>;
}
