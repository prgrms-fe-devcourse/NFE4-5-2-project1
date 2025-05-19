import { twMerge } from "tailwind-merge";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  className,
  disabled,
}: ButtonProps) {
  return (
    <>
      <button
        onClick={onClick}
        disabled={disabled}
        className={twMerge(
          `
        text-[16px] w-[90px] h-[35px] rounded-[10px] flex items-center justify-center 
        transition 
        ${
          disabled
            ? "bg-gray-300 dark:bg-gray-600 text-white cursor-not-allowed"
            : "bg-[#0033A0] text-white cursor-pointer hover:bg-white hover:border hover:border-[#0033A0] hover:text-[#0033A0] dark:bg-[#235BD2]"
        }
        `,
          className
        )}
      >
        {children}
      </button>
    </>
  );
}
