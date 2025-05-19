import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Option = {
  label: string;
  value: string;
};

type SelectBoxProps = {
  options: Option[];
  value: Option | null;
  onChange: (selected: Option) => void;
};

export default function SelectBox({
  options,
  value,
  onChange,
}: SelectBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outsideClickHandler = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", outsideClickHandler);
    return () => document.removeEventListener("mousedown", outsideClickHandler);
  }, [setIsOpen]);

  const selectHandler = (option: Option) => {
    onChange(option);
    setIsOpen(false);
  };
  return (
    <>
      <div className="relative w-full" ref={selectRef}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`rounded-[10px] w-full text-left cursor-pointer border px-2 py-2 ${
            isOpen || value
              ? "border-[color:var(--primary-200)] text-[color:var(--white)]"
              : "border-[color:var(--white-80)]"
          }`}
        >
          <div
            className={`flex py-2 w-full justify-between px-2 ${
              value
                ? "text-[color:var(--white)]"
                : "text-[color:var(--white-80)]"
            }`}
          >
            <span className="pl-1 mr-1">{value?.label || "선택하세요"}</span>
            {isOpen ? (
              <ChevronUp strokeWidth={1.5} />
            ) : (
              <ChevronDown strokeWidth={1.5} />
            )}
          </div>
        </button>
        {isOpen && (
          <ul className="absolute left-0 right-0 mt-1 border rounded-[10px] bg-[color:var(--bg-color)] shadow z-10 max-h-60 overflow-y-auto border-[color:var(--primary-200)] scrollbar-hide">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => selectHandler(option)}
                className="px-4 py-2 hover:bg-[color:var(--grey-600)] cursor-pointer"
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
