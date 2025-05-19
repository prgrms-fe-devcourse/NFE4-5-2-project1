import GameSchedule from "../components/Main/GameSchedule";
import Ranking from "../components/Main/Ranking";
import InfinityLogo from "../components/Main/InfinityLogo";
import Highlight from "../components/Main/Highlight";
import MainPostGroup from "../components/Main/MainPostGroup";
import KBO from "../assets/images/watermark.png";
import Footer from "../layout/Footer";
export default function MainContent() {
  return (
    <>
      <main className="container px-4 md:px-0 mx-auto">
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col gap-8 mb-10 lg:flex-row w-full mt-[60px]">
            <GameSchedule />
            <Ranking />
          </div>
          <div className="w-full grid gap-10 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-10 mb-[80px]">
            <MainPostGroup />
          </div>
          <div className="w-full flex justify-center items-center highlight-wrapper min-h-[680px] relative bg-[#0033a0] dark:bg-[#131417]">
            <div className="absolute bottom-0 left-0 z-0 pointer-events-none w-2/3">
              <span className="select-none w-full h-full">
                <img src={KBO} alt="KBO" className="md:w-2/3" />
              </span>
            </div>
            <div className="absolute top-0 right-0 z-0 pointer-events-none transform rotate-180 w-2/3">
              <span className="select-none w-full h-full">
                <img src={KBO} alt="KBO" className="md:w-2/3" />
              </span>
            </div>
            <Highlight />
          </div>
          <InfinityLogo />
        </div>
      </main>
      <Footer />
    </>
  );
}
