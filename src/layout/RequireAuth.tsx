import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import { checkLogin } from "../api/auth";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

export default function RootLayout() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const getUserInfo = async () => {
    try {
      const response = await checkLogin();
      if (!response) {
        Swal.fire({
          icon: "info",
          title: "로그인이 필요합니다.",
          text: "로그인 페이지로 이동합니다.",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/login");
      } else setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  if (isLoading) return null;

  return (
    <>
      <Outlet />
    </>
  );
}
