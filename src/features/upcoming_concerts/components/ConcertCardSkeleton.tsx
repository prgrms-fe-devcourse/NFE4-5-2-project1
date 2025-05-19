export default function ConcertCardSkeleton() {
  return (
    <>
      <div className='w-[140px] h-[285px] md:w-[320px] md:h-[580px] border-b border-[var(--white)] animate-pulse'>
        <div className='w-[140px] h-[175px] md:w-80 md:h-[400px] bg-[color:var(--grey-500)] rounded-md' />
        <div className='mt-2 md:mt-10 md:mb-4 px-1'>
          <div className='h-[20px] md:h-[30px] bg-[color:var(--grey-500)] rounded w-[90%] mb-2' />
          <div className='h-[12px] md:h-[20px] bg-[color:var(--grey-500)] rounded w-[70%] mb-1' />
          <div className='h-[8px] md:h-[16px] bg-[color:var(--grey-500)] rounded w-[50%] mb-2' />
        </div>
        <div className='h-[8px] md:h-[12px] bg-[color:var(--grey-500)] rounded w-[40%] ml-1' />
      </div>
    </>
  );
}
