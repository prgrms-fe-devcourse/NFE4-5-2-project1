import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function BackButton({ from = -1 }: { from?: number | string }) {
  const navigate = useNavigate();

  const clickHandler = () => {
    if (typeof from === "number") {
      navigate(from);
    } else {
      navigate(from);
    }
  };

  return (
    <button
      className="flex px-[18px] py-[8px] gap-[8px] text-[16px] text-[color:var(--grey-300)] justify-center items-center cursor-pointer hover:text-[color:var(--primary-300)] group"
      onClick={() => clickHandler()}
    >
      <ChevronLeft className="w-[24px] h-[24px] text-[color:var(--grey-300)] group-hover:text-[color:var(--primary-300)]" />
      BACK
    </button>
  );
}
