import React from "react";

export default React.memo(function LeftMessageBox({
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
      rounded = "rounded-tl-[20px]";
      break;
    case "rounded-b":
      rounded = "rounded-bl-[20px]";
      break;
  }

  return (
    <>
      <div className="flex items-end md:gap-4 gap-2">
        <div
          className={`flex items-center md:min-h-[48px] max-w-[400px] bg-[var(--grey-500)] rounded-tr-[20px] rounded-br-[20px] ${rounded} text-sm md:text-sm lg:text-base font-regular px-4 py-2`}
        >
          {text}
        </div>
        <span className="text-[0.75rem] text-[var(--grey-400)] font-regular">
          {time}
        </span>
      </div>
    </>
  );
});
