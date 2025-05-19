// import Button from "../components/button";
import profile from '../assets/images/profile.svg';
// import profile2 from '../assets/images/프로필사진 테스트.svg';
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
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import Post from '../components/channel/Post';
import PostModal from '../components/PostModal';
// import { useParams } from 'react-router-dom'

interface Post {
  _id: string;
  title: string;
  image: string;
  imagePublicId: string;
  channel: string;
  author: {
    _id: string;
    fullName: string;
    image: string;
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
  followers: any[];
  following: any[];
  notifications: Notification[];
  messages: any[];
  createdAt: string;
  updatedAt: string;
  username: string;
}

export default function MyProfile() {
  const userId = useAuthStore((state) => state.userId);
  const [user, setUser] = useState<UserData | null>(null);
  const [introduction, setIntroduction] = useState('');
  const [titles, setTitles] = useState<string[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

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
  };

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/profileedit');
  };

  useEffect(() => {
    if (user) {
      setPosts(user.posts);
    }
  }, [user]);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const { data } = await axiosInstance.get(`/users/${userId}`);
        setUser(data);
      } catch (err) {
        console.log('유저 정보 가져오기 실패:', err);
      }
    };

    fetchUser();
  }, [userId]);

  useEffect(() => {
    if (user?.username) {
      const match = user.username.match(/^(.*)\s?\[(.*)\]$/);
      const intro = match?.[1] ?? user.username;
      const parsedTitles = match?.[2]?.split(',').map((t) => t.trim()) ?? [];

      setIntroduction(intro);
      setTitles(parsedTitles.slice(0, 2)); // 최대 2개만 사용한다고 가정
    }
  }, [user]);

  if (!user) return <Loading />;

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
                  className="w-[174px] h-[31px] text-black px-3 py-1 rounded-[19px] text-sm relative font-bold border border-[#434343] bg-[var(--color-tag-bg)]"
                >
                  {tag?.icon && (
                    <img
                      src={tag.icon}
                      alt={`${title} 아이콘`}
                      className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"
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
        <div className="flex flex-col gap-2 w-[273px] ml-28">
          <div className="flex justify-between w-full text-[var(--color-profile-text)]">
            <div className=" h-[33px] flex flex-col text-[20px]  font-semibold">
              <span className="text-left">게시글</span>
              <span className="text-center">{user.posts.length}</span>
            </div>

            <div className=" h-[33px] flex flex-col items-center text-[20px]  font-semibold">
              <span>팔로워</span>
              <span>{user.followers.length}</span>
            </div>

            <div className=" h-[33px] flex flex-col items-center text-[20px] font-semibold">
              <span className="text-right">팔로잉</span>
              <span>{user.following.length}</span>
            </div>
          </div>

          <div className="flex mt-20">
            <Button
              className="w-[273px] h-[45px] bg-[#59A9E3] text-white px-5 py-2 rounded-[10px] text-[15px] font-semibold"
              onClick={handleClick}
            >
              내 정보 수정하기
            </Button>
          </div>
        </div>
      </div>

      <hr className="mt-8 mb-10 border-gray-300" />

      {/* 글쓰기목록 영역(임시로 둔 영역 글 목록 넣어줘야함) */}
      <div className="flex flex-wrap">
        {posts.map((post) => (
          <div
            key={post._id}
            className="w-1/5 aspect-square relative group bg-cover bg-center rounded-md cursor-pointer mr-[10px] mb-[10px]"
            style={{ backgroundImage: `url(${post.image})` }}
            onClick={() => openPostModal(post)}
          >
            <div className="w-[111px] h-[24px] absolute bottom-3 right-0 flex gap-5 text-white opacity-0 group-hover:opacity-100 group-hover:visible invisible">
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
          onSaved={(updatedPost) => {
            setPosts((prev) =>
              prev.map((p) =>
                p._id === updatedPost._id
                  ? {
                      ...updatedPost,
                      imagePublicId: p.imagePublicId ?? '',
                    }
                  : p
              )
            );
          }}
          user={{
            _id: user._id,
            fullName: user.fullName,
            image: user.image,
          }}
          isMyProfile={true}
        />
      )}
    </div>
  );
}
