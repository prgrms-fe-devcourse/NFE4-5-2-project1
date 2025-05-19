import { useState } from "react";
import EyeOn from "../assets/icons/eyeOn.svg";
import EyeOff from "../assets/icons/eyeOff.svg";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export default function PasswordInput({ label, value, onChange }: Props) {
  const [hide, setHide] = useState(true);

  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <p>{label}</p>
      <div className="flex items-center bg-white rounded-xl border border-[#c2c2c2] h-10 px-3 focus-within:outline">
        <input
          type={hide ? "password" : "text"}
          className="flex-1 bg-transparent outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <img
          src={hide ? EyeOff : EyeOn}
          alt="비밀번호 보기 토글"
          className="cursor-pointer ml-2 w-5 h-5"
          onClick={() => setHide((prev) => !prev)}
        />
      </div>
    </div>
  );
}
