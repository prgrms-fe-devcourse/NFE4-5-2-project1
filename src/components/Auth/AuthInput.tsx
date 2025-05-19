import { twMerge } from "tailwind-merge";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useState } from "react";

type InputTypes = {
  placeholder: string;
  className?: string;
  type: string;
  value?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

export default function Input({
  placeholder,
  className,
  type,
  value,
  name,
  onChange,
  onFocus,
  onKeyDown,
  onBlur,
}: InputTypes) {
  const [passwordShow, setPasswordShow] = useState(true);

  return (
    <>
      {type !== "password" ? (
        <input
          className={twMerge(
            "mb-[30px] w-full h-[40px] focus:outline-[#444444] dark:focus:outline-[#444444] text-[#696969] px-[4px] border-b border-[#0033A0] dark:border-[#fff] font-semibold dark:text-white dark:placeholder:text-white",
            className
          )}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          type={type}
          value={value}
          name={name}
        ></input>
      ) : (
        <div className={twMerge("w-full mb-[30px] relative", className)}>
          <input
            className="w-full h-[40px] focus:outline-[#444444] dark:focus:outline-[#444444] text-[#696969] px-[4px] border-b border-[#0033A0] dark:border-[#fff] font-semibold dark:text-white dark:placeholder:text-white"
            placeholder={placeholder}
            type={passwordShow ? "password" : "text"}
            value={value}
            onBlur={onBlur}
            onChange={onChange}
            onFocus={onFocus}
            name={name}
            onKeyDown={onKeyDown}
          ></input>
          <button
            onClick={() => {
              setPasswordShow((passwordShow) => !passwordShow);
            }}
            type="button"
            aria-label={passwordShow ? "비밀번호 보기" : "비밀번호 가리기"}
            className="absolute right-2 top-[8px] cursor-pointer"
          >
            {passwordShow ? (
              <IoEyeOutline className="text-[#909090] text-[24px]" />
            ) : (
              <IoEyeOffOutline className="text-[#909090] text-[24px]" />
            )}
          </button>
        </div>
      )}
    </>
  );
}
