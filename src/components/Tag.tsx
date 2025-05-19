import { twMerge } from "tailwind-merge";

type TagProps = {
  icon?: string;
  label: string;
  selected?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
};

export default function Tag({ icon, label, selected, onClick }: TagProps) {
  return (
    <div
      onClick={onClick}
      className={twMerge(
        "w-42 h-8 border border-[#949494] rounded-[19px] text-[#949494] mx-3 my-1.5 flex items-center gap-1 px-5 cursor-pointer hover:text-[var(--color-main-skyBlue)] hover:border-[var(--color-main-skyBlue)] hover:border-2 transition-all duration-200",
        selected &&
          "border-[var(--color-main-skyBlue)] text-[var(--color-main-skyBlue)] border-2"
      )}
    >
      {icon && <img src={icon} className="w-5" alt="tag icon" />}
      <span className="flex items-center justify-center w-full text-[15px] ">
        {label}
      </span>
    </div>
  );
}
