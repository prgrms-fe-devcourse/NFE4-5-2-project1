import { useState, useEffect, useMemo } from 'react';
import { getUsers } from '../../api/users';
import UserCard from '../molecules/UserCard';
import { useLocation, useNavigate } from 'react-router-dom';
import UserCardSkeleton from '../molecules/UserCardSkeleton';

export default function Users() {
  const location = useLocation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadAllUsers() {
      try {
        const allUsers: User[] = [];
        const limit = 30; // 한 번에 가져올 최대 개수
        let offset = 0; // 시작 위치

        while (true) {
          // offset 위치부터 limit 개만큼 가져오기
          const batch = await getUsers(offset, limit);

          // 더 이상 데이터가 없으면 루프 종료
          if (batch.length === 0) break;

          allUsers.push(...batch);

          // 다음 페이지로 이동
          offset += batch.length;

          // 마지막 페이지(배치 사이즈가 limit보다 작으면)면 종료
          if (batch.length < limit) break;
        }

        // fullName이 null인 경우 제외
        setUsers(allUsers.filter((u) => u.fullName !== null));
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadAllUsers();
  }, []);

  //users 온라인 : 오프라인 정렬
  const sortedUsers = useMemo(() => {
    return [...users].sort(
      (a, b) => (b.isOnline ? 1 : 0) - (a.isOnline ? 1 : 0),
    );
  }, [users]);

  // 경로에 따라 온라인/ 오프라인 필터링
  const filteredUsers = useMemo(() => {
    if (location.pathname.endsWith('/online')) {
      return sortedUsers.filter((u) => u.isOnline);
    }
    if (location.pathname.endsWith('/offline')) {
      return sortedUsers.filter((u) => !u.isOnline);
    }
    return sortedUsers;
  }, [sortedUsers, location.pathname]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-[15px] md:grid-cols-2 lg:grid-cols-3">
        {[...Array(18)].map((_, index) => (
          <UserCardSkeleton key={index} />
        ))}
      </div>
    );
  }
  if (error) {
    return <p className="py-8 text-center text-red-500">{error}</p>;
  }

  //유저 상황에 따라 안내 메시지
  if (filteredUsers.length === 0) {
    if (location.pathname.endsWith('/online')) {
      return <p className="py-8 text-center">온라인 유저가 없습니다.</p>;
    }
    if (location.pathname.endsWith('/offline')) {
      return <p className="py-8 text-center">오프라인 유저가 없습니다.</p>;
    }
    return <p className="py-8 text-center">등록된 유저가 없습니다.</p>;
  }
  return (
    <div className="grid grid-cols-1 gap-[15px] md:grid-cols-2 lg:grid-cols-3">
      {filteredUsers.map((user, idx) => (
        <div
          key={user._id ?? idx} // _id 없으면 인덱스를 키로
          className="block cursor-pointer"
          onClick={() => {
            // superAdmin 이거나 _id가 없으면 NotFound로
            if (user.role === 'SuperAdmin' || !user._id) {
              navigate('*');
            } else {
              navigate(`/${user._id}`);
            }
          }}
        >
          <UserCard
            UName={user.fullName}
            followCount={user.following.length}
            followerCount={user.followers.length}
            tags={user.username ? JSON.parse(user.username).tags : []}
            imgUrl={user.image}
            loginStatus={user.isOnline ? 'online' : 'offline'}
          />
        </div>
      ))}
    </div>
  );
}
