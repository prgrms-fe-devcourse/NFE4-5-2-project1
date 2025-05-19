type MvpCardProps = {
  title: string;
  text: string;
  imageSrc: string;
  theme: Theme;
};
type Theme = "black" | "green";

export default function MvpCard({
  title,
  text,
  imageSrc,
  theme,
}: MvpCardProps) {
  const themeStyles = {
    black: {
      backgroundColor: "#272727",
      textColor: "var(--white)",
    },
    green: {
      backgroundColor: "var(--primary-300)",
      textColor: "var(--bg-color)",
    },
  };
  const { backgroundColor, textColor } = themeStyles[theme];

  return (
    <div
      className="w-[315px] h-[432px] lg:w-[420px] lg:h-[650px] rounded-2xl flex flex-col items-center justify-center text-center shadow-lg shadow-[rgba(0,0,0,0.25)] "
      style={{ backgroundColor, color: textColor }}
    >
      <p className="text-xl lg:text-2xl font-bold mb-4">{title}</p>
      <p className="text-base lg:text-lg  mb-8 whitespace-pre-line">{text}</p>
      <img src={imageSrc} alt="" className=" max-h-[200px] lg:max-h-[400px] " />
    </div>

    /* 사용하실 때 그대로 복사하시면 됩니다!
      <MvpCard
        theme='green'
        title='숨겨진 명곡 탐색'
        text={"공유된 숨듣명을 카드로 모아\n손쉬운 탐색 경험 제공"}
        imageSrc={BopCard}
      />
      <MvpCard
        theme='black'
        title='내한 공연 소식'
        text={"좋아하는 아티스트의 내한 일정까지\n한 번에 확인 가능"}
        imageSrc={ConcertCard}
      />
      <MvpCard
        theme='green'
        title='플레이 리스트 기반 추천'
        text={"내가 담은 음악을 바탕으로\n비슷한 감성의 음악을 자동 추천"}
        imageSrc={Playlist}
      />
    */
  );
}
