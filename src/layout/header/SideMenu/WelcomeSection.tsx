import popcon from "../../../assets/images/icon_sidemenu.svg";

export default function WelcomeSection() {
  return (
    <div className="flex flex-col gap-4 pb-6 border-b border-[color:var(--white)]">
      <img src={popcon} alt="팝콘 아이콘" className="w-[25px]" />
      <p className="text-2xl font-medium">Welcome</p>
      <p className="font-[MonumentExtended] text-[18px] text-[color:var(--primary-300)]">
        POPCON
      </p>
    </div>
  );
}
