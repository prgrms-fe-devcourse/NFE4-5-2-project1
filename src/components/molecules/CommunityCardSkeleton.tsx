export default function CommunityCardSkeleton() {
  return (
    <div className="dark:bg-dark-card dark:border-dark-border h-[340px] w-[270px] animate-pulse rounded-[6px] border border-[#d9d9d9]">
      {/* 상단 이미지 or 배경 */}
      <div className="dark:bg-dark-border relative h-[55%] rounded-t-[5px] bg-gray-300" />

      {/* 하단 텍스트 영역 */}
      <div className="flex h-[45%] flex-col justify-between">
        {/* 제목 및 본문 영역 */}
        <div className="h-[90px] p-[15px]">
          <div className="dark:bg-dark-border mb-[10px] h-[16px] w-[80%] rounded bg-gray-300" />
          <div className="dark:bg-dark-border h-[14px] w-[100%] rounded bg-gray-200" />
          <div className="dark:bg-dark-border mt-[4px] h-[14px] w-[100%] rounded bg-gray-200" />
        </div>

        {/* 하단 유저 정보 + 좋아요/댓글 */}
        <div className="dark:border-dark-border mx-[10px] flex h-[60px] items-center justify-between border-t border-[#d9d9d9] px-[5px] py-[10px]">
          {/* 유저 정보 */}
          <div className="flex translate-y-[-1px] items-center space-x-2">
            <div className="dark:bg-dark-border h-[30px] w-[30px] rounded-full bg-gray-300" />
            <div className="flex flex-col">
              <div className="dark:bg-dark-border h-[10px] w-[80px] rounded bg-gray-300" />
              <div className="dark:bg-dark-border mt-[4px] h-[8px] w-[40px] rounded bg-gray-200" />
            </div>
          </div>

          {/* 좋아요/댓글 영역 */}
          <div className="flex space-x-2">
            <div className="dark:bg-dark-border h-[20px] w-[30px] rounded bg-gray-300" />
            <div className="dark:bg-dark-border h-[20px] w-[30px] rounded bg-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
