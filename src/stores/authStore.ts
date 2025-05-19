import { create } from 'zustand';

interface AuthStore {
    isLoggedIn: boolean;
    accessToken: string | null;
    userId: string | null;
    userRole: string | null;
    login: (accessToken: string, userId: string, userRole: string) => void;
    logout: () => void;
}

// sessionStorage에 저장된 토큰값을 가져온다.
const storedToken = sessionStorage.getItem('accessToken');
const storedUserId = sessionStorage.getItem('userId');
const storedUserRole = sessionStorage.getItem('userRole');

export const useAuthStore = create<AuthStore>((set) => ({
    // sessionStorage에 토큰이 있으면 true, 없으면 false
    isLoggedIn: !!storedToken,

    // sessionStorage에서 토큰값 가져온다.
    accessToken: storedToken,

    userId: storedUserId,

    userRole: storedUserRole,

    // 로그인할떄 토큰과 id값을 sessionStorage에 저장해준다.
    login: (accessToken: string, userId: string, userRole: string) => {
        sessionStorage.setItem('accessToken', accessToken);
        sessionStorage.setItem('userId', userId);
        sessionStorage.setItem('userRole', userRole);
        set({ isLoggedIn: true, accessToken, userId, userRole });
    },

    // 로그아웃할떄 토큰과 id값을 sessionStorage에서 삭제한다.
    logout: () => {
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('userRole');
        set({ isLoggedIn: false, accessToken: null, userId: null, userRole: null });
    },
}));
