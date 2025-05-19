// import Button from "../components/button";
import profile from '../assets/images/profile.svg';
import Jeju from '../assets/achievementIcons/jeju.svg';
import Cafe from '../assets/achievementIcons/cafe.svg';
import Hiking from '../assets/achievementIcons/hiking.svg';
import Alone from '../assets/achievementIcons/alone.svg';
import House from '../assets/achievementIcons/house.svg';
import KoreaPin from '../assets/achievementIcons/koreaPin.svg';
import PowerJ from '../assets/achievementIcons/PowerJ.svg';
import Star from '../assets/achievementIcons/Star.svg';
import Train from '../assets/achievementIcons/train.svg';
// import Tag from '../components/Tag'
import testLike from '../assets/icons/Heart.png';
import testFoot from '../assets/icons/footprintWhite.svg';
import Button from '../components/button';
import { useAuthStore } from '../stores/authStore';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../api/axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import PostModal from '../components/PostModal';

interface Post {
  _id: string;
  title: string;
  image: string;
  imagePublicId: string;
  channel: string;
  author: {
    fullName: string;
    image: string;
    _id: string;
  };
  likes: any[];
  comments: any[];
  createdAt: string;
  updatedAt: string;
}

interface UserData {
  _id: string;
  fullName: string;
  email: string;
  coverImage: string;
  image: string;
  role: string;
  emailVerified: boolean;
  banned: boolean;
  isOnline: boolean;
  posts: Post[];
  likes: any[];
  comments: string[];
  followers: string[];
  following: string[];
  notifications: Notification[];
  messages: any[];
  createdAt: string;
  updatedAt: string;
  username: string;
}

