import React from "react";

export default React.memo(function RightMessageBox({
  text,
  time,
  className,
}: {
  text: string;
  time: string;
  className?: string;
}) {
  let rounded = "";

  switch (className) {
    case "rounded-t":
      rounded = "rounded-tr-[20px]";
      break;

    case "rounded-b":
      rounded = "rounded-br-[20px]";
      break;
  }

  return (
    <>
      <div className="flex items-end md:gap-4 gap-2 self-end">
        <span className="text-[0.75rem] text-[var(--grey-400)] font-regular">
          {time}
        </span>
        <div
          className={`flex items-center md:min-h-[44px] max-w-[400px] bg-[var(--primary-300)] rounded-tl-[20px] rounded-bl-[20px] ${rounded} text-sm md:text-sm lg:text-base text-black font-regular px-4 py-2`}
        >
          {text}
        </div>
      </div>
    </>
  );
});
