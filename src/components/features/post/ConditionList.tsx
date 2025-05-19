import { useFormContext, useWatch } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { CHANNELS, CONDITIONS } from "../../../constants/posts";
import InputBtn from "./InputBtn";

export default function ConditionList({ isEditing }: { isEditing: boolean }) {
	const { control } = useFormContext();
	const watchedChannel = useWatch({
		control,
		name: "channel"
	});
	if (watchedChannel === CHANNELS.RECRUITMENT)
		return (
			<div className={twMerge(isEditing && "text-[#aaaaaa] dark:text-[#666]")}>
				<span className="post-input-title mb-4">동행조건</span>
				<fieldset className="mb-[30px]">
					<legend className="mb-[10px] sm:text-base text-sm">
						성별 (단일 선택)
					</legend>
					{CONDITIONS.GENDERS.map((gender) => (
						<InputBtn
							disabled={isEditing}
							key={gender}
							value={gender}
							type="radio"
							name="gender"
						>
							{gender}
						</InputBtn>
					))}
				</fieldset>
				<fieldset>
					<legend className="mb-[10px] sm:text-base text-sm">
						나이 (다중 선택 가능)
					</legend>
					<div className="flex w-screen sm:overflow-auto overflow-x-scroll none-scrollbar">
						{CONDITIONS.AGES.map((age, index) => (
							<InputBtn
								disabled={isEditing}
								key={age}
								value={age}
								type="checkbox"
								name="ageRange"
							>
								{age}
								{index === 4 && "+"}
							</InputBtn>
						))}
					</div>
				</fieldset>
			</div>
		);
}
