import { Outlet } from "react-router";
import Header from "./header/Header";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { loadSavedTheme } from "../utils/theme";

export default function Layout() {
  useEffect(() => {
    loadSavedTheme();
  }, []);
  return (
    <div className="md:pt-14">
      <Header />
      <div className="py-[0] flex justify-center items-center h-auto">
        <Outlet />
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={true}
        pauseOnHover
        draggable
      />
    </div>
  );
}
