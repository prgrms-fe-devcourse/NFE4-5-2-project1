import { useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";

export default function InputTitle() {
	const { register } = useFormContext();
	return (
		<div>
			<label htmlFor="title" className="post-input-title">
				제목
			</label>
			<input
				id="title"
				type="text"
				placeholder="제목을 입력해 주세요"
				className={twMerge(
					"bg-[#F9F9F9] w-full p-5 rounded-[10px] placeholder:text-[#CDCDCD] focus:outline-0",
					"dark:bg-[#333] dark:placeholder:text-[#616161] sm:mt-0 mt-[10px] sm:text-base text-sm"
				)}
				{...register("title")}
			/>
		</div>
	);
}
