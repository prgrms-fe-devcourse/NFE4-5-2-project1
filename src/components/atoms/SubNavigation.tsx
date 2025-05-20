import { NavLink, Outlet, useParams } from 'react-router-dom';
import { getUserById } from '../../api/users';
import { useEffect, useState } from 'react';

const getTabData = (
  userId: string | undefined,
  fullName: string | undefined,
): Record<string, { name: string; path: string }[]> => ({
  community: [
    { name: '전체', path: '/community' },
    { name: '일상공유', path: '/community/daily' },
    { name: '개발일지', path: '/community/develop' },
    { name: '취업정보', path: '/community/employ' },
    { name: '팀원모집', path: '/community/recruit' },
  ],
  question: [
    { name: '전체', path: '/question' },
    { name: '미해결', path: '/question/unsolved' },
    { name: '해결완료', path: '/question/solved' },
  ],
  users: [
    { name: '전체', path: '/users' },
    { name: '온라인', path: '/users/online' },
    { name: '오프라인', path: '/users/offline' },
  ],
  userId: [
    { name: '프로필', path: `/${userId}` },
    { name: `${fullName}의 질문`, path: `/${userId}/question` },
    { name: '작성한 댓글', path: `/${userId}/comments` },
    { name: '좋아요 누른 글', path: `/${userId}/liked` },
  ],
  me: [
    { name: '전체', path: '/me' },
    { name: '나의 질문', path: '/me/question' },
    { name: '작성한 댓글', path: '/me/comments' },
    { name: '좋아요 누른 글', path: '/me/liked' },
  ],
});

export default function SubNavigation({ channel }: { channel: string }) {
  const { userId } = useParams(); // URL 파라미터에서 유저 이름 추출
  // const tabData = getTabData(userId);

  //FACTOR: userId 값을 user fullname으로 받아 렌더링
  const [fullName, setFullName] = useState<string>();

  useEffect(() => {
    if (!userId) return;
    getUserById(userId)
      .then((data) => setFullName(data.fullName))
      .catch(console.error);
  }, [userId]);

  // if (fullName === undefined) return <div>로딩중...</div>;
  // if (fullName === null)
  //   return <div className="text-gray-600">탈퇴한 회원입니다.</div>;
  const tabData = getTabData(userId, fullName);
  const tabs = tabData[channel];

  return (
    <>
      {tabs && (
        <nav>
          <ul className="flex gap-5">
            {tabs.map(({ name, path }) => (
              <li
                key={path}
                className="nanum-gothic-regular dark:text-dark-text mx-2 my-[30px] cursor-pointer"
              >
                <NavLink
                  to={path}
                  end={path === `/${channel}` || path === `/${userId}`} // '전체'일 때만 end 처리, '프로필'
                  className={({ isActive }) => (isActive ? '' : 'opacity-50')}
                >
                  {name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <Outlet />
    </>
  );
}
