import { useRef, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { useClickAway } from "react-use";
import { twMerge } from "tailwind-merge";
import { useAuthStore } from "../../store/authStore";
import { usePostStore } from "../../store/postStore";

export default function CustomSelect({
	isEditing,
	name,
	label,
	options
}: {
	isEditing?: boolean;
	name: string;
	label: string;
	options: { label: string | number; value: string | number }[];
}) {
	const applicants = usePostStore((state) => state.applicants);
	const postInfo = usePostStore((state) => state.postInfo);
	const userId = useAuthStore((state) => state.userId);
	const { control } = useFormContext();
	const {
		field: { value, onChange }
	} = useController({ name, control });

	const [optionOepn, setOptionOpen] = useState(false);
	const optionsRef = useRef<HTMLUListElement | null>(null);

	const toggleOptionHandler = () => {
		setOptionOpen((state) => !state);
	};

	useClickAway(optionsRef, () => {
		setOptionOpen(false);
	});

	const actualMembers = postInfo?.memberList.filter(
		(member) =>
			applicants.some((applicant) => applicant.author._id === member) ||
			userId === member
	);

	return (
		<div className="sm:block flex justify-between items-center">
			<label
				htmlFor={name}
				className={twMerge(
					"post-input-title",
					name === "channel" && isEditing && "text-[#aaaaaa] dark:text-[#666]"
				)}
			>
				{label}
			</label>
			<div className="relative flex flex-col flex-1">
				<input
					onClick={toggleOptionHandler}
					className={twMerge(
						"input-style focus:outline-0 cursor-pointer disabled:text-[#aaaaaa]",
						"dark:border-[#616161] w-full"
					)}
					type="text"
					readOnly
					value={options.find((opt) => opt.value === value)?.label || ""}
					disabled={name === "channel" && isEditing}
				/>
				{optionOepn && (
					<ul
						ref={optionsRef}
						className={twMerge(
							"absolute sm:top-[54px] top-12 right-0 w-full overflow-hidden border-1 border-[#d6d6d6] py-2 px-2 bg-white pb-2 rounded-b-[10px]",
							"dark:bg-[#444] sm:dark:bg-[#333] dark:border-[#000] z-20"
						)}
					>
						{options
							.filter((option) => {
								if (!isEditing || !actualMembers) return true;
								return actualMembers.length <= (option.label as number);
							})
							.map((option) => (
								<li
									onClick={() => {
										toggleOptionHandler();
										onChange(option.value);
									}}
									key={option.value}
									className="sm:w-full px-5 py-2 rounded-sm hover:bg-[#E0F4F2] hover:text-[#06b796] cursor-pointer dark:hover:text-[#333]"
								>
									{option.label}
								</li>
							))}
					</ul>
				)}
			</div>
		</div>
	);
}
