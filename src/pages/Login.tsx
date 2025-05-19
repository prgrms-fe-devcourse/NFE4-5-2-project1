import { useState } from 'react';
import passport from '../assets/images/passportImg.svg';
import loginlogo from '../assets/images/LogInLogo.svg';
import Input from '../components/Input';
import Button from '../components/button';
import EyeOn from '../assets/icons/eyeOn.svg';
import EyeOff from '../assets/icons/eyeOff.svg';
import useRandomVideo from '../hook/RandomVideo';
import { useAuthStore } from '../stores/authStore';
import { axiosInstance } from '../api/axios';
import { toast } from 'react-toastify';

export default function Login() {
    const video = useRandomVideo();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // 로그인 요청중 상태 -> 로그인할때 버튼 비활성화해준다.
    const [hide, setHide] = useState(true); // true: 숨김, false: 보임
    const login = useAuthStore((state) => state.login);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error('이메일을 입력해주세요.');
            return;
        }

        if (!password.trim()) {
            toast.error('비밀번호를 입력해주세요.');
            return;
        }

        try {
            setIsLoading(true);
            const { data } = await axiosInstance.post('/login', { email, password });
            login(data.token, data.user._id, data.user.role);
            // 토큰과 id값, 역활을 zustand에 저장
            [setEmail, setPassword].forEach((fn) => fn(''));
            toast.success('로그인 되었습니다.');
            // 완료되면 인증 페이지(임의로 한것이므로 바꿔도됨)로 이동
        } catch (e) {
            toast.error('로그인을 실패하였습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="w-screen h-screen flex items-center justify-center bg-[var(--color-darkNavy)]
        bg-cover"
        >
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

                {/* 하단 */}
                <div className="w-[650px] h-[365px] bg-[var(--color-white)] flex relative">
                    {/* 로그인 글씨 */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
                        <div className="w-[205px] h-[15px] bg-[var(--color-main-navy)] rounded-[15px]" />
                        <div className="w-[147px] h-[54px] text-[35px] text-center text-[var(--color-black)]">
                            Log In
                        </div>
                        <div className="w-[205px] h-[15px] bg-[var(--color-main-navy)] rounded-[15px]" />
                    </div>

                    {/* 로고 */}
                    <div className="w-[450px] top-2 flex flex-col items-center justify-center pl-10 relative">
                        <div className="absolute left-0 top-0 bottom-0 w-[2px]" />
                        <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center mb-2">
                                <img
                                    src={loginlogo}
                                    alt="로그인로고 사진"
                                    className="w-[90px] h-[115px] object-contain"
                                />
                            </div>
                            <div className="text-[40px] font-bold">
                                Travel
                                <span className="text-[var(--color-main-skyBlue)]">Mate</span>
                            </div>
                        </div>
                    </div>

                    {/* 로그인 입력 */}
                    <form
                        onSubmit={handleSubmit}
                        className="w-[650px] top-9 px-10 flex flex-col justify-center relative"
                    >
                        <div className="absolute right-0 top-0 bottom-0 w-[2px]" />

                        {/* 이메일 입력 */}
                        <div className="mb-4">
                            <label htmlFor="email" className="text-[var(--color-black)]">
                                Passanger email
                            </label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        {/* 비밀번호 입력 */}
                        <div className="mb-3">
                            <label htmlFor="password" className="text-[var(--color-black)]">
                                Password
                            </label>
                            <div className="relative">
                                <Input
                                    type={hide ? 'password' : 'text'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pr-10" // 아이콘 위치 공간 확보
                                />
                                <img
                                    src={hide ? EyeOff : EyeOn}
                                    alt="비밀번호 보기 토글"
                                    className="w-5 h-5 cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2"
                                    onClick={() => setHide((prev) => !prev)}
                                />
                            </div>
                        </div>

                        {/* 로그인 버튼 */}
                        <Button type="submit" className="px-5 py-2 self-end" disabled={isLoading}>
                            로그인
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
