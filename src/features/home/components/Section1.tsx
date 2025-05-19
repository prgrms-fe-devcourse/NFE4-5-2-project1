import mockupimg from "/src/assets/images/section1.svg";

export default function Section1() {
  return (
    <>
      <section className="h-auto min-h-[95vh] justify-center items-start flex flex-col xl:flex-row xl:items-end overflow-hidden pl-6 sm:pl-12 lg:pl-24 xl:pl-40 w-full">
        <div className="md:basis-[35%] flex xl:items-baseline-last justify-center h-full py-20 xl:pb-20">
          <div className="flex flex-col gap-8 w-full max-w-2xl xl:-translate-y-10 pr-2">
            <div className="flex flex-col gap-2 w-full ">
              <h1 className="font-[MonumentExtended] w-full text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-6xl 2xl:text-8xl text-[color:var(--primary-300)]">
                POP<span className="text-[color:var(--white)]">con</span>.
              </h1>
              <h3 className="font-light text-base sm:text-lg lg:text-xl xl:text-xl 2xl:text-2xl ">
                해외 팝송 팬들을 위한 커뮤니티 기반 음악 플랫폼 : 팝콘
              </h3>
            </div>
            <span className="text-xs sm:text-sm text-[color:var(--white-80)]">
              @2025 DEVCOURSE
            </span>
          </div>
        </div>
        <div className="w-full md:basis-[65%] flex justify-end items-end h-full translate-x-40">
          <img
            src={mockupimg}
            alt="목업 이미지"
            className="max-h-[75%] object-contain"
          />
        </div>
      </section>
    </>
  );
}
