import AboutUsMemberCard from "./AboutUsMemberCard";

export default function AboutUsContent() {
  const members = [
    {
      index: 0,
      engname: "PARK JUNGYU",
      korname: "박준규",
      contact: "https://github.com/parkjungyuxx",
    },
    {
      index: 1,
      engname: "HYUN HYEJU",
      korname: "현혜주",
      contact: "https://github.com/hxezu",
    },
    {
      index: 2,
      engname: "LEE MINJI",
      korname: "이민지",
      contact: "https://github.com/mjlee38",
    },
    {
      index: 3,
      engname: "KWON YOOJUNG",
      korname: "권유정",
      contact: "https://github.com/best106yj",
    },
    {
      index: 4,
      engname: "CHO JEONG WOO",
      korname: "조정우",
      contact: "https://github.com/mafornp",
    },
  ];

  return (
    <div className="flex flex-col gap-12 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-8 justify-items-center">
        {members.map((member) => (
          <AboutUsMemberCard key={member.index} {...member} />
        ))}
      </div>

      <div className="hidden lg:flex flex-col gap-12">
        <div className="flex justify-center items-center gap-8">
          {members.slice(0, 2).map((member) => (
            <AboutUsMemberCard key={member.index} {...member} />
          ))}
        </div>
        <div className="flex justify-center items-center gap-8">
          {members.slice(2).map((member) => (
            <AboutUsMemberCard key={member.index} {...member} />
          ))}
        </div>
      </div>
    </div>
  );
}
