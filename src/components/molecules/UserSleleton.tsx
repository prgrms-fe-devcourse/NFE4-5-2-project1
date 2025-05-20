export default function UserSkeleton() {
  return (
    <div className="dark:border-dark-border dark:text-dark-text flex min-h-[184px] w-[1128px] animate-pulse items-center justify-between border-b-[1px] border-b-[#ababab] px-[30px] py-[10px]">
      <div className="flex items-center justify-center">
        {/* 유저 프로필 이미지 */}
        <div className="h-[150px] w-[150px] rounded-full bg-[#e5e5e5] dark:bg-[#444]" />

        <div className="ml-8 flex w-[580px] flex-col gap-2">
          {/* 이름 */}
          <div className="h-[28px] w-[200px] rounded bg-[#e5e5e5] dark:bg-[#444]" />

          {/* 기술 스택 */}
          <div className="mt-1 flex flex-wrap gap-1">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="h-[24px] w-[60px] rounded bg-[#e5e5e5] dark:bg-[#444]"
              />
            ))}
          </div>

          {/* 한 줄 소개 */}
          <div className="mt-1 h-[20px] w-[300px] rounded bg-[#e5e5e5] dark:bg-[#444]" />

          {/* 소셜 정보 */}
          <div className="mt-1 flex gap-3">
            <div className="h-[20px] w-[60%] rounded bg-[#e5e5e5] dark:bg-[#444]" />
          </div>
        </div>
      </div>

      {/* 팔로우 정보 + 버튼 */}
      <div className="nanum-gothic-regular mb-1 flex flex-col items-end gap-[5px] self-end text-[12px]">
        {/* 버튼 */}
        <div className="h-[30px] w-[70px] rounded bg-[#e5e5e5] dark:bg-[#444]" />

        {/* 팔로우 수치 */}
        <div className="flex gap-2">
          <div className="h-[17px] w-[50px] rounded bg-[#e5e5e5] dark:bg-[#444]" />
          <div className="h-[17px] w-[50px] rounded bg-[#e5e5e5] dark:bg-[#444]" />
        </div>
      </div>
    </div>
  );
}
