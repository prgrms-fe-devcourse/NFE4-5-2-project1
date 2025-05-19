import { Link } from "react-router";
import { twMerge } from "tailwind-merge";
import logo from "../../assets/images/logo.png";

export default function Logo({ className }: { className?: string }) {
  return (
    <>
      <Link to={"/"} aria-label="로고 이미지 클릭 시 홈으로 이동">
        <img
          src={logo}
          className={twMerge("w-[430px] mb-[21px] cursor-pointer", className)}
          alt="로고 이미지"
        />
      </Link>
    </>
  );
}
