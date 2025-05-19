import { CircleCheckBig, CircleAlert } from "lucide-react";

type StatusModalProps = {
  message: string;
  onClose: () => void;
  type?: "success" | "error";
};

export default function StatusModal({
  message,
  onClose,
  type = "success",
}: StatusModalProps) {
  const isSuccess = type === "success";
  const iconColor = isSuccess
    ? "text-[color:var(--primary-200)]"
    : "text-[color:var(--red)]";
  const Icon = isSuccess ? CircleCheckBig : CircleAlert;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
        <div className="bg-[color:var(--bg-color)] p-10 rounded-3xl shadow-lg text-center w-[320px] flex flex-col items-center gap-2">
          <Icon className={`${iconColor} mb-4 w-8 h-8`} />
          <p className="mb-4 text-lg font-regular">{message}</p>
          <button
            className="px-6 py-2 bg-[color:var(--primary-200)] text-[color:var(--bg-color)] rounded-3xl cursor-pointer text-sm transform transition-transform duration-300 hover:scale-105"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </>
  );
}
