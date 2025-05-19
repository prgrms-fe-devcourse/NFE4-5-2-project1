import { useEffect, useState } from "react";
import { Theme } from "../../types/darkModeTypes";
import { dark } from "../../utils/darkModeUtils";

interface PollOption {
  id: number;
  text: string;
  voteCount: number;
}

interface PollCreatorProps {
  onCreate: (options: PollOption[]) => void;
  theme: Theme;
}

export default function PollCreator({ onCreate, theme }: PollCreatorProps) {
  const [options, setOptions] = useState<string[]>(["", ""]);

  const handleAddOption = () => {
    if (options.length < 4) setOptions([...options, ""]);
  };

  const handleChangeOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // 옵션이 변경될 때마다 부모에 전달
  useEffect(() => {
    if (options.length >= 2) {
      const pollOptions = options
        .filter((opt) => opt.trim() !== "")
        .map((text, idx) => ({
          id: idx,
          text,
          voteCount: 0, // 추가: 기본값
        }));
      onCreate(pollOptions);
    }
  }, [options, onCreate]);

  return (
    <div
      className={`p-4 max-w-md mt-[25px] mb-[25px] rounded border ${
        dark(theme) ? "bg-[#1e1e1e]" : "bg-[#ffffff]"
      }`}
    >
      <h2 className='text-xl font-bold mb-2'>투표 생성하기</h2>
      {options.map((opt, i) => (
        <input
          key={i}
          className={`w-full border p-2 mb-2 rounded bg-transparent
            ${
              dark(theme)
                ? "bg-[#2d2d2d] text-white placeholder-[#bbbbbb]"
                : "bg-white text-black placeholder-[#999999]"
            }`}
          placeholder={`항목 ${i + 1}`}
          value={opt}
          onChange={(e) => handleChangeOption(i, e.target.value)}
        />
      ))}
      {options.length < 4 && (
        <button
          className='text-blue-500 text-sm mb-2'
          onClick={handleAddOption}
        >
          + 항목 추가
        </button>
      )}
    </div>
  );
}
