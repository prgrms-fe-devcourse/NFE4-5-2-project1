export default function QuestionCardSkeleton() {
  return (
    <div className="dark:border-dark-border dark:bg-dark-card flex h-[190px] w-[100%] animate-pulse flex-col justify-between rounded-[5px] border border-[#d9d9d9]">
      {/* 제목 & 본문 */}
      <div className="flex flex-col p-[15px] pt-[16px]">
        <div className="mb-[8px] flex items-center gap-[5px]">
          <div className="dark:bg-dark-border h-[16px] w-[70%] rounded bg-gray-300" />
        </div>
        <div className="dark:bg-dark-border h-[14px] w-[100%] rounded bg-gray-200" />
        <div className="dark:bg-dark-border mt-[4px] h-[14px] w-[100%] rounded bg-gray-200" />
      </div>

      {/* 태그 */}
      <div className="relative flex gap-[5px] overflow-hidden pb-[10px] pl-[15px] whitespace-nowrap">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="dark:bg-dark-border h-[24px] w-[50px] rounded-[2px] bg-gray-300 px-[9px] py-[5px]"
          />
        ))}
        <div className="dark:to-dark-card absolute right-[15px] h-[30px] w-[15px] bg-gradient-to-r from-transparent to-white" />
        <div className="dark:bg-dark-card absolute right-0 h-[30px] w-[15px] bg-white" />
      </div>

      {/* 하단 유저 정보 + 관심 */}
      <div className="dark:border-dark-border mx-[10px] flex h-[60px] items-center justify-between border-t border-[#d9d9d9] px-[5px]">
        {/* 유저 정보 */}
        <div className="flex translate-y-[-2px] items-center space-x-2">
          <div className="dark:bg-dark-border h-[30px] w-[30px] rounded-full bg-gray-300" />
          <div className="flex flex-col">
            <div className="dark:bg-dark-border h-[10px] w-[80px] rounded bg-gray-300" />
            <div className="dark:bg-dark-border mt-[4px] h-[8px] w-[40px] rounded bg-gray-200" />
          </div>
        </div>

        {/* 좋아요, 댓글 */}
        <div className="flex space-x-2">
          <div className="dark:bg-dark-border h-[20px] w-[30px] rounded bg-gray-300" />
          <div className="dark:bg-dark-border h-[20px] w-[30px] rounded bg-gray-300" />
        </div>
      </div>
    </div>
  );
}
