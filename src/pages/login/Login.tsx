import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import deleteImg from '../../assets/images/input-delete/input-delete.svg';
import deleteImgDark from '../../assets/images/input-delete/input-delete-dark.svg';

import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useLocation, useNavigate } from 'react-router-dom';
import { login } from '../../api/auth/login';
import { AxiosError } from 'axios';
import { Theme } from '../../types/darkModeTypes';
import { dark } from '../../utils/darkModeUtils';

export default function Login({ theme }: { theme: Theme }) {
  const navigate = useNavigate();
  const storeLogin = useAuthStore((state) => state.login);

  const location = useLocation();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [loginError, setLoginError] = useState('');

  // 이메일 입력값 저장, 기존 에러 메시지 초기화
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (value && emailError) {
      setEmailError('');
    }
  };

  // 비밀번호 입력값 저장, 기존 에러 메시지 초기화
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (value && passwordError) {
      setPasswordError('');
    }
  };

  // 전체
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setLoginError('이메일은 필수 입력 항목입니다.');
      return;
    }

    if (!password) {
      setLoginError('비밀번호는 필수 입력 항목입니다.');
      return;
    }

    try {
      const res = await login(email, password);
      const token = res.data.token;
      storeLogin(token);

      if (location.state === 'from signup') navigate(-3);
      else navigate(-1);
    } catch (err) {
      const error = err as AxiosError;

      if (error.response?.status === 400) {
        const message = error.response.data as string;
        if (
          message.toLowerCase().includes('email') &&
          message.toLowerCase().includes('password') &&
          message.includes('match')
        ) {
          setLoginError('이메일 또는 비밀번호가 올바르지 않습니다.');
        } else {
          console.error(err);
        }
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-15">
      <img src={theme.logo} alt="로고" className="w-50" />

      <form className="flex flex-col">
        <div className="mb-5">
          <div className="relative">
            <Input
              value={email}
              type="email"
              label="Email"
              className={`peer cursor-pointer outline-none border border-gray-300  focus:border-[#1E293B] focus:border-2 input-style1 `}
              placeholder=" "
              onChange={handleEmail}
            />
            {email && (
              <img
                src={dark(theme) ? deleteImgDark : deleteImg}
                alt="삭제"
                onClick={() => {
                  setEmail('');
                  setEmailError('');
                }}
                className="absolute w-[20px] h-[20px] right-5 top-1/2 -translate-y-1/2 cursor-pointer"
              />
            )}
          </div>
        </div>

        <div className="mb-5">
          <div className="relative">
            <Input
              value={password}
              type="password"
              label="Password"
              className={`peer cursor-pointer outline-none border border-gray-300  focus:border-[#1E293B] focus:border-2 input-style1 `}
              placeholder=" "
              onChange={handlePassword}
            />

            {password && (
              <img
                src={dark(theme) ? deleteImgDark : deleteImg}
                alt="삭제"
                onClick={() => {
                  setPassword('');
                  setPasswordError('');
                }}
                className="absolute w-[20px] h-[20px] right-5 top-1/2 -translate-y-1/2 cursor-pointer"
              />
            )}
          </div>
        </div>
        <p className="text-sm text-red-500 px-1 mb-2">
          {loginError || emailError || passwordError || '\u00A0'}
        </p>

        <Button
          value="Log In"
          className={`button-style1 mb-5 mt-2 ${
            dark(theme)
              ? `w-[500px] h-[86px] text-[#ffffff] bg-[#2d2d2d] text-[23px] rounded-[10px] cursor-pointer`
              : ''
          }`}
          onClick={handleSubmit}
        />
        <p className="flex justify-center text-sm">
          <span className={`opacity-70 ${dark(theme) ? 'text-[#ffffff]' : ''}`}>
            아직 회원이 아니신가요?
          </span>
          <a
            href="/signup"
            className={`ml-2 font-medium  ${
              dark(theme) ? 'text-[#ffffff]' : 'text-[#1e293b]'
            }`}
          >
            회원가입
          </a>
        </p>
      </form>
    </div>
  );
}
