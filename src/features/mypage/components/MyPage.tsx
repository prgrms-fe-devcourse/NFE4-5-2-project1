import { useEffect, useRef, useState } from "react";
import defaultProfileLogo from "../../../assets/images/default-profile-logo.svg";
import cameraIcon from "../../../assets/images/camera-icon.png";
import BackButton from "../../../components/common/BackButton";
import {
  deleteUser,
  logoutUser,
  myPageDeletePhoto,
  myPageUpdatePhoto,
  myPageUserInfo,
  myPageUserInfoUpdate,
} from "../../../apis/mypage/myPage";
import { useNavigate } from "react-router";
import { getSpotifyAccessToken } from "../../../apis/spotify/getSpotifyAccessToken";
import { searchArtist } from "../../../apis/spotify/spotifySearch";
import CheckPassword from "./CheckPassword";
import ActionModal from "../../../components/common/ActionModal";
import { useAuthStore } from "../../../stores/authStore";
import ForwardButton from "../../../components/common/ForwardButton";

export default function MyPage() {
  const genres = [
    "Country",
    "Hip-hop",
    "POP",
    "Rock",
    "EDM",
    "Jazz",
    "R&B",
    "Indie",
    "alternative",
  ];
  const navigate = useNavigate();

  const [checkPassword, setCheckPassword] = useState<"view" | "check-password">(
    "view"
  );

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [favoriteArtist, setFavoriteArtist] = useState("");
  const [favoriteGenre, setFavoriteGenre] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [storedUserId, setStoredUserId] = useState("");

  const [initialUserData, setInitialUserData] = useState({
    username: "",
    favoriteArtist: "",
    favoriteGenre: "",
  });

  const useDebounce = (value: string, delay: number) => {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
      const timer = setTimeout(() => setDebounced(value), delay);
      return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
  };

  const [editMode, setEditMode] = useState(false);
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);
  const genreSelectRef = useRef<HTMLDivElement>(null);

  const [userNameError, setuserNameError] = useState("");
  const userNameRef = useRef<HTMLInputElement>(null);
  const [mainProfileName, setMainProfileName] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const debouncedArtist = useDebounce(favoriteArtist, 300);
  const isSelectingRef = useRef(false);
  const [artistSuggestions, setArtistSuggestions] = useState<string[]>([]);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const [showModal, setShowModal] = useState(false);

  const logout = useAuthStore.getState().logout;

  const [showImageDropdown, setShowImageDropdown] = useState(false);

  useEffect(() => {
    const fetchArtistSuggestions = async () => {
      if (!editMode) return;
      if (isSelectingRef.current) {
        isSelectingRef.current = false;
        return;
      }
      if (!debouncedArtist.trim()) return;
      try {
        const token = await getSpotifyAccessToken();
        const results = await searchArtist(debouncedArtist, token);
        const simplified = results.map(
          (artist: { name: string }) => artist.name
        );
        setArtistSuggestions(simplified);
      } catch (e) {
        console.error("아티스트 검색 실패:", e);
      }
    };
    fetchArtistSuggestions();
  }, [debouncedArtist]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await myPageUserInfo();
        const parsed = JSON.parse(user.fullName);
        const data = {
          username: parsed.name,
          favoriteGenre: parsed.favoriteGenre,
          favoriteArtist: parsed.favoriteArtist,
          email: user.email,
        };
        setInitialUserData(data);

        setUsername(parsed.name);
        setMainProfileName(parsed.name);
        setFavoriteGenre(parsed.favoriteGenre);
        setFavoriteArtist(parsed.favoriteArtist);
        setEmail(user.email);

        setStoredUserId(user._id);

        if (user.image) {
          setImageUrl(user.image);
        }
      } catch (e) {
        console.error("유저 정보 가져오기 실패:", e);
      }
    };
    fetchUserInfo();
  }, []);

  const handleUpdate = async () => {
    if (!username.trim()) {
      setuserNameError("사용자 이름을 입력해주세요.");
      userNameRef.current?.focus();
      return;
    }

    setuserNameError("");

    try {
      await myPageUserInfoUpdate(username, favoriteGenre, favoriteArtist);

      setMainProfileName(username);

      setEditMode(false);
      setInitialUserData({
        username,
        favoriteArtist,
        favoriteGenre,
      });
    } catch (err) {
      console.error("유저 정보 저장 실패:", err);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await myPageUpdatePhoto(file);

      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl);
    } catch (err) {
      console.error("이미지 업로드 실패:", err);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    logout();
    navigate("/login");
  };

  const handleDelete = async () => {
    try {
      await deleteUser(storedUserId);
      setShowModal(false);
      localStorage.removeItem("app_state");
      navigate("/login");
    } catch (error) {
      console.error("탈퇴 중 오류 발생:", error);
    }
  };

  const handleResetProfileImage = async () => {
    try {
      await myPageDeletePhoto();
      setImageUrl("");
    } catch (e) {
      console.error("기본 이미지 변경 실패:", e);
    } finally {
      setShowImageDropdown(false);
    }
  };

  return (
    <div className="mt-16 md:mt-0 w-[80%] lg:w-[800px] xl:w-[1080px] min-h-screen text-[color:var(--white)] flex flex-col items-center py-10 ">
      <div className="w-full flex justify-between items-center mb-4">
        <BackButton from={-1} />
        <ForwardButton
          to="/postsbyuser"
          label="작성 글 보기"
          state={{ authorId: storedUserId, username: username }}
        />
      </div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      <div className="flex flex-col items-center w-full max-w-32">
        <div className="relative w-[80px] h-[80px] lg:w-32 lg:h-32 aspect-square mt-8">
          <img
            src={imageUrl || defaultProfileLogo}
            alt="프로필 사진"
            className="w-full h-full max-h-32 rounded-full object-cover"
          />
          {editMode && (
            <div className="absolute bottom-0 right-0 translate-x-3 translate-y-3">
              <div
                onClick={() => setShowImageDropdown((prev) => !prev)}
                className="w-6 h-6 lg:w-10 lg:h-10 bg-[color:var(--primary-200)] rounded-full flex items-center justify-center cursor-pointer relative z-10"
              >
                <img src={cameraIcon} alt="카메라 아이콘" />
              </div>

              {showImageDropdown && (
                <ul className="absolute bottom-[-100px] right-0 w-[160px] bg-[color:var(--grey-600)] text-[color:var] rounded-[10px] shadow z-20 text-sm">
                  <li
                    className="px-4 py-2 hover:bg-[color:var(--grey-500)] cursor-pointer rounded-tl-[10px] rounded-tr-[10px]"
                    onClick={() => {
                      handleResetProfileImage();
                      setShowImageDropdown(false);
                    }}
                  >
                    기본 이미지로 변경
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-[#444] cursor-pointer rounded-bl-[10px] rounded-br-[10px]"
                    onClick={() => {
                      fileInputRef.current?.click();
                      setShowImageDropdown(false);
                    }}
                  >
                    사진 업로드
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
        <p className="mt-[32px] text-[24px] md:text-[32px] font-semibold text-center">
          {mainProfileName}
        </p>
      </div>

      <div className="mt-[40px] w-full mx-auto bg-[#333333]/[0.35] rounded-[30px] pt-[40px] md:pt-[80px] px-10 md:px-20 flex flex-col">
        {checkPassword === "view" ? (
          <>
            <div className=" grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4 md:gap-x-12 md:gap-y-0 md:mb-12">
              <div className="flex flex-col gap-4 ">
                <div className="flex justify-between items-center">
                  <label htmlFor="username" className="text-lg">
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
                  className="w-full px-4 py-2 rounded-[10px] border border-[color:var(--white-80)] bg-transparent text-[16px] cursor-not-allowed text-[color:var(--grey-500)]"
                />
              </div>

              <div className="flex flex-col gap-4 ">
                <div className="flex justify-between items-center">
                  <label htmlFor="username" className="text-lg">
                    사용자 이름
                  </label>
                  {userNameError && (
                    <span className="text-[14px] text-[color:var(--red)]">
                      {userNameError}
                    </span>
                  )}
                </div>
                <input
                  id="username"
                  ref={userNameRef}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (userNameError) setuserNameError("");
                  }}
                  placeholder="user name"
                  disabled={!editMode}
                  className={`w-full h-10 px-4 rounded-[10px] text-[16px] border ${
                    userNameError
                      ? "border-[color:var(--red)] focus:border-[color:var(--red)]"
                      : "border-[color:var(--white-80)] focus:border-[color:var(--primary-200)]"
                  } bg-transparent focus:outline-none`}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4 md:gap-x-12 md:gap-y-0 md:mb-[48px]">
              <div
                className="relative flex flex-col gap-4 w-full"
                ref={suggestionsRef}
              >
                <label htmlFor="favoriteArtist" className="text-lg">
                  좋아하는 가수 (선택)
                </label>
                <input
                  type="text"
                  id="favoriteArtist"
                  value={favoriteArtist}
                  onChange={(e) => setFavoriteArtist(e.target.value)}
                  disabled={!editMode}
                  className={
                    "w-full h-[40px] px-4 text-left text-[16px] flex items-center rounded-[10px] border " +
                    (editMode ? "cursor-text " : "pointer-events-none ") +
                    (artistSuggestions.length > 0
                      ? "border-[color:var(--primary-200)] "
                      : "border-[color:var(--white-80)] ") +
                    "focus:border-[color:var(--primary-200)] focus:outline-none"
                  }
                />

                {editMode && artistSuggestions.length > 0 && (
                  <ul className="absolute top-full left-0 right-0 mt-1 border rounded-[10px] bg-[color:var(--bg-color)] shadow z-10 max-h-60 overflow-y-auto border-[color:var(--primary-200)]">
                    {artistSuggestions.map((name, index) => (
                      <li
                        key={`${name}-${index}`}
                        onMouseDown={() => {
                          isSelectingRef.current = true;
                          setFavoriteArtist(name);
                          setArtistSuggestions([]);
                        }}
                        className="px-4 py-[10px] text-[14px] hover:bg-[color:var(--grey-600)] hover:text-white cursor-pointer transition-colors duration-100"
                      >
                        {name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div
                className="flex flex-col gap-4 relative"
                ref={genreSelectRef}
              >
                <label htmlFor="favoriteGenre" className="text-lg">
                  좋아하는 장르 (선택)
                </label>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    editMode && setGenreDropdownOpen((prev) => !prev)
                  }
                  onBlur={() =>
                    setTimeout(() => setGenreDropdownOpen(false), 100)
                  }
                  className={`w-full h-[40px] px-4 text-left text-[16px] flex items-center rounded-[10px] border ${
                    editMode ? "cursor-pointer" : "pointer-events-none "
                  } ${
                    genreDropdownOpen
                      ? "border-[color:var(--primary-200)]"
                      : "border-[color:var(--white-80)]"
                  }`}
                >
                  {favoriteGenre || "선택하세요"}
                </div>
                {genreDropdownOpen && (
                  <ul className="absolute top-full left-0 right-0 mt-1 border rounded-[10px] bg-[color:var(--bg-color)] shadow z-10 max-h-60 overflow-y-auto border-[color:var(--primary-200)]">
                    {genres.map((genre) => (
                      <li
                        key={genre}
                        onMouseDown={() => {
                          setFavoriteGenre(genre);
                          setGenreDropdownOpen(false);
                        }}
                        className="px-4 py-[10px] text-[14px] hover:bg-[color:var(--grey-600)] hover:text-white cursor-pointer transition-colors duration-100"
                      >
                        {genre}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="flex justify-center gap-4 mb-[40px]">
              {editMode ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setUsername(initialUserData.username);
                      setFavoriteArtist(initialUserData.favoriteArtist);
                      setFavoriteGenre(initialUserData.favoriteGenre);
                      setEditMode(false);
                    }}
                    className="px-10 py-3 rounded-[30px] border border-[color:var(--grey-400)] text-[color:var(--grey-100)] font-bold cursor-pointer"
                  >
                    취소하기
                  </button>

                  <button
                    type="submit"
                    onClick={() => handleUpdate()}
                    className="px-10 py-3 rounded-[30px] bg-[color:var(--primary-200)] text-[color:var(--bg-color)] font-bold cursor-pointer"
                  >
                    저장하기
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-10 py-3 rounded-[30px] bg-[color:var(--primary-200)] text-[color:var(--bg-color)] font-bold cursor-pointer"
                >
                  수정하기
                </button>
              )}
            </div>{" "}
          </>
        ) : (
          <CheckPassword
            email={email}
            onCheckPassword={() => setCheckPassword("view")}
          />
        )}
      </div>

      <div className="mt-[80px] w-[324px] h-[21px] flex items-center justify-center text-[18px] pb-10">
        {!email.includes("@kakao.com") && (
          <>
            <button
              onClick={() => setCheckPassword("check-password")}
              className="hover:underline cursor-pointer text-sm text-[color:var(--white-80)]"
            >
              비밀번호 변경
            </button>
            <span className="px-3">|</span>
          </>
        )}
        <button
          onClick={handleLogout}
          className="hover:underline cursor-pointer text-sm text-[color:var(--white-80)]"
        >
          로그아웃
        </button>
        <span className="px-3">|</span>
        <button
          onClick={() => setShowModal(true)}
          className="hover:underline cursor-pointer text-[color:var(--red)] text-sm"
        >
          회원 탈퇴
        </button>
        {showModal && (
          <ActionModal
            modalMessage={`정말로 회원 탈퇴하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`}
            onCancel={() => setShowModal(false)}
            onConfirmAction={handleDelete}
            confirmButtonText="탈퇴하기"
          />
        )}
      </div>
    </div>
  );
}
