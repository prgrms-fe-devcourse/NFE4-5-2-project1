import { useState } from "react";
import { twMerge } from "tailwind-merge";
import Icon from "../../commons/Icon";

export default function UploadImage({
	showImages,
	addImage,
	removeImage
}: {
	showImages: string[];
	addImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
	removeImage: (image: string) => void;
}) {
	const [value, setValue] = useState("");
	return (
		<div>
			<span className="post-input-title ">사진</span>
			<div
				className={twMerge(
					"flex bg-[#F9F9F9] py-2 px-[10px] gap-5 rounded-[10px]",
					"dark:bg-[#333] sm:mt-0 mt-[10px]"
				)}
			>
				{showImages &&
					showImages.map((image, index) => (
						<img
							key={index}
							src={image}
							alt={image}
							className="h-[46px] max-w-22 cursor-pointer hover:brightness-90"
							onClick={() => removeImage(image)}
						/>
					))}
				<label htmlFor="inputFile" className="flex items-center">
					<input
						id="inputFile"
						type="file"
						multiple
						accept="image/jpg, image/png, image/jpeg, image/gif"
						onChange={(e) => {
							addImage(e);
							setValue("");
						}}
						value={value}
						className="absolute w-0 h-0"
						disabled={showImages.length === 10 ? true : false}
					/>
					<div
						className={twMerge(
							"group hover:border-[#888] flex flex-col justify-center items-center gap-[1px] w-[46px] h-[46px] border border-[#D0D0D0] bg-white rounded-lg cursor-pointer",
							"dark:bg-[#ffffffde]"
						)}
					>
						<Icon position="74.89% 12.155%" size="18px" />
						<span
							className={twMerge(
								"text-xs text-[#616161]",
								showImages.length < 10 ? "group-hover:text-[#888]" : null
							)}
						>
							{showImages.length}/10
						</span>
					</div>
				</label>
			</div>
		</div>
	);
}

// image to base64 인코딩
// firebase
