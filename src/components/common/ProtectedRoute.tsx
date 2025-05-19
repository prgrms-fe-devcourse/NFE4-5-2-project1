import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAuthStore } from "../../stores/authStore";
import ActionModal from "./ActionModal";

export default function ProtectedRoute() {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setShowModal(true);
    }
  }, [isLoggedIn]);

  const navigateLoginHandler = () => {
    navigate("/login");
  };

  const cancelHandler = () => {
    navigate(-1);
  };

  if (!isLoggedIn && showModal) {
    return (
      <ActionModal
        modalMessage="로그인이 필요한 서비스입니다."
        onConfirmAction={navigateLoginHandler}
        onCancel={cancelHandler}
        confirmButtonText="로그인하기"
      />
    );
  }

  return <Outlet />;
}
