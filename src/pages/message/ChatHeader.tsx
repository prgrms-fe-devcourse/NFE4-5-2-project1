import backBtn from '../../assets/images/message/arrow-back-outline.svg';
import backBtnWhite from '../../assets/images/message/arrow-back-white.svg';
import closeBtn from '../../assets/images/message/close-outline.svg';
import closeBtnWhite from '../../assets/images/message/close-white.svg';
import { Theme } from '../../types/darkModeTypes';
import { dark } from '../../utils/darkModeUtils';

interface ChatHeaderProps {
  userName?: string;
  onBack?: () => void;
  onClose: () => void;
  theme: Theme;
}

export default function ChatHeader({
  userName,
  onBack,
  onClose,
  theme,
}: ChatHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between p-[20px]  rounded-t-[5px] ${
        dark(theme)
          ? 'bg-[#2d2d2d] text-[#ffffff] border-b border-b-white/40'
          : 'bg-[#ffffff] border-b border-b-[#DEDEDE]'
      }`}
    >
      {onBack ? (
        <img
          src={`${dark(theme) ? backBtnWhite : backBtn}`}
          onClick={onBack}
          className="w-[24px] h-[24px]  mr-2 cursor-pointer opacity-60"
        />
      ) : (
        <div className="w-4" /> // 공간 맞춤용
      )}

      <p
        className={`text-[18px] font-medium flex-1 text-center ${
          dark(theme) ? 'text-[#ffffff]/' : 'text-[#4d4d4d]'
        }`}
      >
        {userName || 'Message'}
      </p>

      <img
        src={`${dark(theme) ? closeBtnWhite : closeBtn}`}
        onClick={onClose}
        className=" w-[24px] h-[24px] ml-2 cursor-pointer opacity-60"
      />
    </div>
  );
}
