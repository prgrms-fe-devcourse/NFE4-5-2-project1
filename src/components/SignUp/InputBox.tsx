import { ReactNode } from "react";

export default function inputBox({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="w-full flex gap-[20px] mb-[35px] items-center relative">
        {children}
      </div>
    </>
  );
}
