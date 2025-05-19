import { twMerge } from "tailwind-merge";

export default function ErrorMessage({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <>
      <p
        className={twMerge(
          "absolute text-[13px] text-[#CC0000] top-[43px] left-[5px] cursor-default font-sans",
          className
        )}
      >
        {children}
      </p>
    </>
  );
}
