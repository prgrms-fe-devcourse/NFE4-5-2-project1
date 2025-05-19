import { ChevronLeft } from "lucide-react";

export const PlaylistHeader = ({
  displayName,
  onBack,
}: {
  displayName: string | null;
  onBack: () => void;
}) => (
  <header className="flex items-center  px-[18px]">
    <ChevronLeft
      className="cursor-pointer hover:text-gray-400 transition-colors"
      onClick={onBack}
      aria-label="뒤로 가기"
    />
    <div className="flex gap-4 text-[14px] md:text-[20px] font-bold px-4">
      <h2>{displayName}님의 PlayList</h2>
      <span role="img" aria-label="eyes">
        👀
      </span>
    </div>
  </header>
);
