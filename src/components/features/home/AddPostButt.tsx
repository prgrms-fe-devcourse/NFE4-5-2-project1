import Icon from "../../commons/Icon";

export default function AddPostButt() {
	return (
		<div className="fixed sm:right-[50px] right-[20px] sm:bottom-[30px] bottom-[90px] z-30">
			<button
				className="group relative sm:w-[70px] w-[60px] hover:w-[177px] sm:h-[70px] h-[60px]
               rounded-full bg-[#06B796] text-white
               transition-all duration-300 overflow-hidden pl-[20px] pr-[20px] cursor-pointer
               flex items-center"
			>
				<div className="absolute sm:right-[24px] right-[19.7px] sm:top-[24.5px] top-[20px]">
					<Icon position="-19px -161px" size="21px" />
				</div>
				<span
					className="opacity-0 group-hover:opacity-100 max-w-0 group-hover:max-w-[100px]
                 overflow-hidden whitespace-nowrap transition-all duration-300 text-[20px] font-medium"
				>
					게시글 추가
				</span>
			</button>
		</div>
	);
}
