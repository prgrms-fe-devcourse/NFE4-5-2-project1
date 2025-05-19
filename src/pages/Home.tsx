import useRandomVideo from '../hook/RandomVideo';
import Button from '../components/button';
import homeButtonIcon from '../assets/icons/homeIcon.svg';
import homeLogo from '../assets/images/homeLogo.svg';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    // 라우팅
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate('/Login');
    };

    const goToRegister = () => {
        navigate('/Register');
    };

    const goToChannel = () => {
        navigate('/channel');
    };
    const video = useRandomVideo();
    return (
        <div className="w-screen h-screen bg-cover overflow-hidden fixed">
            <video autoPlay muted loop className="absolute top-0 left-0 w-full h-full object-cover z-0">
                <source src={video} type="video/mp4" />
            </video>
            <div className="absolute top-0 left-0 w-full h-full bg-[var(--color-black)] opacity-30 z-10"></div>
            <div className="z-20 relative flex justify-evenly items-center h-full min-h-screen">
                {/* 왼쪽 */}
                <div>
                    <h1 className="text-[110px] text-[var(--color-white)] font-bold leading-[1]">
                        Days are yours, <br /> Route are ours.
                    </h1>
                    {/* 여행이야기 */}
                    <div className="flex flex-row gap-30 ml-[150px] mt-[50px] ">
                        <Button
                            className="flex gap-2 items-center justify-center bg-[rgba(255,255,255,0.8)] w-[400px] h-[50px] text-[var(--color-black)] 
                            hover:border-2 hover:border-[var(--color-main-navy)] hover:bg-[#B4B4B4]"
                            onClick={goToChannel}
                        >
                            <img src={homeButtonIcon} alt="homeButtonIcon" />
                            <span className="mt-[4px] text-lg"> 여행 이야기</span>
                        </Button>
                    </div>
                </div>

                {/* 오른쪽 */}
                <div className="w-[450px] h-[600px] bg-[rgba(255,255,255,0.8)] flex flex-col justify-between items-center rounded-xl py-[100px]">
                    {/* 로고이미지, 텍스트 */}
                    <div className="flex flex-col items-center gap-10">
                        <img src={homeLogo} alt="homeLogo" className="w-[102px] h-[110px]" />
                        <span className="text-[var(--color-black)] text-[55px] font-bold">
                            Travel <span className="text-[var(--color-lightGray-focus)]">Mate</span>
                        </span>
                    </div>
                    {/* button box */}
                    <div className="flex flex-col gap-5">
                        <Button className="w-[248px] h-[50px] text-[22px] hover:bg-[#001A40]" onClick={goToLogin}>
                            Log In
                        </Button>
                        <Button
                            className="bg-[var(--color-white)] w-[248px] h-[50px] text-[22px] text-[var(--color-black)] hover:bg-[#B4B4B4]"
                            onClick={goToRegister}
                        >
                            Register
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
