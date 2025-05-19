export default function ThreadSkeleton() {
  return (
    <div className="shadow-md w-full max-w-full md:max-w-[1200px] mx-auto rounded-[10px] border border-[#d9d9d9]  dark:border-gray-700 flex flex-col">
      <div className="p-[24px] flex gap-[25px]">
        <div className="flex-shrink-0 self-start">
          <div className="w-20 h-20 bg-gray-300 dark:bg-gray-700 rounded-full" />
        </div>
        <div className="flex flex-col w-full ml-[20px]">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4 mt-1" />
          <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-2" />
          <div className="flex items-center justify-between gap-4 mt-5">
            <div className="flex items-center gap-7 mt-2">
              <div className="w-[22px] h-[22px] bg-gray-200 rounded-full dark:bg-gray-700"></div>
              <div className="w-[22px] h-[22px] bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
