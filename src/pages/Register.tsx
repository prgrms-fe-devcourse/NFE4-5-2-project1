import React, { useState } from 'react';
import Button from '../components/button';
import Input from '../components/Input';
import passport from '../assets/images/passportImg.svg';
import emailNot from '../assets/icons/emailNotOk.png';
import emailOk from '../assets/icons/emailOk.png';
import passwordNot from '../assets/icons/passwordNotOk.svg';
import passwordOk from '../assets/icons/passwordOk.svg';
import useRandomVideo from '../hook/RandomVideo';
import { useNavigate } from 'react-router';
import { axiosInstance } from '../api/axios';
import { toast } from 'react-toastify';

export default function Register() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const video = useRandomVideo();

    // 이메일,이름,비밀번호 핸들러
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsEmailValid(emailRegex.test(value));
    };

    const handleFullnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFullName(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    };

    // 회원가입 요청
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 유효성 검사
        if (!fullName) {
            toast.error('이름을 입력해주세요.');
            return;
        }

        if (!email) {
            toast.error('이메일을 입력해주세요.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('올바른 이메일 형식을 입력해주세요.');
            return;
        }

        if (!password) {
            toast.error('비밀번호를 입력해주세요.');
            return;
        }

        if (!confirmPassword) {
            toast.error('비밀번호 확인을 입력해주세요.');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            await axiosInstance.post('/signup', { email, fullName, password });
            // 입력값 초기화
            [setFullName, setEmail, setPassword, setConfirmPassword].forEach((fn) => fn(''));
            setIsEmailValid(false);
            toast.success('회원가입 되었습니다.');
            // 완료되면 로그인페이지로 이동(이것도 임의로해둔거라 바꿔도됨)
            navigate('/login');
        } catch (e) {
            toast.error(`회원가입 실패하였습니다.`);
        }
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-[var(--color-darkNavy)]">
            <video autoPlay muted loop className="absolute top-0 left-0 w-full h-full object-cover z-0">
                <source src={video} type="video/mp4" />
            </video>
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30 z-10"></div>
            <div className="relative w-[650px] h-[750px] bg-[var(--color-white)] rounded-[30px] flex flex-col z-20">
                {/* 상단 */}
                <div className="w-[650px] h-[440px] flex items-center justify-center relative border-b-[3px] border-[var(--color-black)]">
                    <div className="absolute left-0 top-0 bottom-0 w-[2px]" />
                    <img src={passport} alt="여권정보 사진" className="w-[702px] h-[305px] object-contain z-10" />
                </div>

                {/* 회원가입 입력 */}
                <div className="w-[650px] h-[365px] bg-[var(--color-white)] flex relative">
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
                        <div className="w-[205px] h-[15px] bg-[var(--color-main-navy)] rounded-[15px]" />
                        <div className="w-[147px] h-[54px] text-[35px] text-center text-[var(--color-black)]">
                            Register
                        </div>
                        <div className="w-[205px] h-[15px] bg-[var(--color-main-navy)] rounded-[15px]" />
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="w-[650px] pt-15 px-10 flex flex-col justify-center items-center relative mb-2"
                    >
                        <div className="absolute left-0 top-0 bottom-0 w-[2px]" />

                        <div className="grid grid-cols-2 gap-4 w-full">
                            {/* 이름 */}
                            <div className="flex flex-col">
                                <label htmlFor="fullName" className="text-[var(--color-black)]">
                                    fullName
                                </label>
                                <Input id="fullName" name="fullName" value={fullName} onChange={handleFullnameChange} />
                            </div>

                            {/* 이메일 */}
                            <div className="flex flex-col relative">
                                <label htmlFor="email" className="text-[var(--color-black)]">
                                    Passanger email
                                </label>
                                <Input id="email" type="email" value={email} onChange={handleEmailChange} />
                                <img
                                    src={isEmailValid ? emailOk : emailNot}
                                    alt={isEmailValid ? '유효한 이메일' : '이메일 유효하지 않음'}
                                    className="w-[20px] h-[20px] absolute right-3 bottom-3"
                                />
                            </div>

                            {/* 비밀번호 */}
                            <div className="flex flex-col">
                                <label htmlFor="password" className="text-[var(--color-black)]">
                                    Password
                                </label>
                                <Input id="password" type="password" value={password} onChange={handlePasswordChange} />
                            </div>

                            {/* 비밀번호 확인 */}
                            <div className="flex flex-col relative">
                                <label htmlFor="confirm-password" className="text-[var(--color-black)]">
                                    Password confirm
                                </label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                />

                                <img
                                    src={
                                        password !== '' && confirmPassword !== '' && password === confirmPassword
                                            ? passwordOk
                                            : passwordNot
                                    }
                                    alt={
                                        password !== '' && confirmPassword !== '' && password === confirmPassword
                                            ? '비밀번호 일치'
                                            : '비밀번호 일치하지 않음'
                                    }
                                    className="w-[20px] h-[20px] absolute right-3 bottom-3"
                                />
                            </div>
                        </div>

                        {/* 회원가입 버튼 */}
                        <Button type="submit" className="self-center mt-5 w-[200px] h-[50px]">
                            회원가입
                        </Button>
                    </form>
                </div>

                {/* 여권 하단 장식 */}
                <div className="h-[75px] px-7 pt-3 bg-[var(--color-lightGray)] rounded-b-[30px]">
                    <div className="w-[630px] text-[14px] text-[var(--color-black)]">
                        {'<<< ROUTE <<< MATE <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<'}
                        <br />
                        {' <<< AB586511 <<<<<<<<<<<<<<<<< R <<<<<< 185651321854 <<<<<<<<<<<<<<<<<<<<'}
                    </div>
                </div>
            </div>
        </div>
    );
}