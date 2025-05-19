import { useEffect, useState } from "react";
import { useParams } from "react-router";
import defaultProfileLogo from "../../../assets/images/default-profile-logo.svg";
import BackButton from "../../../components/common/BackButton";
import { getUserDetail } from "../../../apis/mypage/userDetail";
import { useNavigate } from "react-router";
import ForwardButton from "../../../components/common/ForwardButton";

export default function UserDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [favoriteArtist, setFavoriteArtist] = useState("");
  const [favoriteGenre, setFavoriteGenre] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const user = await getUserDetail(userId!);
        if (!user || !user.email) {
          navigate("/404-not-found");
          return;
        }

        const parsed = JSON.parse(user.fullName);

        setUsername(parsed.name);
        setFavoriteArtist(parsed.favoriteArtist);
        setFavoriteGenre(parsed.favoriteGenre);
        setEmail(user.email);
        setImageUrl(user.image);
      } catch (error) {
        console.error("유저 정보 조회 실패:", error);
      }
    };

    fetchUserDetail();
  }, [userId]);

  return (
    <div className="min-h-screen text-[color:var(--white)] flex flex-col items-center py-10 px-4">
      <div className="w-full flex justify-between items-center mb-4">
        <BackButton from={-1} />
        <ForwardButton
          to="/postsbyuser"
          label="작성 글 보기"
          state={{ authorId: userId as string, username: username }}
        />
      </div>

      <div className="flex flex-col items-center w-full max-w-[240px]">
        <div className="relative w-full aspect-square mt-[32px]">
          <img
            src={imageUrl || defaultProfileLogo}
            alt="프로필 사진"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <p className="mt-[32px] text-[24px] md:text-[32px] font-semibold text-center">
          {username}
        </p>
      </div>

      <div className="mt-[40px] w-full max-w-[1049px] mx-auto bg-[#333333]/[0.35] rounded-[30px] pt-[40px] md:pt-[80px] px-4 md:px-[120px] flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4 md:gap-x-12 md:gap-y-0 md:mb-[48px]">
          <div className="flex flex-col gap-4">
            <label htmlFor="username" className="font-semibold">
              사용자 이름
            </label>
            <input
              id="username"
              value={username}
              placeholder="user name"
              disabled
              className="w-full h-10 px-4 rounded-[10px] text-[16px] border border-[color:var(--white-80)] bg-transparent text-white focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-4 ">
            <div className="flex justify-between items-center">
              <label htmlFor="username" className="font-semibold">
                이메일
              </label>
            </div>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              disabled
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-[10px] border border-[color:var(--white-80)] bg-transparent text-white text-[16px] cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4 md:gap-x-12 md:gap-y-0 md:mb-[48px]">
          <div className="flex flex-col gap-4">
            <label
              htmlFor="favoriteArtist"
              className="text-[16px] font-semibold"
            >
              좋아하는 가수 (선택)
            </label>
            <input
              type="text"
              id="favoriteArtist"
              placeholder="Lauv"
              value={favoriteArtist}
              disabled
              className="w-full h-[40px] px-4 text-left text-[16px] flex items-center rounded-[10px] border border-[color:var(--white-80)] bg-transparent text-white focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-4">
            <label
              htmlFor="favoriteGenre"
              className="text-[16px] font-semibold"
            >
              좋아하는 장르 (선택)
            </label>
            <input
              type="text"
              id="favoriteGenre"
              placeholder="Rock"
              value={favoriteGenre}
              disabled
              className="w-full h-[40px] px-4 text-left text-[16px] flex items-center rounded-[10px] border border-[color:var(--white-80)] bg-transparent text-white focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
