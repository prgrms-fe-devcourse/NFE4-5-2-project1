import gsap from "gsap";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MvpCard from "./MvpCard";
import mvpcard1 from "/src/assets/images/bop-card.png";
import mvpcard2 from "/src/assets/images/concert-card.png";
import mpvcard3 from "/src/assets/images/playlist-card.png";

gsap.registerPlugin(ScrollTrigger);

const items = [
  <MvpCard
    theme="green"
    title="숨겨진 명곡 탐색"
    text={"공유된 숨듣명을 카드로 모아\n손쉬운 탐색 경험 제공"}
    imageSrc={mvpcard1}
  />,
  <MvpCard
    theme="black"
    title="내한 공연 소식"
    text={"좋아하는 아티스트의 내한 일정까지\n한 번에 확인 가능"}
    imageSrc={mvpcard2}
  />,
  <MvpCard
    theme="green"
    title="플레이 리스트 기반 추천"
    text={"내가 담은 음악을 바탕으로\n비슷한 감성의 음악을 자동 추천"}
    imageSrc={mpvcard3}
  />,
];

export default function Section4() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const itemsEls = gsap.utils.toArray<HTMLElement>(
      section.querySelectorAll(".work-li")
    );
    const mvpBoxes = gsap.utils.toArray<HTMLElement>(
      section.querySelectorAll(".mvpBox")
    );

    const scrollTween = gsap.to(itemsEls, {
      xPercent: -100 * (itemsEls.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 1,
        start: "center center",
        end: `+=${100 * itemsEls.length}%`,
        // markers: true,
      },
    });

    mvpBoxes.forEach((mvpBox) => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: mvpBox,
            containerAnimation: scrollTween,
            start: "center right",
            end: "center left",
            scrub: true,
            // markers: true,
          },
        })
        .fromTo(mvpBox, { scale: 0.5 }, { scale: 1, ease: "none" })
        .to(mvpBox, { scale: 0.5, ease: "none" });
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.killTweensOf(itemsEls);
      gsap.killTweensOf(mvpBoxes);
    };
  }, []);

  return (
    <>
      <section ref={sectionRef} className="h-screen relative ">
        <ul className="flex py-[3%] px-[30%] box-border items-center h-full">
          {items.map((item, i) => (
            <li
              key={i}
              className="work-li w-[400px] pr-[20px]  lg:w-[720px] lg:pr-[100px] box-border flex-shrink-0 "
            >
              <div
                className="mvpBox relative flex justify-center items-center"
                style={{ scale: 0.5 }}
              >
                {item}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
