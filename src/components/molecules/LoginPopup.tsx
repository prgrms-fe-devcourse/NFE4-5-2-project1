import { useCallback, useEffect, useState } from 'react';
import { login } from '../../api/auth';
import { AxiosError } from 'axios';
import coffeeBean from '../../assets/images/CoffeeBean.png';
import { useLoginStore } from '../../stores/loginStore';
import Button from '../atoms/Button';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';

export default function LoginPopup({
  onClose,
  onSwitchToSignup,
}: {
  onClose: () => void;
  onSwitchToSignup: () => void;
}) {
  const [isOpenLocal, setIsOpenLocal] = useState(true);
  const handleLocalClose = () => setIsOpenLocal(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = useCallback(async () => {
    setError('');
    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }
    try {
      const res = await login(email, password);
      localStorage.setItem('accessToken', res.token);
      localStorage.setItem('myId', res.user._id);
      localStorage.setItem('myImage', res.user.image);
      useLoginStore.getState().login();
      toast.success('로그인 되었습니다.');
      navigate('/');
      // 로그인 성공 직후 모달 닫기
      handleLocalClose();
    } catch (err) {
      let msg = '알 수 없는 오류가 발생했습니다.';
      const axiosError = err as AxiosError<{ message?: string }>;
      msg =
        (typeof axiosError.response?.data === 'string'
          ? axiosError.response.data
          : axiosError.response?.data?.message) ||
        axiosError.message ||
        msg;

      if (
        axiosError.response?.status === 400 &&
        msg.includes(
          'Your email and password combination does not match an account.',
        )
      ) {
        setError('이메일 또는 패스워드가 일치하지 않습니다.');
        return;
      }

      setError(msg);
    }
  }, [email, password, navigate]);

  //  키보드 이벤트 처리 ESC(닫기), Enter(로그인)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleLocalClose();
      }
      if (e.key === 'Enter') {
        handleLogin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleLogin]);

  return (
    <AnimatePresence onExitComplete={onClose}>
      {isOpenLocal && (
        <>
          {/* overlay: 배경 페이드인/아웃 */}
          <motion.div
            key="signup-overlay"
            className="nanum-gothic-regular fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2, delay: 0.3 } }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={handleLocalClose}
          >
            {/* modal content: 스프링 기반 스케일 애니메이션 */}
            <motion.div
              key="signup-modal"
              onClick={(e) => e.stopPropagation()}
              className="dark:bg-dark-card dark:text-dark-text relative rounded-[15px] bg-white p-7 shadow-inner"
              initial={{ y: 50, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {/* Header: 타이틀 + 아이콘 */}
              <div className="flex items-center pt-1 pb-3">
                <div className="text-[32px]">Log In</div>
                <img
                  src={coffeeBean}
                  alt="coffeeBeanIcon"
                  className="translate-1 translate-y-1"
                />
              </div>

              <div className="text-[16px]">
                디:카페인에 오신 것을 환영합니다!
              </div>

              {/* Input Fields & Buttons */}
              <div className="flex flex-col gap-4 pt-7">
                <input
                  type="text"
                  placeholder="이메일"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-[50px] w-[350px] rounded-[5px] border p-3"
                />
                <input
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-[50px] w-[350px] rounded-[5px] border p-3"
                />

                {error && <div className="text-sm text-red-500">{error}</div>}

                <Button onClick={handleLogin} size="l" full>
                  로그인
                </Button>
                <Button onClick={onSwitchToSignup} size="l">
                  회원가입
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
