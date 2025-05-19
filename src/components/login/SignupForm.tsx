import {useState, useEffect, useRef} from "react";
import loginGroup from "../../assets/images/login-group.svg";
import logoPopcon from "../../assets/images/logo-login-popcon.svg";
import {signupUser} from "../../apis/login/login";
import {searchArtist} from "../../apis/spotify/spotifySearch";
import {getSpotifyAccessToken} from "../../apis/spotify/getSpotifyAccessToken";
import {Link, useNavigate} from "react-router";
import axios from "axios";

const genres = ["Country", "Hip-hop", "POP", "Rock", "EDM", "Jazz", "R&B", "Indie", "alternative"];
const allowedDomains = ["gmail.com", "naver.com"];

const useDebounce = (value: string, delay: number) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [favoriteArtist, setFavoriteArtist] = useState("");
  const [favoriteGenre, setFavoriteGenre] = useState(genres[0]);
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);

  const [artistSuggestions, setArtistSuggestions] = useState<string[]>([]);
  const debouncedArtist = useDebounce(favoriteArtist, 300);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const isSelectingRef = useRef(false);
  const genreSelectRef = useRef<HTMLDivElement>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [shouldFocus, setShouldFocus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setArtistSuggestions([]);
      }
      if (genreSelectRef.current && !genreSelectRef.current.contains(e.target as Node)) {
        setGenreDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchArtistSuggestions = async () => {
      if (isSelectingRef.current) {
        isSelectingRef.current = false;
        return;
      }
      if (!debouncedArtist.trim()) return;
      try {
        const token = await getSpotifyAccessToken();
        const results = await searchArtist(debouncedArtist, token);
        const simplified = results.map((artist: {name: string}) => artist.name);
        setArtistSuggestions(simplified);
      } catch (e) {
        console.error("아티스트 검색 실패:", e);
      }
    };
    fetchArtistSuggestions();
  }, [debouncedArtist]);

  useEffect(() => {
    if (isSubmitted) {
      setShouldFocus(true);
    }
  }, [isSubmitted]);

  useEffect(() => {
    if (!isSubmitted || !shouldFocus) return;

    const timer = setTimeout(() => {
      if (nameError) nameRef.current?.focus();
      else if (emailError) emailRef.current?.focus();
      else if (passwordError) passwordRef.current?.focus();
      else if (confirmPasswordError) confirmPasswordRef.current?.focus();

      setShouldFocus(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [isSubmitted, shouldFocus, nameError, emailError, passwordError, confirmPasswordError]);

  const validateSignupForm = (): boolean => {
    let valid = true;

    if (!name.trim()) {
      setNameError("이름/닉네임을 입력해주세요.");
      valid = false;
    } else setNameError("");

    if (!email.trim()) {
      setEmailError("이메일을 입력해주세요.");
      valid = false;
    } else if (!allowedDomains.includes(email.split("@")[1])) {
      setEmailError("도메인을 확인해 주세요.");
      valid = false;
    } else if (!emailError) {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("비밀번호를 입력해주세요.");
      valid = false;
    } else setPasswordError("");

    if (!confirmPassword) {
      setConfirmPasswordError("확인란을 입력해주세요.");
      valid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("비밀번호가 불일치 합니다.");
      valid = false;
    } else setConfirmPasswordError("");

    return valid;
  };

  const handleSignup = async () => {
    const isValid = validateSignupForm();

    setIsSubmitted(true);

    if (!isValid) {
      setShouldFocus(false);
      setTimeout(() => {
        setShouldFocus(true);
      }, 0);
      return;
    }

    try {
      await signupUser(name, email, password, favoriteGenre, favoriteArtist);
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        setEmailError("중복된 메일 입니다.");
      } else {
        console.error("회원가입 오류:", error);
      }
    }
  };

  return (
    <div className='h-[calc(100vh-68px)] w-full flex flex-col md:flex-row overflow-visible md:overflow-hidden mt-25 md:mt-3'>
      <div className='w-full h-[400px] md:h-full md:w-[50%] bg-[color:var(--bg-color)] relative'>
        <div className='flex items-center justify-center h-full pb-8 md:pb-0 '>
          <img
            src={loginGroup}
            alt='캐릭터'
            className='md:w-[70%] w-[40%] max-w-[500px] object-contain'
          />
        </div>
      </div>

      <div className='w-full md:w-[50%] bg-[color:var(--grey-600)] flex items-center justify-center'>
        <div className='w-[80%] max-w-[700px] mt-6'>
          <h2 className='text-[color:var(--white)]] text-xl font-bold mb-8'>SIGN UP</h2>

          <div className='flex items-center justify-between mb-2'>
            <label className='text-[color:var(--white)]'>이름/닉네임</label>
            {isSubmitted && nameError && <p className='text-[var(--red)] text-sm'>{nameError}</p>}
          </div>
          <input
            type='text'
            ref={nameRef}
            placeholder='popcon'
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (e.target.value.trim()) {
                setNameError("");
              }
            }}
            className={`w-full mb-3 px-4 py-2 rounded-[10px] border ${
              nameError ? "border-[color:var(--red)]" : "border-[color:var(--white)]"
            } focus:outline-none focus:border-[color:var(--primary-200)]`}
          />

          <div className='flex items-center justify-between mb-2'>
            <label className='text-[color:var(--white)]'>이메일</label>
            {isSubmitted && emailError && (
              <p className='text-sm text-[color:var(--red)]'>{emailError}</p>
            )}
          </div>
          <input
            type='email'
            ref={emailRef}
            placeholder='user@email.com'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (e.target.value.trim() && emailError) {
                setEmailError("");
              }
            }}
            className={`w-full mb-3 px-4 py-2 rounded-[10px] border ${
              emailError ? "border-[color:var(--red)]" : "border-[color:var(--white)]"
            } focus:outline-none focus:border-[color:var(--primary-200)]`}
          />

          <div className='flex items-center justify-between mb-2'>
            <label className='text-[color:var(--white)]'>비밀번호</label>
            {isSubmitted && passwordError && (
              <p className='text-sm text-[color:var(--red)]'>{passwordError}</p>
            )}
          </div>
          <input
            type='password'
            ref={passwordRef}
            placeholder='Your password'
            value={password}
            onChange={(e) => {
              const value = e.target.value;
              setPassword(value);
              if (value.trim()) {
                setPasswordError("");
              }
              if (confirmPassword) {
                if (value === confirmPassword) {
                  setConfirmPasswordError("");
                } else {
                  setConfirmPasswordError("비밀번호 불일치");
                }
              }
            }}
            className={`w-full mb-3 px-4 py-2 rounded-[10px] border ${
              passwordError ? "border-[color:var(--red)]" : "border-[color:var(--white)]"
            } focus:outline-none focus:border-[color:var(--primary-200)]`}
          />

          <div className='flex items-center justify-between mb-2'>
            <label className='text-[color:var(--white)]'>비밀번호 확인</label>
            {confirmPasswordError && (
              <p className='text-[color:var(--red)] text-sm'>{confirmPasswordError}</p>
            )}
          </div>
          <input
            type='password'
            ref={confirmPasswordRef}
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => {
              const value = e.target.value;
              setConfirmPassword(value);

              if (!value) {
                setConfirmPasswordError("비밀번호 확인을 입력해주세요.");
              } else if (value !== password) {
                setConfirmPasswordError("비밀번호 불일치");
              } else {
                setConfirmPasswordError("");
              }
            }}
            className={`w-full mb-3 px-4 py-2 rounded-[10px] border ${
              confirmPasswordError ? "border-[color:var(--red)]" : "border-[color:var(--white)]"
            } focus:outline-none focus:border-[color:var(--primary-200)]`}
          />

          <div className='flex flex-col gap-3 md:flex-row md:gap-6'>
            <div className='w-full md:w-1/2 relative' ref={suggestionsRef}>
              <label className='block mb-2 text-[color:var(--white)]'>좋아하는 가수 (선택)</label>
              <input
                type='text'
                placeholder='Lauv'
                value={favoriteArtist}
                onChange={(e) => setFavoriteArtist(e.target.value)}
                className='w-full h-10 px-4 rounded-[10px] border border-[color:var(--white)] bg-[color:var(--grey-600)] text-[color:var(--white)] focus:border-[color:var(--primary-300)] focus:outline-none'
              />
              {artistSuggestions.length > 0 && (
                <ul className='absolute mt-1 bg-[color:var(--grey-600)] border border-[color:var(--primary-300)] text-[color:var(--white)] rounded-[10px] w-full max-h-[100px] overflow-y-auto z-30'>
                  {artistSuggestions.map((name, index) => (
                    <li
                      key={`${name}-${index}`}
                      onMouseDown={() => {
                        isSelectingRef.current = true;
                        setFavoriteArtist(name);
                        setArtistSuggestions([]);
                      }}
                      className='px-4 py-2 hover:bg-[color:var(--primary-300)] hover:text-[color:var(--grey-600)] cursor-pointer'
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className='w-full md:w-1/2 relative' ref={genreSelectRef}>
              <label className='block mb-2 text-[color:var(--white)]'>좋아하는 장르</label>
              <div
                role='button'
                tabIndex={0}
                onFocus={() => setGenreDropdownOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setGenreDropdownOpen((prev) => !prev);
                  }
                }}
                className={`w-full h-10 px-4 text-left border bg-[color:var(--grey-600)] text-[color:var(--white)] rounded-[10px] flex items-center cursor-pointer focus:outline-none ${
                  genreDropdownOpen
                    ? "border-[color:var(--primary-300)]"
                    : "border-[color:var(--white)]"
                }`}
              >
                {favoriteGenre}
              </div>
              {genreDropdownOpen && (
                <ul className='overflow-scroll [&::-webkit-scrollbar]:hidden absolute mt-1 w-full max-h-[100px] bg-[color:var(--grey-600)] border border-[color:var(--primary-300)] rounded-[10px] z-10'>
                  {genres.map((genre) => (
                    <li
                      key={genre}
                      onMouseDown={() => {
                        setFavoriteGenre(genre);
                        setGenreDropdownOpen(false);
                      }}
                      className='px-4 py-2 hover:bg-[color:var(--primary-300)]  hover:text-[color:var(--grey-600)] cursor-pointer '
                    >
                      {genre}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <button
            onClick={handleSignup}
            className='w-full bg-[color:var(--primary-300)] text-[color:var(--bg-color)] py-2 rounded-md font-semibold mb-2 flex items-center justify-center mt-5 cursor-pointer'
          >
            <img src={logoPopcon} alt='팝콘로고' className='mr-2' />
            팝콘 회원가입
          </button>

          <p className='text-sm text-[color:var(--white)] mt-8 mb-6'>
            Already have an account?{" "}
            <Link to='/Login' className='text-[color:var(--primary-300)] underline'>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
