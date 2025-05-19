import { useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";

export default function LabelSelect({
	isEditing,
	name,
	label,
	children
}: {
	isEditing?: boolean;
	name: string;
	label: string;
	children: React.ReactNode;
}) {
	const { register } = useFormContext();
	return (
		<div>
			<label
				htmlFor={name}
				className={twMerge("post-input-title", isEditing && "text-[#aaaaaa]")}
			>
				{label}
			</label>
			<select
				className={twMerge(
					"input-style cursor-pointer focus:outline-none disabled:cursor-default disabled:text-[#aaaaaa]",
					"dark:border-[#616161]"
				)}
				id={name}
				{...register(name)}
				disabled={isEditing}
			>
				{children}
			</select>
		</div>
	);
}
