export default function PlaylistTrackItemSkeleton() {
  return (
    <div className="flex h-auto p-2 md:p-[18px] justify-between items-center hover:bg-[color:var(--grey-500)] rounded-[10px] group">
      <div className="flex gap-[24px] items-center flex-1 overflow-hidden">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-[color:var(--grey-500)] rounded-[10px] animate-pulse flex-shrink-0" />
        <div className="flex flex-col justify-center overflow-hidden">
          <div className="h-[12px] md:h-[16px] w-[120px] bg-[color:var(--grey-500)] rounded-md animate-pulse" />
          <div className="h-[10px] md:h-[14px] w-[80px] bg-[color:var(--grey-500)] rounded-md animate-pulse mt-2" />
        </div>
      </div>
      <div className="ml-2 flex-shrink-0">
        <div className="w-6 h-6 bg-transparent"></div>
      </div>
    </div>
  );
}
