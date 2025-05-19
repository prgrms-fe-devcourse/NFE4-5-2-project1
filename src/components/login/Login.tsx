import {useEffect, useRef, useState} from "react";
import loginGroup from "../../assets/images/login-group.svg";
import logoPopcon from "../../assets/images/logo-login-popcon.svg";
import logoKakao from "../../assets/images/logo-kakao.svg";
import {Link, useNavigate} from "react-router";
import {loginUser, signupUser} from "../../apis/login/login";
import {initKakaoSdk, loadKakaoSdk, loginWithKakao} from "../../apis/login/socialLogin";
import axios from "axios";
import {useAuthStore} from "../../stores/authStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        await loadKakaoSdk();
        initKakaoSdk(import.meta.env.VITE_KAKAO_JS_KEY);
      } catch (error) {
        console.error("카카오 SDK 로딩 실패:", error);
      }
    };
    init();
  }, []);

  const handleKakaoLogin = async () => {
    let kakaoEmail = "";
    let kakaoPassword = "kakao_dummy_password";
    try {
      const res = await loginWithKakao();

      const nickname = res.kakao_account?.profile?.nickname ?? "kakao_user";
      const id = res.id;
      const fakeEmail = `${nickname}_${id}@kakao.com`;

      const name = nickname;
      kakaoEmail = fakeEmail;
      kakaoPassword = "kakao_dummy_password";
      const favoriteGenre = "Hip-hop";
      await signupUser(name, kakaoEmail, kakaoPassword, favoriteGenre);
      await loginUser(kakaoEmail, kakaoPassword);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        console.warn("이미 가입된 사용자 → 로그인 시도");
        const response = await loginUser(kakaoEmail, kakaoPassword);
        const encoded = btoa(btoa(response.token));
        localStorage.setItem(
          "app_state",
          JSON.stringify({
            logindt: Date.now(),
            version: "5.5.10",
            login_session: encoded,
          })
        );
        useAuthStore.getState().login(response.token);
        navigate("/");
      } else {
        console.error("회원가입 실패:", error);
      }
    }
  };

  const handleLogin = async () => {
    let valid = true;

    if (!email.trim()) {
      setEmailError("이메일을 입력해주세요.");
      emailRef.current?.focus();
      valid = false;
    } else {
      setEmailError("");
    }

    if (!password.trim()) {
      setPasswordError("비밀번호를 입력해주세요.");
      if (valid) passwordRef.current?.focus();
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!valid) return;

    try {
      const response = await loginUser(email, password);
      const encoded = btoa(btoa(response.token));
      localStorage.setItem(
        "app_state",
        JSON.stringify({
          logindt: Date.now(),
          version: "5.5.09",
          login_session: encoded,
        })
      );

      useAuthStore.getState().login(response.token);
      navigate("/");
    } catch (error) {
      console.error("로그인 실패:", error);
      setEmailError("이메일/비밀번호가 틀렸습니다.");
      setPasswordError(" ");
      emailRef.current?.focus();
    }
  };

  return (
    <div className='md:h-[calc(100vh-68px)] w-full flex flex-col md:flex-row md:mt-3'>
      <div className='w-full h-[400px] md:h-full md:w-[50%] bg-[color:var(--bg-color)] relative'>
        <div className='flex items-center justify-center h-full'>
          <img
            src={loginGroup}
            alt='캐릭터'
            className='md:w-[70%] w-[40%] max-w-[500px] object-contain'
          />
        </div>
      </div>

      <div className='w-full md:w-[50%] bg-[color:var(--grey-600)] flex items-center justify-center'>
        <div className='w-[80%] max-w-[700px] mt-6 md:mt-0'>
          <h2 className='text-[color:var(--white)] text-xl font-bold mb-6'>WELCOME BACK</h2>
          <div className='flex items-center justify-between mb-2'>
            <label className='text-[color:var(--white)]'>팝콘 이메일</label>
            {emailError && (
              <p className='text-[color:var(--red)] text-sm whitespace-nowrap'>{emailError}</p>
            )}
          </div>
          <input
            type='email'
            ref={emailRef}
            placeholder='user@email.com'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (e.target.value.trim()) setEmailError("");
            }}
            className={`w-full mb-3 px-4 py-2 rounded-[10px] border ${
              emailError ? "border-[color:var(--red)]" : "border-[color:var(--white)]"
            } focus:outline-none focus:border-[color:var(--primary-200)]`}
          />

          <div className='flex items-center justify-between mb-2'>
            <label className='text-[color:var(--white)]'>팝콘 비밀번호</label>
            {passwordError && (
              <p className='text-[color:var(--red)] text-sm whitespace-nowrap'>{passwordError}</p>
            )}
          </div>
          <input
            type='password'
            ref={passwordRef}
            placeholder='Your password'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (e.target.value.trim()) setPasswordError("");
            }}
            className={`w-full mb-3 px-4 py-2 rounded-[10px] border ${
              passwordError ? "border-[color:var(--red)]" : "border-[color:var(--white)]"
            } focus:outline-none focus:border-[color:var(--primary-200)]`}
          />

          <button
            onClick={handleLogin}
            className='w-full bg-[color:var(--primary-300)] text-[color:var(--bg-color)] py-2 rounded-md text-sm font-semibold mb-2 flex items-center justify-center cursor-pointer mt-5 h-10'
          >
            <img src={logoPopcon} alt='팝콘로고' className='mr-2' />
            팝콘 로그인
          </button>

          <button
            onClick={handleKakaoLogin}
            className='w-full text-sm bg-[#FEE500] text-[color:var(--bg-color)] py-2 rounded-md text-md font-semibold mb-2 flex items-center justify-center border-2 border-[#FEE500] cursor-pointer h-10'
          >
            <img src={logoKakao} alt='카카오로고' className='mr-2' />
            카카오 로그인
          </button>

          <p className='text-sm text-[color:var(--white)] mt-8 mb-6'>
            Do not have an account yet?{" "}
            <Link to='/SignupAgree' className='text-[color:var(--primary-300)] underline'>
              Sign up.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
