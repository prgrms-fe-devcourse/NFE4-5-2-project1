import ConcertCardSkeleton from "./ConcertCardSkeleton";

export default function ConcertListSkeleton() {
  return (
    <div className='flex flex-wrap justify-center gap-x-10 gap-y-10 w-full md:gap-x-20 md:gap-y-20'>
      {Array.from({length: 8}).map((_, index) => (
        <ConcertCardSkeleton key={index} />
      ))}
    </div>
  );
}
