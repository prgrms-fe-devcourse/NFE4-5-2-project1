import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
};

export default function Input({
  type = 'text',
  icon,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="relative flex items-center">
      {/* 아이콘  */}
      {icon && (
        <span className="pointer-events-none absolute left-[10px] flex items-center">
          {icon}
        </span>
      )}
      <input
        type={type}
        className={` ${icon ? 'pl-10' : ''} dark:placeholder-dark-border nanum-gothic-regular rounded-[5px] border px-[20px] text-[16px] placeholder-[#ababab] ${className} `}
        {...props}
      />
    </div>
  );
}
