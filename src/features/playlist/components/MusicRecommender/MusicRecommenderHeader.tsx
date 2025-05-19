export default function MusicRecommenderHeader() {
  return (
    <header className="flex md:px-4 2xl:px-4 gap-[16px] md:text-[20px] font-bold justify-between items-center">
      <div className="hidden md:flex gap-4">
        <h2>POPcon 이 추천하는 음악</h2>
        <span role="img" aria-label="headphones">
          🎧
        </span>
      </div>
      <div className="flex md:hidden gap-4 font-bold text-[14px]">
        <h2>POPCON이 추천하는 음악</h2>
        <span role="img" aria-label="headphones">
          🎧
        </span>
      </div>
    </header>
  );
}
