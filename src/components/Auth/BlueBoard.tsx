import { twMerge } from "tailwind-merge";
import { ReactNode } from "react";

export default function BlueBoard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <>
      <div
        className={twMerge(
          "w-full max-w-[500px] min-w-[500px] rounded-[5px] px-[34px] py-[29px] dark:bg-[#444444] bg-white shadow-[0_0_4px_rgba(0,51,160,0.25)] dark:shadow-[0_0_4px_rgba(255,255,255,0.2)]",
          className
        )}
      >
        {children}
      </div>
    </>
  );
}
