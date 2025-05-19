import { useState } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { CHANNELS } from "../../../constants/posts";
import { useAuthStore } from "../../../store/authStore";
import Icon from "../../commons/Icon";
import UserInfo from "../user/UserInfo";
import PostTitle from "./PostTitle";
import TravelInfo from "./TravelInfo";

export default function PostHeader({
	postData,
	postInfo,
	authorInfo,
	isRecruitChannel,
	isRecruiting
}: {
	postData: PostData;
	postInfo: PostDetail;
	authorInfo: Profile;
	isRecruitChannel: boolean;
	isRecruiting: boolean;
}) {
	const userId = useAuthStore((state) => state.userId)!;

	const isAuthor = userId === postData.author._id;
	const [swiperIndex, setSwiperIndex] = useState(0);
	const [swiper, setSwiper] = useState<SwiperClass>();

	const prevHandler = () => {
		swiper?.slidePrev();
	};

	const nextHandler = () => {
		swiper?.slideNext();
	};
	return (
		<div>
			<PostTitle
				isRecruitChannel={isRecruitChannel}
				isAuthor={isAuthor}
				isRecruiting={isRecruiting}
				title={postInfo.title}
			/>
			<div className="sm:hidden h-20 " />
			{postInfo.images?.length !== 0 && isRecruitChannel && (
				<div className="relative sm:mb-9 sm:mx-0 -mx-4">
					<Swiper
						modules={[Pagination]}
						onActiveIndexChange={(e) => setSwiperIndex(e.realIndex)}
						onSwiper={(e) => setSwiper(e)}
						className="w-full cursor-grab z-0!"
					>
						{postData.channel._id === CHANNELS.RECRUITMENT &&
							postInfo.images?.map((image, index) => (
								<SwiperSlide key={index}>
									<img
										src={image}
										className="w-full sm:h-125 h-50 object-cover sm:rounded-lg z-0"
									/>
								</SwiperSlide>
							))}
					</Swiper>
					<div className="flex absolute bottom-5 w-full justify-center items-center z-10 gap-3">
						<button
							onClick={prevHandler}
							className="cursor-pointer sm:block hidden"
						>
							<Icon position="44.538% 95.109%" size="12px" />
						</button>
						<div className="text-[rgba(255,255,255,0.6)] select-none">
							<span className="text-white">0{swiperIndex + 1} </span>
							<span>/ </span>
							<span>0{postInfo.images?.length}</span>
						</div>
						<button
							onClick={nextHandler}
							className="cursor-pointer sm:block hidden"
						>
							<Icon position="54.622% 95.109%" size="12px" />
						</button>
					</div>
				</div>
			)}
			<TravelInfo isRecruitChannel={isRecruitChannel} postInfo={postInfo} />
			<UserInfo
				isRecruitChannel={isRecruitChannel}
				authorInfo={authorInfo}
				image={postData.author.image}
				userId={postData.author._id}
			/>
		</div>
	);
}
