import AboutUsBanner from "../components/aboutus/AboutUsBanner";
import AboutUsContent from "../components/aboutus/AboutUsContent";

export default function AboutUs() {
  return (
    <div className="flex flex-col justify-center items-center pb-20 w-[80%] lg:w-[800px] xl:w-[1080px] overflow-hidden mx-auto mt-12 md:mt-0">
      <AboutUsBanner />
      <AboutUsContent />
    </div>
  );
}
