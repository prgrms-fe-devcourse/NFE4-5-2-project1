import Header from "../layout/Header";
import { Outlet } from "react-router";
import { useLocation } from "react-router";

export default function RootLayout() {
  const location = useLocation();
  const showLayout = location.pathname.includes("edit") ? false : true;

  if (!showLayout) {
    return <Outlet />;
  }

  return (
    <>
      <Header />
      <div className="pt-[150px] dark:bg-[#191A1E] dark:text-white min-h-screen flex flex-col">
        <Outlet />
      </div>
    </>
  );
}
