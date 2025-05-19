import { create } from 'zustand';
import { axiosInstance } from '../api/axios';

interface Notification {
    id: number;
    content: string;
    seen: boolean;
}

interface NotificationState {
    notifications: Notification[];
    hasUnread: boolean;
    fetchNotifications: () => Promise<void>;
    setHasUnread: (value: boolean) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    hasUnread: false,
    setHasUnread: (value) => set({ hasUnread: value }),

    // 알림 데이터 가져오기
    fetchNotifications: async () => {
        try {
            const res = await axiosInstance.get('/notifications');
            const data: Notification[] = res.data;

            const hasUnread = data.some((n) => !n.seen);
            set({ notifications: data, hasUnread });
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    },
}));
