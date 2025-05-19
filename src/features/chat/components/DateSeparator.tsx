export default function DateSeparator({ date }: { date: string }) {
  return (
    <>
      <div className="flex items-center gap-2">
        <div className="flex-grow h-px bg-[var(--white-80)]" />
        <span className="text-[var(--grey-500)] md:text-sm text-[0.8rem] whitespace-nowrap">
          {date}
        </span>
        <div className="flex-grow h-px bg-[var(--white-80)]" />
      </div>
    </>
  );
}
