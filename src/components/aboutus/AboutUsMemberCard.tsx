import icon1 from "../../assets/images/icon_popcon1.svg";
import icon2 from "../../assets/images/icon_popcon2.svg";
import icon3 from "../../assets/images/icon_popcon3.svg";
import icon4 from "../../assets/images/icon_popcon4.svg";
import icon5 from "../../assets/images/icon_popcon5.svg";

interface AboutusMemberCardProps {
  index: number;
  engname: string;
  korname: string;
  contact: string;
}

export default function AboutUsMemberCard({
  index,
  engname,
  korname,
  contact,
}: AboutusMemberCardProps) {
  const icon = [icon1, icon2, icon3, icon4, icon5];
  return (
    <div className="flex flex-col w-70 h-80 p-12 bg-[color:var(--grey-500-20)] items-center justify-center gap-8 rounded-[10px]">
      <img src={icon[index]} alt={`${korname} 팝콘 아이콘`} className="w-12" />
      <div className="flex flex-col justify-center items-center gap-6">
        <div className="flex flex-col justify-center items-center gap-2">
          <p className="font-semibold text-[15px]">{engname}</p>
          <p className="text-[14px] font-light text-[color:var(--white)]">
            {korname}
          </p>
        </div>
        <p className="text-[color:var(--primary-300)] text-[14px] font-medium w-[155px]">
          FRONTEND DEVELOPER
        </p>
        <a href={contact} className="text-[12px] font-light">
          {contact}
        </a>
      </div>
    </div>
  );
}
