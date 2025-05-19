import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import countries from "../../../assets/data/world.json";

export default function AutoComplete() {
	const { control, setValue } = useFormContext();
	const watchedLoaction = useWatch({
		control,
		name: "location"
	});
	const [list, setList] = useState<string[]>([]);
	const locationHandler = (location: string) => {
		setValue("location", location, { shouldDirty: true });
	};

	useEffect(() => {
		setList(
			countries
				.filter((item) => item.name.includes(watchedLoaction || ""))
				.map((item) => item.name)
				.sort((a, b) => a.indexOf(watchedLoaction) - b.indexOf(watchedLoaction))
		);
	}, [watchedLoaction]);
	return (
		<ul
			className={twMerge(
				"absolute sm:top-[54px] top-12 right-0 w-full max-h-45 overflow-hidden border-1 border-[#d6d6d6] p-2 bg-white rounded-b-[10px]",
				"dark:bg-[#333] dark:border-[#000] z-20"
			)}
		>
			{list.length > 0 ? (
				list.map((location, index) => (
					<li
						key={index}
						className="px-3 py-2 rounded-sm hover:bg-[#E0F4F2] hover:text-[#06b796] cursor-pointer dark:hover:text-[#333]"
						onMouseDown={() => locationHandler(location)}
					>
						{location}
					</li>
				))
			) : (
				<li className="px-3 py-2 text-gray-400 dark:text-[#dadada]">
					결과 없음
				</li>
			)}
		</ul>
	);
}
