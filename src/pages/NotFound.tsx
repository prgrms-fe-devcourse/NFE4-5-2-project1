import { useNavigate, Link } from "react-router-dom";
import { useThemeStore } from "../store/themeStore";
import notFoundLogo from "../assets/images/404_ERROR.svg";
import notFoundImage from "../assets/images/notFound_image.png";
import notFoundDarkImage from "../assets/images/notFound_image_dark.png";
import notFoundDarkLogo from "../assets/images/404_ERROR_dark.svg";

export default function NotFound() {
	const navigate = useNavigate();
	const handleGoBack = () => {
		navigate(-1);
	};
	// darkmode
	const isDark = useThemeStore((state) => state.isDark);

	return (
		<div className="flex justify-center items-center min-h-screen">

			<div className="flex sm:flex-row flex-col-reverse w-[450px] sm:w-[1440px] h-atuo px-[16px] pb-[0px] sm:px-0 sm:py-0">
				{/* left box */}
				<div className="w-full sm:w-1/2 flex items-center justify-center text-center mt-[60px] sm:mt-0">
					<div className="w-full max-w-[433px]">
						<img
							src={isDark ? notFoundDarkLogo : notFoundLogo}
							alt="404 Not Found Error Logo"
							className="w-[248px] sm:w-[433px] mx-auto"
						/>
						<div className="mt-[20px] sm:mt-12 flex flex-col gap-y-7 text-[16px] sm:text-[20px] font-medium">
							<p>이 여행지는 아직 탐험되지 않았어요</p>
							<p>찾으시는 여행지는 없거나, 아직 개척되지 않았어요.</p>
						</div>

						<div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-4 mt-[40px] sm:mt-8">
							<Link
								to="/"
								className="select-none w-[418px] sm:w-[197px] h-[56px] flex items-center justify-center px-[45px] py-[16px] rounded-[10px] shadow-sm text-[16px] sm:text-[20px] font-bold text-white bg-[#06B796] hover:bg-[#00D3AC] dark:hover:bg-[#13A68A]"
							>
								메인 페이지
							</Link>
							<button
								onClick={handleGoBack}
								className="select-none w-[418px] sm:w-[197px] h-[56px] flex items-center justify-center px-[45px] py-[16px] rounded-[10px] shadow-sm text-[16px] sm:text-[20px] font-bold text-[#06B796] bg-[#DFF7E5] hover:bg-[#E9FFEE] dark:bg-[#038383] dark:text-[#DFF7E5] dark:hover:bg-[#037373]"
							>
								이전 페이지
							</button>
						</div>
					</div>
				</div>

				{/* right box */}
				<div className="w-full sm:w-1/2 flex items-center justify-center">
					<img
						src={isDark ? notFoundDarkImage : notFoundImage}
						alt="Not Found Image"
						className="w-[300px] sm:w-[560px] h-auto object-contain"
					/>
				</div>
			</div>
		</div>
	);
}
