import MessageSidebar from "../components/Message/MessageSidebar";
import { Outlet } from "react-router";

export default function MessagePage() {
  return (
    <>
      <div className="flex justify-center dark:bg-[#191A1E] flex-1">
        <div className="flex md:w-[85%]">
          <div className="w-[259px] border-r border-r-gray-200 dark:border-r-gray-700">
            <MessageSidebar />
          </div>

          <div className="flex-1 overflow-hidden flex justify-center">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
