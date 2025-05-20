import React from 'react';

export default function Button({
  full,
  size,
  onClick,
  children,
}: {
  full?: boolean;
  size: 's' | 'm' | 'l';
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className={`nanum-gothic-regular cursor-pointer rounded border duration-200 hover:brightness-120 active:scale-95 ${
        full
          ? 'border-[#6B4C36] bg-[#6B4C36] text-white'
          : 'dark:border-dark-border dark:text-dark-text'
      } ${
        size === 's' &&
        `h-[30px] w-[70px] text-xs text-[10px] ${full ? 'border-[#A9907E] bg-[#A9907E]' : ''}`
      } ${size === 'm' && 'h-[35px] w-[85px] text-sm'} ${size === 'l' && 'text-basic h-[50px] w-[350px]'} `}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
