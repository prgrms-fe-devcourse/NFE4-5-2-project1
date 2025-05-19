import { FaCamera, FaRegTrashAlt, FaUserCircle } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import { useRef } from "react";
import { handleimageChange, handleimageRemove } from "./imageChange.ts";
import { userStore } from "../../stores/userStore";
import { ExtendedUser } from "../../types/postType.ts";

export default function ProfileImage({ className }: { className: string }) {
  const user = userStore((state) => state.user) as ExtendedUser;

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div
        className={twMerge(
          "relative w-[116px] h-[116px] min-w-[116px] min-h-[116px]",
          className
        )}
      >
        <div className="bg-[#fff] overflow-hidden w-full h-full rounded-full flex items-center justify-center">
          {user?.image ? (
            <img
              src={user.image}
              alt="프로필 이미지"
              className="w-full h-full object-cover"
            ></img>
          ) : (
            <FaUserCircle className="text-[#2F6BEB] text text-[134px]" />
          )}
        </div>
        <div className="absolute cursor-pointer box-content w-[30px] h-[30px] top-[-4px] right-[-4px] bg-[#ABABAB] dark:bg-[#fff] rounded-full p-1 flex items-center justify-center border-white border-[4px] overflow-hidden dark:border-[#4F4F4F]">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleimageChange(e)}
            ref={inputRef}
            className="sr-only"
          ></input>
          {user?.image ? (
            <FaRegTrashAlt
              onClick={handleimageRemove}
              className="text-[#fff] text-[20px] dark:text-[#262626]"
            />
          ) : (
            <FaCamera
              onClick={() => inputRef.current!.click()}
              className="text-[#fff] text-[20px] dark:text-[#262626]"
            />
          )}
        </div>
      </div>
    </>
  );
}
