import React, { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
type Button = {
  className?: string;
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function AuthButton({
  className,
  children,
  onClick,
}: Button): React.JSX.Element {
  return (
    <>
      <button
        onClick={onClick}
        className={twMerge(
          "text-[20px] w-full h-[65px] cursor-pointer bg-[rgba(0,51,160,1)] font-semibold text-white rounded-[10px] flex items-center justify-center",
          className
        )}
      >
        {children}
      </button>
    </>
  );
}
