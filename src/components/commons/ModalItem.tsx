import { useHover } from "react-use";
import { twMerge } from "tailwind-merge";
import Icon from "./Icon";

export default function ModalItem(props: {
	children: React.ReactNode;
	clickHandler: () => void;
	size?: string;
	position?: string;
	hoverPosition?: string;
	noIcon?: boolean;
}) {
	const { children, clickHandler, noIcon, ...rest } = props;
	const element = (hovered: boolean) => (
		<li
			onClick={clickHandler}
			className={twMerge(
				"flex gap-2 items-center group cursor-pointer p-2 rounded-lg hover:bg-[#E0F4F2] hover:text-[#06B796] dark:hover:bg-[#B8E1E1]",
				"sm:text-base text-sm"
			)}
		>
			{!noIcon && <Icon hovered={hovered} {...rest} />}
			{children}
		</li>
	);
	const [hoverable] = useHover(element);
	return <div>{hoverable}</div>;
}
