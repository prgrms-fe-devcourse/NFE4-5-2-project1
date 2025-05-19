import { useNavigate } from "react-router";
import { useAuthStore } from "../../../stores/authStore";

export default function AuthButtons({
  isLoggedIn,
  toggleMenu,
}: AuthButtonsProps) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleNavigation = (path: string) => {
    navigate(path);
    toggleMenu();
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("app_state");
    navigate("/");
    toggleMenu();
  };

  return (
    <div className="mt-auto flex justify-center">
      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          className="text-[color:var(--white-80)] text-[12px] font-medium mb-16 cursor-pointer hover:text-[color:var(--primary-300)]"
        >
          Log Out
        </button>
      ) : (
        <div className="flex gap-12 text-[color:var(--white-80)] text-[12px] font-medium mb-16">
          <button
            className="cursor-pointer hover:text-[color:var(--primary-300)]"
            onClick={() => handleNavigation("/login")}
          >
            Login
          </button>
          <button
            className="cursor-pointer hover:text-[color:var(--primary-300)]"
            onClick={() => handleNavigation("/SignupAgree")}
          >
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
}
