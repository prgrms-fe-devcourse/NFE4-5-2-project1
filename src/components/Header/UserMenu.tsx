import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

import { userStore } from "../../stores/userStore";

export default function UserMenu() {
  const token = userStore((state) => state.token);
  const logout = userStore((state) => state.logout);
  const getUser = userStore((state) => state.getUser);
  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userId, setuserId] = useState("");

  useEffect(() => {
    const user = getUser();
    if (user) {
      setuserId(user._id);
    }
    setIsLoggedin(!!token);
  }, [token]);

  return (
    <>
      {isLoggedin ? (
        <div className="w-22 h-27 bg-white border border-gray-200 rounded-md sm:mr-5 md:mr-0">
          <ul className="mx-2 text-center cursor-pointer">
            <li className="py-[3px] mt-1 border-b border-b-gray-200 cursor-pointer hover:underline hover:underline-offset-3">
              <Link to={`/profile/${userId}/posts`}>내 프로필</Link>
            </li>
            <li className="py-[3px] mt-1 border-b border-b-gray-200 cursor-pointer hover:underline hover:underline-offset-3">
              <Link to="/message">쪽지함</Link>
            </li>
            <li
              className="py-[3px] mt-1 mb-1 cursor-pointer hover:underline hover:underline-offset-3"
              onClick={() => {
                if (isLoggedin) {
                  logout();
                  navigate("/");
                  window.location.reload();
                }
              }}
            >
              로그아웃
            </li>
          </ul>
        </div>
      ) : (
        <div className="w-22 h-19 bg-white border border-gray-200 rounded-md">
          <ul className="mx-2 text-center cursor-pointer ">
            <li
              className="py-[3px] mt-1 mb-1 border-b border-b-gray-200 cursor-pointer hover:underline hover:underline-offset-3"
              onClick={() => navigate("/login")}
            >
              로그인
            </li>
            <li
              className="py-[3px] mt-1 mb-1 cursor-pointer hover:underline hover:underline-offset-3"
              onClick={() => navigate("/signup")}
            >
              회원가입
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
