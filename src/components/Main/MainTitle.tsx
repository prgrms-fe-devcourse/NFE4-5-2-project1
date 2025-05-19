import { twMerge } from "tailwind-merge";
export default function MainTitle({
  title,
  color,
  white = false,
}: {
  title: string;
  color: string;
  white?: boolean;
}) {
  let className = "";
  if (color === "#0033A0") {
    className += "border-[#0033A0] dark:border-[#00aeef]";
  } else {
    className += `border-[#FF9500]`;
  }

  return (
    <span
      className={twMerge(
        "text-2xl font-bold border-b-4 pb-2 dark:text-white kbo-font-medium",
        white ? "text-white" : "text-black",
        className
      )}
    >
      {title}
    </span>
  );
}
