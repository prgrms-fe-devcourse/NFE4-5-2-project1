import React, { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import watermark from "../../assets/images/watermark.png";

export default function InputBoard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): React.JSX.Element {
  return (
    <>
      <div
        className={twMerge(
          `w-full h-screen flex flex-col items-center justify-center px-[16px] dark:bg-[#16171B] bg-no-repeat bg-left-bottom`,
          className
        )}
        style={{ backgroundImage: `url(${watermark})` }}
      >
        {children}
      </div>
    </>
  );
}
