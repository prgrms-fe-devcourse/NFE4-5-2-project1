export default function TrackCardSkeleton() {
  return (
    <div className="w-full md:w-[160px] xl:w-[112px] 2xl:w-[120px] h-auto overflow-hidden flex flex-col justify-center items-center gap-2 md:gap-4 box-border min-h-32">
      <div className="flex w-16 h-16 md:w-[80px] md:h-[80px] justify-center items-center rounded-full overflow-hidden">
        <div className="w-full h-full bg-[color:var(--grey-500)] rounded-full animate-pulse" />
      </div>
      <div className="flex flex-col gap-1 md:gap-2 justify-center items-center w-full">
        <div className="flex flex-col gap-0.5 md:gap-2 xl:gap-1 w-full">
          <div className="w-[80%] h-3 md:h-[14px] bg-[color:var(--grey-500)] rounded-sm animate-pulse mx-auto" />
          <div className="w-[60%] h-2 md:h-[12px] bg-[color:var(--grey-500)] rounded-sm animate-pulse mx-auto" />
        </div>
        <div className="flex justify-center gap-[8px] items-center mt-1 md:mt-2">
          <div className="w-12 h-2 md:w-[50px] md:h-[10px] xl:h-[12px] bg-[color:var(--grey-500)] rounded-sm animate-pulse" />
        </div>
      </div>
    </div>
  );
}
