import gsap from "gsap";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Section5() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "0% 50%",
        end: "30% 0%",
        scrub: 1,
      },
    });

    tl.fromTo(
      ".circle",
      { width: "0", height: "0", duration: "10", ease: "elastic", top: "3%" },
      { width: "2500px", height: "2500px", duration: "10", top: "30%" },
      0
    );

    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: ".con02 .textBox",
        start: "0% 80%",
        end: "100% 80%",
        scrub: 1,
      },
    });

    tl2.fromTo(
      ".textBox",
      { top: "35%", duration: "5", ease: "elastic", opacity: "0" },
      { duration: "5", ease: "none", opacity: "1", top: "50%" },
      0
    );
  });

  return (
    <>
      <section ref={sectionRef} className="relative h-[1200px] overflow-hidden">
        <span className="circle block w-[2500px] h-[2500px] bg-[color:var(--primary-300)] rounded-full absolute top-[40%] left-1/2 -translate-x-1/2 z-0"></span>
        <div className="textBox absolute top-[60%] left-1/2 text-[color:var(--bg-color)] -translate-x-1/2 text-center z-10 w-full">
          <p className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold xl:tracking-[-5px] leading-[2] w-full">
            팝콘은 지루했던 음악 생활에 <br />
            팝콘처럼 톡톡 튀는 즐거움을 더해드립니다. <br />
            🍿
          </p>{" "}
        </div>
      </section>
    </>
  );
}
