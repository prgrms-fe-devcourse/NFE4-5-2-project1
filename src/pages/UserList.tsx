import profile from '../assets/images/profile.svg';
import online from '../assets/icons/onLine.svg';
import offline from '../assets/icons/offLine.svg';
import search from '../assets/icons/Search.svg';
import { useEffect, useState } from 'react';
// import { useAuthStore } from "../stores/authStore";
import { axiosInstance } from '../api/axios';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';

interface User {
  _id: string;
  fullName: string;
  image: string;
  followers: string[];
  isOnline: boolean;
}

// 각 유저 정보부분
const UserItem = ({ user }: { user: User }) => {
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.userId);
  const [authUser, setAuthUser] = useState<{
    following: { _id: string }[];
  } | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false); // 팔로우 상태 관리

  // 로그인한 사용자 팔로우여부 확인
  useEffect(() => {
    const getUser = async () => {
      if (!userId) return;
      const { data } = await axiosInstance.get(`users/${userId}`);
      setAuthUser(data);

      const followingIds = data.following.map(
        (follow: { _id: string }) => follow._id
      );

      const isUserFollowing = user.followers.some((follower) =>
        followingIds.includes(follower)
      );
      setIsFollowing(isUserFollowing);
    };
    getUser();
  }, [userId, user._id]);

  // 팔로잉 시
  const followUser = async () => {
    try {
      const res = await axiosInstance.post('/follow/create', {
        userId: user._id,
      });
      toast(`${user.fullName}님을 팔로우합니다.`);
      console.log('팔로우 결과:', res.data);
      setIsFollowing(true);
      window.location.reload();
    } catch (error) {
      console.error('팔로우 실패:', error);
      toast.error(`${user.fullName}님 팔로우 실패.`);
    }
  };

  // 언팔로잉 시
  const unFollowUser = async () => {
    try {
      const commonId = user.followers.find((followerId) =>
        authUser?.following.some((follow) => follow._id === followerId)
      );
      console.log(commonId);

      if (commonId) {
        const res = await axiosInstance.delete('/follow/delete', {
          data: { id: commonId },
        });
        toast(`${user.fullName}님을 언팔로우합니다.`);
        console.log('언팔로우 결과:', res.data);
        setIsFollowing(false);
      } else {
        toast('팔로우 관계가 없습니다.');
      }
    } catch (error) {
      console.error('언팔로우 실패:', error);
      toast.error(`${user.fullName}님 언팔로우 실패.`);
    }
  };

  // 팔로우 버튼 클릭시
  const handleFollow = async () => {
    if (authUser) {
      if (isFollowing) {
        await unFollowUser();
      } else {
        await followUser();
      }
    } else {
      toast('로그인을 진행해주세요');
      navigate('/login');
    }
  };

  return (
    <div className="border-y border-[var(--color-notSelected)] w-full flex h-16 px-4 py-2.5 items-center overflow-hidden">
      <div className="flex gap-2 items-center font-mono text-[18px]">
        <img
          src={user.image || profile}
          alt="프로필 이미지"
          className="w-8 h-8 border-gray-400 border rounded-full flex-shrink-0 bg-gray-100"
        />
        <Link to={`/userprofile/${user._id}`}>{user.fullName}</Link>
        <img src={user.isOnline ? online : offline} className="w-5 h-5 py-0" />
      </div>
      <button
        className="ml-auto cursor-pointer transition-all duration-200 text-[17px] hover:font-bold hover:text-[var(--color-main-blue)] montserrat"
        onClick={handleFollow}
        // disabled={!authUser}
      >
        {isFollowing ? 'UnFollow' : 'Follow'}{' '}
      </button>
    </div>
  );
};

export default function UserList() {
  const [users, setUsers] = useState<
    {
      _id: string;
      image: string;
      fullName: string;
      followers: string[];
      isOnline: boolean;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchInput(e.target.value);

  // 유저 검색 부분
  useEffect(() => {
    const filtered = users.filter((user) =>
      user.fullName.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchInput, users]);

  // 사용자 목록 가져오기
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axiosInstance.get('/users/get-users', {});
        setUsers(res.data);
      } catch (error) {
        console.error('사용자 목록을 가져오는데 실패했습니다.', error);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex-grow py-6 w-full">
        <div className="mx-auto min-w-[600px] max-w-[900px] w-[55vw] sm:px-10 sm:py-10 py-4 box-shadow-custom bg-[var(--color-white)] rounded-[10px]">
          <div className="flex flex-col gap-3.5">
            <div className="flex gap-1.5 items-center">
              <span className="text-[18px] h-full">여행중</span>
              <img src={online} className="w-5 h-5 py-0" />
            </div>
            <div className="flex items-center rounded-[7px] border border-[#c2c2c2] p-2 mb-5 w-11/12 mx-auto h-13 focus-within:outline">
              <input
                type="text"
                className="flex-1 bg-transparent outline-none"
                placeholder="유저를 검색하세요"
                value={searchInput}
                onChange={handleSearchInputChange}
              />
              <img src={search} alt="돋보기 버튼" className="ml-2 w-5 h-5" />
            </div>
          </div>
          <div className="p-4 border rounded-[8px] flex flex-col h-auto">
            {filteredUsers.map((user) => (
              <UserItem key={user._id} user={user} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
