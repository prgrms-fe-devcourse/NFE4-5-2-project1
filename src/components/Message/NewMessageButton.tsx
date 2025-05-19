import { Link } from "react-router";
import { TbBrandTelegram } from "react-icons/tb";

export default function NewMessageButton() {
  const sidebarStyle =
    "text-center pr-2 justify-center items-center text-black text-xl flex h-[60px] bg-[#0033a0] hover:bg-[#1748B3] text-white hover:text-white transition  dark:text-white dark:bg-[#1748B3] dark:hover:bg-[#0033a0] rounded-2xl";
  return (
    <>
      <div className="mt-10 mx-6 cursor-pointer">
        <Link to="/message/new">
          <div className={sidebarStyle}>
            <TbBrandTelegram className="mr-2" /> 새 쪽지
          </div>
        </Link>
      </div>
    </>
  );
}
