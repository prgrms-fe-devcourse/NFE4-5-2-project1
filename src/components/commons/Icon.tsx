import { twMerge } from "tailwind-merge";

export default function Icon({
	size,
	position,
	hoverPosition,
	hovered,
	onClick,
	className
}: {
	size?: string | undefined;
	position?: string | undefined;
	hovered?: boolean;
	hoverPosition?: string;
	onClick?: () => void;
	className?: string;
}) {
	return (
		<span
			className={twMerge(
				`group-hover:[] inline-block bg-no-repeat bg-[url('/images/spriteImages.png')]`,
				className
			)}
			style={{
				width: size,
				height: size,
				backgroundPosition: hovered ? hoverPosition : position,
				backgroundSize: "245px 380px"
			}}
			onClick={onClick}
		/>
	);
}
