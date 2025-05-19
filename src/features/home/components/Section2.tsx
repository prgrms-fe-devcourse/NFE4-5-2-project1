import gsap from "gsap";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import section2Img from "../../../assets/images/section2.svg";

gsap.registerPlugin(ScrollTrigger);

export default function Section2() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const subTitleRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (
      !sectionRef.current ||
      !titleRef.current ||
      !subTitleRef.current ||
      !imgRef.current
    )
      return;
    const titleParagraphs = titleRef.current.querySelectorAll("p");

    titleParagraphs.forEach((p, index) => {
      gsap.fromTo(
        p,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power3.out",
          delay: index * 0.5,
          scrollTrigger: {
            trigger: p,
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
          },
        }
      );
    });

    gsap.fromTo(
      subTitleRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: subTitleRef.current,
          start: "top 75%",
          end: "top 40%",
          scrub: 1,
        },
      }
    );

    gsap.fromTo(
      imgRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: imgRef.current,
          start: "top 70%",
          end: "top 50%",
          scrub: 1,
        },
      }
    );
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="min-h-[100vh] bg-[color:var(--primary-300)] text-[color:var(--bg-color)] pt-12 flex flex-col justify-between"
      >
        <div>
          <h3 className="w-full text-center p-6">Overview</h3>
          <div
            ref={titleRef}
            className="flex flex-col w-full items-center font-bold sm:text-xl md:text-2xl lg:text-4xl leading-16 p-20 "
          >
            <p>해외 팝송을 좋아하는 사람들을 위한,</p>
            <p>노래 추천부터 숨은 명곡, 내한 공연 정보까지</p>
          </div>

          <div
            ref={subTitleRef}
            className="flex flex-col w-full items-center font-light text-sm sm:text-base md:text-md lg:text-xl p-5"
          >
            <p>
              지금까지의 음악 서비스가 단순한 스트리밍에 머물렀다면, 팝콘은{" "}
              <span className="font-normal">취향 기반 추천</span>,{" "}
            </p>
            <p>
              <span className="font-normal">커뮤니티</span>, 그리고{" "}
              <span className="font-normal">콘서트 정보</span>까지 더한 새로운
              음악 플랫폼을 제안합니다.
            </p>
          </div>
        </div>

        <div
          ref={imgRef}
          className="w-full flex justify-center px-4 sm:px-0 mt-auto"
        >
          <img
            src={section2Img}
            alt=""
            className="h-[20vh] sm:h-[35vh] lg:h-[40vh] object-contain"
          />
        </div>
      </section>
    </>
  );
}
