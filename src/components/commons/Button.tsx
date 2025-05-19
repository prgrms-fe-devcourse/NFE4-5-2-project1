import { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
	reverse?: boolean;
};

export default function Button(props: ButtonProps) {
	const { children, className, reverse, ...rest } = props;
	return (
		<button
			{...rest}
			className={twMerge(
				"flex justify-center items-center h-15 text-xl rounded-[10px] py-[17.5px] text-center font-bold cursor-pointer box-border transition-all duration-300",
				reverse
					? "bg-white text-[#06b796] border-2 border-[#06b796] sm:hover:bg-[#E0F4F2] active:bg-[#E0F4F2]"
					: "bg-[#06b796] text-white sm:hover:bg-[#038383] active:bg-[#038383] disabled:hover:bg-[#808080] ",
				className
			)}
			{...rest}
		>
			{children}
		</button>
	);
}