export default function UserProfile() {
  const { userId: profileUserId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<UserData | null>(null);
  const [introduction, setIntroduction] = useState('');
  const [titles, setTitles] = useState<string[]>([]);
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openPostModal = async (post: Post) => {
    try {
      const { data: fullPost } = await axiosInstance.get(`/posts/${post._id}`);

      setSelectedPost(fullPost);
      setIsModalOpen(true);
    } catch (error) {
      console.error('게시물 상세 불러오기 실패:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    console.log();
  };

  // --- 로그인한 사용자 관련 상태 ---
  const loggedInUserId = useAuthStore((state) => state.userId); // Zustand 스토어에서 가져온 로그인한 사용자의 ID
  const [loggedInUserFollowingIds, setLoggedInUserFollowingIds] = useState<
    string[]
  >([]); // 로그인한 사용자가 팔로우하는 ID 목록

  // --- 현재 프로필 사용자에 대한 팔로우 상태 ---
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!profileUserId) return; // userId가 없으면 fetchUser 함수 호출하지 않음
      try {
        const { data } = await axiosInstance.get(`/users/${profileUserId}`);
        setUser(data);
      } catch (error) {
        console.error('유저 데이터 불러오기 실패:', error);
        setUser(null); // 에러 시 null 처리
      }
    };
    fetchUserProfile();
  }, [profileUserId]);

  useEffect(() => {
    if (user?.username) {
      const match = user.username.match(/^(.*)\s?\[(.*)\]$/);
      const intro = match?.[1]?.trim() ?? user.username.trim();
      const parsedTitles =
        match?.[2]
          ?.split(',')
          .map((t) => t.trim())
          .filter((t) => t) ?? [];
      setIntroduction(intro);
      setTitles(parsedTitles.slice(0, 2)); // 최대 2개만 사용한다고 가정
    } else {
      setIntroduction('');
      setTitles([]);
    }
  }, [user]);

  const fetchLoggedInUserFollowing = async () => {
    try {
      const { data: loggedInData } = await axiosInstance.get(
        `/users/${loggedInUserId}`
      );
      if (loggedInData && Array.isArray(loggedInData.following)) {
        setLoggedInUserFollowingIds(
          loggedInData.following.map((followedUser: any) =>
            typeof followedUser === 'string' ? followedUser : followedUser._id
          )
        );
      } else {
        setLoggedInUserFollowingIds([]);
      }
    } catch (error) {
      console.error('로그인한 사용자 팔로잉 정보 가져오기 실패:', error);
      setLoggedInUserFollowingIds([]);
    }
  };

  // 3. 로그인한 사용자의 팔로잉 목록 가져오기
  useEffect(() => {
    if (loggedInUserId) {
      fetchLoggedInUserFollowing();
    } else {
      setLoggedInUserFollowingIds([]); // 로그아웃 상태면 빈 배열
    }
  }, [loggedInUserId]);

  // 4. 팔로우 상태 결정 (프로필 사용자 정보와 로그인한 사용자 팔로잉 목록 모두 필요)
  useEffect(() => {
    if (user?._id && loggedInUserId) {
      const localStorageKey = `follow-${loggedInUserId}-${user._id}`;
      const storedFollowStatus = localStorage.getItem(localStorageKey);

      if (storedFollowStatus !== null) {
        setIsFollowing(JSON.parse(storedFollowStatus));
      } else {
        // localStorage에 없으면, 가져온 팔로잉 목록으로 판단
        if (loggedInUserFollowingIds.length > 0 || !loggedInUserId) {
          // 목록이 있거나, 아예 로그아웃상태(판단위해)
          setIsFollowing(loggedInUserFollowingIds.includes(user._id));
        }
      }
    } else if (!loggedInUserId && user?._id) {
      // 로그인하지 않았으면 이 프로필을 팔로우하고 있을 수 없음
      setIsFollowing(false);
    }
  }, [user, loggedInUserId, loggedInUserFollowingIds]);

  // 팔로우 함수
  const followUser = async () => {
    if (!user || !loggedInUserId) {
      toast('사용자 정보가 없거나 로그인 상태가 아닙니다.');
      return;
    }
    const localStorageKey = `follow-${loggedInUserId}-${user._id}`;
    const previousIsFollowing = isFollowing;

    try {
      setIsFollowing(true);
      localStorage.setItem(localStorageKey, JSON.stringify(true));
      await axiosInstance.post('/follow/create', {
        userId: user._id, // 팔로우 대상 ID
      });
      toast(`${user.fullName}님을 팔로우합니다.`);
      await fetchLoggedInUserFollowing();
      // 필요하다면 팔로워 수 등을 업데이트하기 위해 user 상태를 다시 fetch 하거나 로컬에서 업데이트
      setLoggedInUserFollowingIds((prev) => [...prev, user._id]);
      setUser((prevUser) =>
        prevUser
          ? {
              ...prevUser,
              followers: [...prevUser.followers, loggedInUserId],
            }
          : prevUser
      );
      console.log(user.followers);
      console.log(loggedInUserFollowingIds);
      window.location.reload();

      // 예: setUser(prevUser => prevUser ? {...prevUser, followers: [...prevUser.followers, loggedInUserId]} : null);
      // 단, followers 배열의 정확한 타입과 백엔드 응답을 고려해야 함.
    } catch (error) {
      console.error('팔로우 실패:', error);
      toast.error(`${user.fullName}님 팔로우 실패.`);
      setIsFollowing(previousIsFollowing); // 실패 시 상태 복원
      localStorage.setItem(
        localStorageKey,
        JSON.stringify(previousIsFollowing)
      );
    }
  };

  // 언팔로우 함수
  const unFollowUser = async () => {
    if (!user || !loggedInUserId) {
      toast('사용자 정보가 없거나 로그인 상태가 아닙니다.');
      return;
    }
    const localStorageKey = `follow-${loggedInUserId}-${user._id}`;
    const previousIsFollowing = isFollowing;

    try {
      const commonId = user.followers.find(
        (followerId: { _id: string } | string) =>
          loggedInUserFollowingIds.includes(
            typeof followerId === 'string' ? followerId : followerId._id
          )
      );
      if (commonId) {
        const res = await axiosInstance.delete('/follow/delete', {
          data: { id: commonId },
        });
        toast(`${user.fullName}님을 언팔로우합니다.`);
        await fetchLoggedInUserFollowing();
        window.location.reload();
        console.log('언팔로우 결과:', res.data);
        setIsFollowing(false);
        // API가 팔로우 관계 ID를 요구하는지, 아니면 팔로우 대상의 userId를 요구하는지 확인 필요
        localStorage.setItem(localStorageKey, JSON.stringify(false));
        // 필요하다면 팔로워 수 등을 업데이트
        setLoggedInUserFollowingIds((prev) =>
          prev.filter((id) => id !== user._id)
        );
        setUser((prevUser) =>
          prevUser
            ? {
                ...prevUser,
                followers: prevUser.followers.filter((id) => {
                  const targetId =
                    typeof id === 'string' ? id : (id as any)._id;
                  return targetId !== loggedInUserId;
                }),
              }
            : prevUser
        );
        //   // 예: setUser(prevUser => prevUser ? {...prevUser, followers: prevUser.followers.filter(id => id !== loggedInUserId)} : null);
      } else {
        toast('팔로우 관계가 없습니다.');
      }
    } catch (error) {
      console.error('언팔로우 실패:', error);
      toast.error(`${user.fullName}님 언팔로우 실패.`);
      setIsFollowing(previousIsFollowing); // 실패 시 상태 복원
      localStorage.setItem(
        localStorageKey,
        JSON.stringify(previousIsFollowing)
      );
    }
  };

  // 팔로우/언팔로우 버튼 클릭 핸들러
  const handleFollow = async () => {
    if (!loggedInUserId) {
      // 실제 로그인한 사용자 ID 유무로 판단
      toast('로그인을 진행해주세요');
      navigate('/login');
      return;
    }
    if (!user) {
      // 프로필 사용자 정보가 로드되었는지 확인
      toast('프로필 정보를 불러오는 중입니다.');
      return;
    }

    if (isFollowing) {
      await unFollowUser();
    } else {
      await followUser();
    }
  };

  if (!user) {
    return <Loading />;
  }

  const tagFields = [
    { label: '제주 중독', icon: Jeju },
    { label: '밥보단 커피', icon: Cafe },
    { label: '김정호..?', icon: KoreaPin },
    { label: '1박 2일 애호가', icon: Star },
    { label: '낭만가', icon: Train },
    { label: 'Power J', icon: PowerJ },
    { label: '산타아저씨', icon: Hiking },
    { label: '혼자서도 잘해요', icon: Alone },
    { label: '한달살이 경험자', icon: House },
  ];

  return (
    <div className="w-full max-w-[1100px] mx-auto p-4 mt-[55px]">
      {/* 상단 프로필 영역 */}
      <div className="flex flex-wrap md:flex-nowrap items-start gap-5">
        {/* 프로필 사진 */}
        <div className="w-[170px] h-[170px] rounded-full overflow-hidden">
          <img
            src={user.image || profile}
            alt="프로필 사진"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 태그, 소개글 */}
        <div className="w-[365px] pl-10">
          <div className="flex items-center gap-3 mb-8">
            {titles.map((title, index) => {
              const tag = tagFields.find((tag) => tag.label === title);

              return (
                <Button
                  key={index}
                  className="w-[174px] h-[40px] px-3 py-1 rounded-[19px] text-sm relative font-bold border border-[#434343] bg-[var(--color-tag-bg)]"
                >
                  {tag?.icon && (
                    <img
                      src={tag.icon}
                      alt={`${title} 아이콘`}
                      className="w-7 h-7 absolute left-3 top-1/2 -translate-y-1/2 "
                    />
                  )}
                  <span className="ml-5 text-[var(--color-tag-text)]">
                    {title}
                  </span>
                </Button>
              );
            })}
          </div>

          <h2 className="text-[45px] mb-2 font-bold text-[var(--color-profile-text)]">
            {user.fullName}
          </h2>
          <p className="text-[20px] text-[var(--color-profile-text)]">
            {introduction}
          </p>
        </div>

        {/* 팔로워숫자 및 내 정보 수정 */}
        <div className="flex flex-col gap-2 w-[273px] ml-28 text-[var(--color-profile-text)]">
          <div className="flex justify-between w-full ">
            <div className=" h-[33px] flex flex-col text-[20px]  font-semibold">
              <span className="text-left">게시글</span>
              <span className="text-center">{user.posts.length}</span>
            </div>

            <div className=" h-[33px] flex flex-col items-center text-[20px] font-semibold">
              <span>팔로워</span>
              <span>{user.followers.length}</span>
            </div>

            <div className=" h-[33px] flex flex-col items-center text-[20px] font-semibold">
              <span className="text-right">팔로잉</span>
              <span>{user.following.length}</span>
            </div>
          </div>
          <div className="flex mt-20">
            <div className="flex gap-2">
              <Button
                className="h-[45px] min-w-[273px] bg-[#75BFFF] text-white text-[15px] font-semibold flex items-center justify-center px-3 rounded-[10px]
                hover:bg-[var(--color-main-skyBlue-hover)] hover:scale-[1.02]"
                onClick={handleFollow}
              >
                {isFollowing ? '언팔로우' : '팔로우+'}{' '}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <hr className="mt-8 mb-10 border-gray-300" />

      {/* 글쓰기목록 영역(임시로 둔 영역 글 목록 넣어줘야함) */}
      <div className="flex flex-wrap">
        {user.posts.map((post) => (
          <div
            key={post._id}
            className="w-1/5 aspect-square relative group bg-cover bg-center rounded-md cursor-pointer mr-[10px] mb-[10px]"
            style={{ backgroundImage: `url(${post.image})` }}
            onClick={() => openPostModal(post)}
          >
            <div className="w-[111px] h-[24px] absolute bottom-3 right-1 flex gap-3 text-white opacity-0 group-hover:opacity-100 group-hover:visible invisible">
              <div className="flex items-center gap-1">
                <img
                  src={testLike}
                  alt="좋아요"
                  className="w-[24px] h-[24px]"
                />
                <span className="text-sm font-bold text-[10px]">
                  {post.likes.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <img src={testFoot} alt="댓글" className="w-[24px] h-[24px]" />
                <span className="text-sm font-bold text-[10px]">
                  {post.comments.length}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={closeModal}
          user={{
            _id: user._id,
            fullName: user.fullName,
            image: user.image,
          }}
          isMyProfile={false}
        />
      )}
    </div>
  );
}
