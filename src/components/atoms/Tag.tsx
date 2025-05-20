import { ReactNode } from 'react';

interface TagProps {
  children: ReactNode;
  className?: string;
}
export default function Tag({ children }: TagProps) {
  return (
    <>
      <span className="nanum-gothic-regular inline-flex items-center rounded-[2px] bg-[#D7CAB9] px-[9px] py-[3px] text-[12px] text-[#000]">
        {children}
      </span>
    </>
  );
}
