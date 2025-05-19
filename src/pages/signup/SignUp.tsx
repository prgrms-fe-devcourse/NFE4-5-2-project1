import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import deleteImg from '../../assets/images/input-delete/input-delete.svg';
import deleteImgDark from '../../assets/images/input-delete/input-delete-dark.svg';

import { useState } from 'react';
import { signup } from '../../api/auth/signup';
import { useNavigate } from 'react-router-dom';
import {
  emailRegex,
  fullNameRegex,
  passwordRegex,
} from '../../utils/validators';
import { AxiosError } from 'axios';
import { Theme } from '../../types/darkModeTypes';
import { dark } from '../../utils/darkModeUtils';

export default function SignUp({ theme }: { theme: Theme }) {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [fullNameError, setFullNameError] = useState('');

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // 이메일 유효성 검사
  const validateEmail = (email: string) => {
    return emailRegex.test(email);
  };

  // 비밀번호 유효성 검사
  const validatePassword = (password: string) => {
    return passwordRegex.test(password);
  };

  // 사용자 이름 유효성 검사
  const validateUsername = (fullName: string) => {
    return fullNameRegex.test(fullName);
  };

  // 사용자 이름 입력값 저장, 조건에 맞지 않으면 에러 메시지 표시
  const handleFullName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFullName(value);

    if (value && !validateUsername(value)) {
      setFullNameError('이름은 특수문자 없이 10글자 이하로 입력해주세요.');
    } else {
      setFullNameError('');
    }
  };

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // @ 기준으로 나누기
    const [id, domain] = value.split('@');

    // . 기준으로 나누기
    const [fullDomain, ext] = domain?.split('.') || [];

    // 첫 글자 검사
    if (!id || !/^[a-zA-Z]/.test(id)) {
      setEmailError('이메일의 아이디 첫 글자는 영문자여야 합니다.');
      return;
    }

    // 아이디 길이 검사
    if (id.length < 5 || id.length > 20) {
      setEmailError('이메일 아이디는 5~20자 사이로 입력해주세요.');
      return;
    }

    // 도메인 길이 검사
    if (!fullDomain || fullDomain.length > 10) {
      setEmailError('도메인 이름은 10자 이하로 입력해주세요.');
      return;
    }

    // 확장자 길이 검사
    if (!ext || ext.length < 2 || ext.length > 5) {
      setEmailError('도메인 확장자는 2~5자 사이로 입력해주세요. ');
      return;
    }

    // 전체 검사
    if (!validateEmail(value)) {
      setEmailError('이메일 형식을 확인해주세요.');
      return;
    }
    setEmailError('');
  };

  // 비밀번호 입력값 저장, 조건에 맞지 않으면 에러 메시지 표시
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (!validatePassword(value)) {
      setPasswordError(
        '비밀번호는 영문, 숫자, 특수문자를 포함해 8~16자로 입력해주세요.'
      );
      return;
    } else {
      setPasswordError('');
    }
  };

  // 확인 비밀번호 입력값 저장, 비밀번호와 다르면 에러 메시지 표시
  const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (password !== value) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
      return;
    } else {
      setConfirmPasswordError('');
    }
  };

  // 전체
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    setFullNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    if (!fullName) {
      setFullNameError('이름은 필수 입력 항목입니다.');
      hasError = true;
      return;
    } else if (!validateUsername(fullName)) {
      setFullNameError('이름은 특수문자 없이 10글자 이하로 입력해주세요.');
      hasError = true;
      return;
    }

    if (!email) {
      setEmailError('이메일은 필수 입력 항목입니다.');
      hasError = true;
      return;
    } else {
      const [id, domain] = email.split('@');
      const [fullDomain, ext] = domain?.split('.') || [];

      if (!id || !/^[a-zA-Z]/.test(id)) {
        setEmailError('이메일의 아이디 첫 글자는 영문자여야 합니다.');
        hasError = true;
        return;
      } else if (id.length < 5 || id.length > 20) {
        setEmailError('이메일 아이디는 5~20자 사이로 입력해주세요.');
        hasError = true;
        return;
      } else if (!fullDomain || fullDomain.length > 10) {
        setEmailError('도메인 이름은 10자 이하로 입력해주세요.');
        hasError = true;
        return;
      } else if (!ext || ext.length < 2 || ext.length > 5) {
        setEmailError('도메인 확장자는 2~5자 사이로 입력해주세요.');
        hasError = true;
        return;
      } else if (!validateEmail(email)) {
        setEmailError('이메일 형식을 확인해주세요.');
        hasError = true;
        return;
      }
    }

    if (!password) {
      setPasswordError('비밀번호는 필수 입력 항목입니다.');
      hasError = true;
      return;
    } else if (!validatePassword(password)) {
      setPasswordError(
        '비밀번호는 영문, 숫자, 특수문자를 포함해 8~16자로 입력해주세요.'
      );
      hasError = true;
      return;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('비밀번호 확인은 필수 입력 항목입니다.');
      hasError = true;
      return;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
      hasError = true;
      return;
    }

    if (hasError) return;

    try {
      await signup(fullName, email, password);
      navigate('/login', { state: 'from signup' });
    } catch (err) {
      const error = err as AxiosError;

      if (error.response?.status === 400) {
        const message = error.response.data as string;
        if (
          message.toLowerCase().includes('email') &&
          message.includes('used')
        ) {
          setEmailError('이미 사용 중인 이메일입니다.');
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
              value={fullName}
              type="email"
              label="Username"
              className={`peer cursor-pointer outline-none border border-gray-300  focus:border-[#1E293B] focus:border-2 input-style1 `}
              placeholder=" "
              onChange={handleFullName}
            />
            {fullName && (
              <img
                src={dark(theme) ? deleteImgDark : deleteImg}
                alt="삭제"
                onClick={() => {
                  setFullName('');
                  setFullNameError('');
                }}
                className="absolute w-[20px] h-[20px] right-5 top-1/2 -translate-y-1/2 cursor-pointer"
              />
            )}
          </div>
          <p className="text-sm text-red-500 pt-1 px-1 h-2.5">
            {fullNameError || '\u00A0'}
          </p>
        </div>

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
          <p className="text-sm text-red-500 pt-1 px-1 h-2.5">
            {emailError || '\u00A0'}
          </p>
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

          <p className="text-sm text-red-500 pt-1 px-1 h-2.5">
            {passwordError || '\u00A0'}
          </p>
        </div>

        <div className="mb-5">
          <div className="relative">
            <Input
              value={confirmPassword}
              type="password"
              label="Confirm Password"
              className={`peer cursor-pointer outline-none border border-gray-300  focus:border-[#1E293B] focus:border-2 input-style1 `}
              placeholder=" "
              onChange={handleConfirmPassword}
            />

            {confirmPassword && (
              <img
                src={dark(theme) ? deleteImgDark : deleteImg}
                alt="삭제"
                onClick={() => {
                  setConfirmPassword('');
                  setConfirmPasswordError('');
                }}
                className="absolute w-[20px] h-[20px] right-5 top-1/2 -translate-y-1/2 cursor-pointer"
              />
            )}
          </div>
          <p className="text-sm text-red-500 pt-1 px-1 h-2.5">
            {confirmPasswordError || '\u00A0'}
          </p>
        </div>

        <Button
          value="Sign Up"
          className={`button-style1 mt-2 ${
            dark(theme)
              ? `w-[500px] h-[86px] text-[#ffffff] bg-[#2d2d2d] text-[23px] rounded-[10px] cursor-pointer`
              : ''
          }`}
          onClick={handleSubmit}
        />
      </form>
    </div>
  );
}
