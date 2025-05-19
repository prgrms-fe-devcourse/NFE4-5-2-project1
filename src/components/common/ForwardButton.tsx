import {ChevronRight} from "lucide-react";
import {useNavigate} from "react-router";

type ForwardButtonProps = {
  to: string;
  label?: string;
  state?: {
    authorId: string;
    username: string;
  };
};

export default function ForwardButton({to, label = "작성 글 보기", state}: ForwardButtonProps) {
  const navigate = useNavigate();

  const clickHandler = () => {
    navigate(to, {state});
  };

  return (
    <button
      className='flex px-[18px] py-[8px] gap-[8px] text-[16px] text-[color:var(--grey-300)] justify-center items-center cursor-pointer hover:text-[color:var(--primary-300)] group'
      onClick={clickHandler}
    >
      {label}
      <ChevronRight className='w-[24px] h-[24px] text-[color:var(--grey-300)] group-hover:text-[color:var(--primary-300)]' />
    </button>
  );
}
