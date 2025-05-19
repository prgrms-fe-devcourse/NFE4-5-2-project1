import Logo from "./Logo";
import MainNav from "./MainNav";
import SideMenu from "./SideMenu/SideMenu";
import UserSection from "./UserSection";

export default function Header() {
  return (
    <>
      <div className="bg-[color:var(--bg-color-80)] py-4 px-6 md:px-0 md:py-0  md:hidden fixed z-100 w-full flex items-center justify-between ">
        <div className="h-[68px]">
          <Logo />
          <SideMenu />
        </div>
      </div>

      <div className="hidden md:block fixed top-0 left-0 w-full z-100 bg-[color:var(--bg-color-80)]">
        <div className="flex justify-between px-12">
          <Logo />
          <MainNav />
          <UserSection />
        </div>
      </div>
    </>
  );
}
