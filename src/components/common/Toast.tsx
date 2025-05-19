import { toast } from "react-toastify";
import { CircleAlert, CircleCheckBig } from "lucide-react";

export const showSuccessToast = (message: string) =>
  toast.success(
    <div className="flex items-center gap-3 text-sm font-medium text-[color:var(--white)]">
      <CircleCheckBig className="w-5 h-5 text-[color:var(--primary-300)]" />
      <span>{message}</span>
    </div>,
    {
      icon: false,
      hideProgressBar: true,
      className:
        "bg-[color:var(--bg-color)]  border border-[color:var(--primary-300)] rounded-xl px-5 py-3 shadow-lg",
      style: {
        background: "var(--bg-color) ",
        backgroundColor: "var(--bg-color) ",
      },
      progressClassName: "bg-[color:var(--primary-300)]",
    }
  );

export const showErrorToast = (message: string) =>
  toast.error(
    <div className="flex items-center gap-3 text-sm font-medium text-[color:var(--white)]">
      <CircleAlert className="w-5 h-5 text-[color:var(--red)]" />
      <span>{message}</span>
    </div>,
    {
      icon: false,
      hideProgressBar: true,
      className:
        "bg-[color:var(--bg-color)]  border border-[color:var(--red)] rounded-xl px-5 py-3 shadow-lg",
      style: {
        background: "var(--bg-color) ",
        backgroundColor: "var(--bg-color) ",
      },
      progressClassName: "bg-[color:var(--red)]",
    }
  );
