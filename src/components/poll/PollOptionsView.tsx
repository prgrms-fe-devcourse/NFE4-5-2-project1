import { Theme } from '../../types/darkModeTypes';
import { dark } from '../../utils/darkModeUtils';

interface PollOption {
  id: number;
  text: string;
}

interface PollOptionsViewProps {
  options: PollOption[];
  theme: Theme;
}

export default function PollOptionsView({
  options,
  theme,
}: PollOptionsViewProps) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((option) => (
        <div
          key={option.id}
          className={`px-4 py-2  rounded  cursor-default ${
            dark(theme)
              ? 'bg-[#1e1e1e] text-[#ffffff] border border-neutral-600'
              : 'border border-gray-300  text-gray-700 bg-gray-100'
          }`}
        >
          {option.text}
        </div>
      ))}
    </div>
  );
}
