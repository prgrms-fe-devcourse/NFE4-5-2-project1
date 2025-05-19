export default function AboutUsBanner() {
  return (
    <>
      <div className="hidden md:flex justify-center items-center w-full px-4 py-12">
        <p className="font-[MonumentExtended] text-center text-xl md:text-4xl lg:text-5xl text-[color:var(--white)]">
          ABOUT <span className="text-[color:var(--primary-300)]">US</span>
        </p>
      </div>

      <div className="flex flex-col justify-center items-center w-full px-4 py-12 md:hidden">
        <p className="font-[MonumentExtended] text-center text-xl md:text-4xl lg:text-5xl text-[color:var(--white)]">
          ABOUT <span className="text-[color:var(--primary-300)]">US</span>
        </p>
      </div>
    </>
  );
}
