export default function UserCardSkeleton() {
  return (
    <div className="dark:border-dark-border dark:bg-dark-card flex h-[140px] w-[310px] animate-pulse gap-4 rounded-[5px] border border-[#d9d9d9] p-5">
      {/* Avatar + 상태 indicator */}
      <div className="relative flex-shrink-0">
        <div className="dark:bg-dark-border h-[100px] w-[100px] rounded-full bg-gray-300" />
      </div>

      {/* 텍스트 정보 */}
      <div className="flex flex-1 flex-col justify-evenly gap-3">
        {/* 이름 */}
        <div className="flex flex-col gap-2">
          <div className="dark:bg-dark-border h-[16px] w-[100px] rounded bg-gray-300" />

          {/* 태그 2개 */}
          <div className="flex flex-wrap gap-1">
            {[...Array(2)].map((_, idx) => (
              <div
                key={idx}
                className="dark:bg-dark-border h-[24px] w-[60px] rounded-[2px] bg-gray-300"
              />
            ))}
          </div>
        </div>

        {/* 팔로우/팔로워 */}
        <div className="flex gap-2 text-[12px]">
          <div className="dark:bg-dark-border h-[12px] w-[60px] rounded bg-gray-300" />
          <div className="dark:bg-dark-border h-[12px] w-[60px] rounded bg-gray-300" />
        </div>
      </div>
    </div>
  );
}
