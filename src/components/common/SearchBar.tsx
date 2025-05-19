import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "검색어 입력",
  className = "",
}: SearchBarProps) {
  return (
    <>
      <div className={`relative ${className}`}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[color:var(--white-80)]" />
        <input
          type="text"
          className="w-full border border-[color:var(--white-80)] pl-12 pr-4 rounded-[10px] text-[16px] h-[40px] focus:outline-none focus:border-[color:var(--primary-200)] bg-transparent text-[color:var(--white)]"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </>
  );
}
