import gsap from "gsap";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Section3() {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!boxRef.current || !detailRef) return;

    gsap.fromTo(
      detailRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: detailRef.current,
          start: "top 85%",
          end: "top 50%",
          scrub: 1,
        },
      }
    );

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: boxRef.current,
        start: "top 100%",
        end: "bottom 80%",
        scrub: 1,
      },
    });

    tl.fromTo(
      boxRef.current,
      {
        clipPath: "inset(60% 60% 60% 60% round 50%)",
      },
      {
        clipPath: "inset(0% 0% 0% 0% round 0%)",
        ease: "none",
        duration: 1,
      }
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <>
      <section className="w-full h-[100vh] flex justify-center items-center">
        <div className="flex flex-col justify-center items-center text-center gap-20">
          <h3 className="w-full text-center p-6 text-[color:var(--primary-300)]">
            BackGround
          </h3>
          <div
            ref={boxRef}
            className="w-[70%] flex flex-col gap-15 bg-[color:var(--primary-300)] text-[color:var(--bg-color)] py-15 rounded-4xl text-xs md:text-sm lg:text-lg"
          >
            <h2 className="font-bold text-md sm:text-xl md:text-2xl lg:text-4xl">
              매일 똑같은 노래가 지겹지 않으셨나요?
            </h2>
            <div className="space-y-8">
              <div className="space-y-2">
                <p>더이상 들을 노래가 없어서 고민이셨나요?</p>
                <p>
                  다른 사람들이 몰래 듣는 숨겨진 명곡들이 궁금했던 적
                  있으신가요?
                </p>
              </div>

              <p>
                <span className="font-semibold">팝콘</span>은 그런 고민에서
                시작된 서비스입니다.
              </p>
            </div>
          </div>

          <div
            className="flex flex-col md:flex-row gap-10 justify-center text-left font-light items-center text-sm/7 lg:text-md/8 text-[color:var(--white-80)] "
            ref={detailRef}
          >
            <p className="w-[70%] md:w-[30%] p-6 ">
              지루한 플레이리스트에서 벗어나고 싶었던 당신에게, 취향에 딱 맞는
              <span className="text-[color:var(--primary-300-50)]">
                {" "}
                음악 추천
              </span>
              , 다른 사람들의{" "}
              <span className="text-[color:var(--primary-300-50)]">
                숨은 명곡{" "}
              </span>
              공유, 그리고 해외 아티스트{" "}
              <span className="text-[color:var(--primary-300-50)]">
                {" "}
                내한 공연
              </span>{" "}
              정보까지 한곳에서 모두 즐길 수 있는 공간을 만들어드립니다.
            </p>
            <p className=" w-[70%] md:w-[30%] p-6 text-sm/6">
              POPCON offers a space where you can enjoy personalized music
              recommendations, discover hidden gems shared by others, and stay
              updated on overseas artists' concerts—all in one place.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
