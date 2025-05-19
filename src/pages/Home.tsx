import Section1 from "../features/home/components/Section1";
import Section2 from "../features/home/components/Section2";
import Section3 from "../features/home/components/Section3";
import Section4 from "../features/home/components/Section4";
import Section5 from "../features/home/components/Section5";

export default function Home() {
  return (
    <>
      <main className="h-full w-full">
        <Section1 />
        <Section2 />
        <Section3 />
        <Section4 />
        <Section5 />
      </main>
    </>
  );
}
