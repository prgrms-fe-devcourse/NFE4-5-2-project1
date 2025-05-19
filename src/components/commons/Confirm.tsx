import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";

export default function Confirm({
	confirmHandler,
	cancelHandler,
	title,
	description,
	confirmBtn
}: {
	confirmHandler: () => void;
	cancelHandler: () => void;
	title: string;
	description: string;
	confirmBtn: string;
}) {
	return createPortal(
		<>
			<div className="fixed inset-0 bg-black opacity-30 z-50" />
			<div className="max-w-120 w-3/4 h-[150px] p-5 border-b-3 border-[#db1f5a] bg-white rounded-lg shadow-lg fixed top-4 left-1/2 -translate-x-1/2 z-51">
				<h3 className="font-medium mb-[13px] text-[#333]">{title}</h3>
				<span className="text-sm text-[#616161]">{description}</span>
				<div className="flex gap-[10px] justify-end mt-4">
					<button
						type="button"
						onClick={confirmHandler}
						className={twMerge(
							"w-[110px] h-[33px] border-1 border-transparent text-[#db1f5a] rounded-[10px]",
							"sm:hover:bg-[#FDF4F3] sm:hover:border-[#db1f5a] cursor-pointer",
							"active:bg-[#FDF4F3] active:border-[#db1f5a]"
						)}
					>
						{confirmBtn}
					</button>
					<button
						type="button"
						onClick={cancelHandler}
						className={twMerge(
							"w-[110px] h-[33px] border border-[#db1f5a] text-white bg-[#db1f5a] rounded-[10px]",
							"sm:hover:bg-white sm:hover:text-[#db1f5a] cursor-pointer",
							"active:bg-white active:text-[#db1f5a]"
						)}
					>
						취소
					</button>
				</div>
			</div>
		</>,
		document.body
	);
}
