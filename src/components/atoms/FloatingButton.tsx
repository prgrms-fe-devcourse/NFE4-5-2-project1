import { twMerge } from 'tailwind-merge';
import plus from '../../assets/images/plus.png';
import chat from '../../assets/images/chat.png';
import like from '../../assets/images/like.png';
import likeFilled from '../../assets/images/like_filled.png';

const baseStyles = `
  w-[60px] h-[60px]
  bg-[#A9907E]
  rounded-full
  shadow-[0_4px_4px_rgba(0,0,0,0.25)]
  cursor-pointer
  flex items-center justify-center
  dark:shadow-[0_4px_4px_rgba(0,0,0,1)]
  hover:bg-[#9E7A60]
  dark:bg-[#9E7A60]
  dark:hover:bg-[#825D42]
  duration-300
  ease-in-out
`;

type ButtonType = 'write' | 'chat' | 'like';

interface Props {
  buttonType: ButtonType;
  isLiked?: boolean; // 좋아요 상태 외부에서 전달
  count?: number; // 좋아요 카운트 외부에서 전달
  onWrite?: () => void; // 글쓰기 클릭 핸들러
  onChat?: () => void; // 채팅 클릭 핸들러
  onLike?: () => void; // 좋아요 클릭 핸들러
}

export default function FloatingButton({
  buttonType,
  isLiked = false,
  count = 0,
  onWrite,
  onChat,
  onLike,
}: Props) {
  const handleClick = () => {
    if (buttonType === 'write') {
      onWrite?.();
    } else if (buttonType === 'chat') {
      onChat?.();
    } else if (buttonType === 'like') {
      onLike?.();
    }
  };

  let iconSrc: string;
  let altText: string;

  switch (buttonType) {
    case 'write':
      iconSrc = plus;
      altText = '글쓰기';
      break;
    case 'chat':
      iconSrc = chat;
      altText = '채팅';
      break;
    case 'like':
      iconSrc = isLiked ? likeFilled : like;
      altText = '좋아요';
      break;
    default:
      iconSrc = '';
      altText = '';
  }

  const wrapperClass = buttonType === 'like' ? 'flex-col' : '';
  const imgClass = buttonType === 'chat' ? 'relative top-0.5 right-[1px]' : '';

  return (
    <button
      type="button"
      onClick={handleClick}
      className={twMerge(baseStyles, wrapperClass)}
    >
      <img src={iconSrc} alt={altText} className={imgClass} />
      {buttonType === 'like' && (
        <span className="text-[12px] text-white">{count}</span>
      )}
    </button>
  );
}
