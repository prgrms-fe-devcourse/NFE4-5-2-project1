import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToastErrorIcon from "../../assets/images/toast_error.svg";
import ToastSuccessIcon from "../../assets/images/toast_success.svg";
import ToastWarningIcon from "../../assets/images/toast_warning.svg";
import Icon from "./Icon";

interface ToastProps {
	type: "warning" | "success" | "error";
	message?: string;
}

const toastBase =
	"w-full h-[56px] flex items-center justify-between px-[10px] py-[10px] sm:px-[15px] sm:py-[18px] rounded-[6px] border shadow-sm gap-3";

const toastStyles = {
	warning: "bg-[#FFFDEB] border-[#E6A316] text-[#763C0C]",
	success: "bg-[#E0F4F2] border-[#06B796] text-[#104A37]",
	error: "bg-[#FDF4F3] border-[#DB1F5A] text-[#A71543]"
};

const icons = {
	warning: ToastWarningIcon,
	success: ToastSuccessIcon,
	error: ToastErrorIcon
};

const closeIconStyles = {
	warning: { position: "-128px -8px", size: "20px" },
	success: { position: "-148px -8px", size: "20px" },
	error: { position: "-168px -8px", size: "20px" }
};

export function showToast({ type, message }: ToastProps) {
	const icon = icons[type];
	const colorStyle = toastStyles[type];
	const closeIcon = closeIconStyles[type];

	const isMobile = window.innerWidth <= 640;

	const content = (
		<div
			className={`${toastBase} ${colorStyle} relative sm:top-0 top-[-100px] left-[30px]`}
		>
			<div className="flex items-center gap-2">
				<img src={icon} alt={`${type} icon`} className="w-[19Px] h-[19px]" />
				<p className="font-medium text-[16px]">
					{message || defaultMessage(type)}
				</p>
			</div>
			<button
				className="cursor-pointer hover:opacity-70"
				onClick={() => toast.dismiss()}
			>
				<Icon position={closeIcon.position} size={closeIcon.size} />
			</button>
		</div>
	);

	toast(content, {
		position: isMobile ? "bottom-center" : "top-center",
		autoClose: 2500,
		hideProgressBar: true,
		closeOnClick: false,
		pauseOnHover: true,
		draggable: true,
		closeButton: false
	});
}

function defaultMessage(type: "success" | "error" | "warning") {
	switch (type) {
		case "success":
			return "성공적으로 완료되었습니다";
		case "error":
			return "문제가 발생했습니다";
		case "warning":
			return "주의: 확인이 필요합니다";
	}
}
