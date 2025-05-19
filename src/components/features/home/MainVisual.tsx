import mainvisual1 from "../../../assets/images/mainvisual1.png";
import mainvisual2 from "../../../assets/images/mainvisual2.png";
import mainvisual3 from "../../../assets/images/mainvisual3.png";
import mainvisual4 from "../../../assets/images/mainvisual4.png";
import mainvisual5 from "../../../assets/images/mainvisual5.png";

import type { Swiper as SwiperClass } from "swiper";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useRef, useState } from "react";
import Icon from "../../commons/Icon";

const slides = [
	{
		image: mainvisual1,
		alt: "도쿄",
		description: "쇼핑, 맛집, 가깝고 즐길 게 많은 도쿄!"
	},
	{
		image: mainvisual2,
		alt: "보라카이",
		title: "보라카이로!",
		description: "휴양지 제대로 즐기고 싶다면"
	},
	{
		image: mainvisual3,
		alt: "홍콩",
		title: "홍콩 추천!",
		description: "야경도 좋고 먹거리도 풍부한 도시"
	},
	{
		image: mainvisual4,
		alt: "독일",
		title: "독일 한 번 가봐야죠",
		description: "역사 좋아하는 사람이라면"
	},
	{
		image: mainvisual5,
		alt: "이집트",
		title: "이집트가 딱",
		description: "색다른 여행 원한다면"
	}
];

export default function MainVisual() {
	const swiperRef = useRef<SwiperClass | null>(null);
	const [autoplaying, setAutoplaying] = useState(true);

	const toggleAutoplay = () => {
		if (!swiperRef.current) return;
		if (autoplaying) {
			swiperRef.current.autoplay.stop();
		} else {
			swiperRef.current.autoplay.start();
		}
		setAutoplaying(!autoplaying);
	};

	const handleMouseEnter = () => {
		if (swiperRef.current?.autoplay.running) {
			swiperRef.current.autoplay.stop();
		}
	};

	const handelMouseLeave = () => {
		if (!swiperRef.current?.autoplay.running && autoplaying) {
			swiperRef.current?.autoplay.start();
		}
	};

	return (
		<div
			className="w-full sm:w-[1100px] relative group"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handelMouseLeave}
		>
			<Swiper
				modules={[Autoplay, Navigation, Pagination]}
				spaceBetween={0}
				slidesPerView={1}
				loop={true}
				onSwiper={(swiper) => (swiperRef.current = swiper)}
				autoplay={{ delay: 5000, disableOnInteraction: false }}
				navigation={{
					nextEl: ".swiper-button-next",
					prevEl: ".swiper-button-prev"
				}}
				pagination={{
					el: ".custom-pagination",
					clickable: true,
					bulletClass: "custom-bullet",
					bulletActiveClass: "custom-bullet-active"
				}}
				className="sm:rounded-[10px] rounded-[8px]"
			>
				{slides.map((slide, i) => (
					<SwiperSlide key={i}>
						<div className="relative w-full sm:h-[400px] h-[190px]">
							<img
								src={slide.image}
								alt={slide.alt}
								className="w-full h-full object-cover"
							/>
							<div className="absolute sm:bottom-10 sm:left-10 bottom-8 left-[22px] text-white">
								<h2 className="sm:text-[40px] text-[20px] font-bold">
									{slide.description}
								</h2>
								<p className="sm:text-[28px] text-[16px] font-bold">
									{slide.title}
								</p>
							</div>
						</div>
					</SwiperSlide>
				))}

				{/* swiper navi */}
				<div className="hidden sm:block swiper-button-prev opacity-0 group-hover:opacity-100 transition-opacity">
					<Icon position="47.465% 49.39%" size="95px" />
				</div>
				<div className="hidden sm:block swiper-button-next opacity-0 group-hover:opacity-100 transition-opacity">
					<Icon position="89.401% 49.39%" size="95px" />
				</div>
			</Swiper>
			{/* pagination + autoplay control */}
			<div
				className="flex items-center gap-[4px]
             absolute bottom-[14px] left-[22px] sm:bottom-auto
             sm:left-1/2 sm:-translate-x-1/2 translate-x-0
             sm:mt-[10px] sm:h-[24px] h-[12px] z-10"
			>
				<div className="flex items-center">
					<div className="custom-pagination" />
				</div>
				<button
					onClick={toggleAutoplay}
					className="hidden sm:flex w-[22px] h-[22px] bg-[#cdcdcd] rounded-full items-center justify-center hover:bg-[#06B796] transition-colors duration-300 ml-[4px]"
				>
					<Icon
						position={autoplaying ? "-6px -11px" : "-21px -11px"}
						size="20px"
					/>
				</button>
			</div>
		</div>
	);
}
