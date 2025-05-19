import { MenuItem } from '../types/Sidebar';
import newPostIcon from '../assets/icons/newPostIcon.svg';
import mate from '../assets/icons/homeIcon.svg';
import search from '../assets/icons/Search.svg';
import notice from '../assets/icons/notificationIcon.svg';
import noticeon from '../assets/icons/notificationIconOn.svg';
import history from '../assets/icons/profileIcon.svg';
import settings from '../assets/icons/setting.svg';
import { useEffect, useState } from 'react';
import SearchPanel from '../components/SearchPanel';
import NoticePanel from '../components/NoticePanel';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useNotificationStore } from '../stores/notificationStore';

export default function Sidebar(): React.ReactElement {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const userRole = useAuthStore((state) => state.userRole);
    const navigate = useNavigate();

    const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
    const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);

    const location = useLocation();
    const { hasUnread, fetchNotifications } = useNotificationStore();

    useEffect(() => {
        if (location.pathname.startsWith('/profile/')) {
            setHighlightedItemId('search');
            setIsSearchMode(true);
            return;
        }

        switch (location.pathname) {
            case '/write':
                setHighlightedItemId('share');
                setIsSearchMode(false);
                break;
            case '/channel':
                setHighlightedItemId('mate');
                setIsSearchMode(false);
                break;
            case '/myprofile':
                setHighlightedItemId('history');
                setIsSearchMode(false);
                break;
            case '/superadmin':
                setHighlightedItemId('superadmin settings');
                setIsSearchMode(false);
                break;
            case '/search':
                setHighlightedItemId('search');
                setIsSearchMode(true);
                break;
            case '/notice':
                setHighlightedItemId('notice');
                setIsSearchMode(false);
                break;
            default:
                setHighlightedItemId(null);
                setIsSearchMode(false);
        }
    }, [location.pathname]);

    useEffect(() => {
        // 마운트 시 알림 상태 최신화
        fetchNotifications();
    }, []);

    const handleItemClick = (item: MenuItem, event: React.MouseEvent) => {
        event.preventDefault();

        // 현재 선택된 항목이면 아무것도 하지 않음
        if (item.id === highlightedItemId) return;

        if (item.isSearchTrigger) {
            const nextSearchMode = !isSearchMode;
            setIsSearchMode(nextSearchMode);
            setHighlightedItemId(nextSearchMode ? item.id : null);
            return;
        }

        // 일반 메뉴 클릭시
        setIsSearchMode(false);
        setHighlightedItemId(item.id);

        // 메뉴별 네비게이션 라우팅
        switch (item.id) {
            case 'share':
                navigate('/write');
                break;
            case 'mate':
                navigate('/channel');
                break;
            case 'history':
                navigate('/myprofile');
                break;
            case 'superadmin settings':
                navigate('/superadmin');
                break;
        }
    };

    const handleCloseSearch = () => {
        setIsSearchMode(false);
        setHighlightedItemId(null);
    };

    const handleClosePanel = () => {
        setHighlightedItemId(null);
    };

    const isExpanded = highlightedItemId !== null;
    const shouldShrinkSidebar = highlightedItemId === 'search' || highlightedItemId === 'notice';
    const menuPanelWidth = shouldShrinkSidebar ? 'w-[70px]' : 'w-[235px]';

    //로그인 여부에 따라 메뉴 설정
    const menuItems: MenuItem[] = isLoggedIn
        ? [
              {
                  id: 'share',
                  icon: <img src={newPostIcon} />,
                  text: '여행 나누기',
                  path: '/share',
              },
              {
                  id: 'mate',
                  icon: <img src={mate} />,
                  text: '여행 이야기',
                  path: '/mate',
              },
              {
                  id: 'search',
                  icon: <img src={search} />,
                  text: '검색',
                  path: '/search',
                  isSearchTrigger: true,
              },

              {
                  id: 'notice',
                  icon: <img src={hasUnread ? noticeon : notice} />,
                  text: '여정 알림판',
                  path: '/notice',
              },
              {
                  id: 'history',
                  icon: <img src={history} />,
                  text: '나의 여정 기록',
                  path: '/history',
              },
              ...(userRole === 'SuperAdmin'
                  ? [
                        {
                            id: 'superadmin settings',
                            icon: <img src={settings} />,
                            text: '관리자 설정',
                            path: '/superadmin settings',
                        },
                    ]
                  : []),
          ]
        : [
              {
                  id: 'mate',
                  icon: <img src={mate} />,
                  text: '여행 이야기',
                  path: '/mate',
              },
              {
                  id: 'search',
                  icon: <img src={search} />,
                  text: '검색',
                  path: '/search',
                  isSearchTrigger: true,
              },
          ];

    return (
        <nav className="min-h-screen bg-[var(--color-sideBody)] flex transition-all duration-300">
            <div className={`p-4 overflow-y-auto  transition-all duration-300 ease-in-out ${menuPanelWidth}`}>
                <ul className="items-start justify-start text-left mt-1.5">
                    {menuItems.map((item) => {
                        const isItemActive = item.id === highlightedItemId;
                        const iconContainerClasses = `p-2 mb-2 rounded-md cursor-pointer transition duration-150 ease-in-out group flex items-center justify-center ${
                            isItemActive ? 'bg-[var(--color-selected)]' : 'bg-[var(--color-sideBody)]'
                        }`;
                        return (
                            <li
                                key={item.id}
                                className={`${iconContainerClasses.trim()} items-start justify-start text-left`}
                                onClick={(e) => handleItemClick(item, e)}
                                title={item.text}
                            >
                                <span
                                    className={`w-5 h-5 block mr-3 flex-shrink-0 ${
                                        isItemActive ? 'filter brightness-0 invert' : ''
                                    }`}
                                >
                                    {item.icon}
                                </span>
                                <span
                                    className={`text-sm 
                                        ${isItemActive ? 'text-white' : 'text-[var(--color-notSelected)]'} 
                                        ${shouldShrinkSidebar ? 'hidden' : 'inline'}
                                    `}
                                >
                                    {item.text}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="flex-grow overflow-hidden">
                {isExpanded && (
                    <div className="h-full w-full bg-white">
                        {isSearchMode ? (
                            <SearchPanel onClose={handleCloseSearch} />
                        ) : (
                            <>
                                {highlightedItemId === 'notice' && (
                                    <NoticePanel isOpen={true} onClose={handleClosePanel} />
                                )}
                                {highlightedItemId && highlightedItemId !== 'notice' && highlightedItemId !== 'search'}
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
