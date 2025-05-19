export default function ChatUserSkeleton() {
  return (
    <>
      <div className="w-full h-auto p-2 flex gap-4 rounded-xl bg-[var(--grey-600)] animate-pulse items-center">
        <div className="rounded-full size-[48px] bg-[var(--grey-400)]" />

        <div className="flex flex-col flex-1 gap-2">
          <div className="w-1/3 h-4 rounded bg-[var(--grey-400)]" />
          <div className="w-full h-3 rounded bg-[var(--grey-400)]" />
        </div>
      </div>
    </>
  );
}
