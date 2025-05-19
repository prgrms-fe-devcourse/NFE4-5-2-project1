import { Link } from "react-router";
import Button from "./AuthButton";
import Input from "./AuthInput";
import BlueBoard from "./BlueBoard";
import { useEffect, useState } from "react";
import { login } from "../../api/auth";
import { useNavigate, useLocation } from "react-router";
import Swal from "sweetalert2";

export default function LogIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [idSave, setIdSave] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (idSave) localStorage.setItem("saveId", loginForm.email);
    else localStorage.removeItem("saveId");

    const res = await login(loginForm);

    if (res) {
      navigate(from, { replace: true });
    } else {
      Swal.fire({
        icon: "error",
        title: "로그인 실패",
        text: "아이디 또는 비밀번호가 일치하지 않습니다.",
        confirmButtonText: "다시 시도",
      });
    }
  };

  const handleSaveId = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    if (checked) {
      localStorage.setItem("saveId", loginForm.email);
      setIdSave(true);
    } else {
      localStorage.removeItem("saveId");
      setIdSave(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("saveId")) {
      setLoginForm({
        ...loginForm,
        email: localStorage.getItem("saveId") || "",
      });
      setIdSave(true);
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <>
      <main>
        <BlueBoard>
          <form className="w-full" onSubmit={handleSubmit}>
            <Input
              placeholder={"이메일"}
              type="email"
              value={loginForm.email}
              onChange={handleChange}
              name="email"
            />
            <Input
              placeholder={"비밀번호"}
              type="password"
              value={loginForm.password}
              onChange={handleChange}
              name="password"
              className="mb-[0px]"
              onKeyDown={handleKeyDown}
            />
            <div className="my-[35px] items-center justify-between flex">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="SaveId"
                  name="이메일 저장"
                  className="mr-[5px] w-[16px] h-[16px]"
                  onChange={handleSaveId}
                  checked={idSave}
                />
                <label
                  htmlFor="SaveId"
                  className="text-[14px] text-[#616161] font-medium dark:text-white"
                >
                  이메일 저장
                </label>
              </div>
            </div>
            <Button className="dark:bg-[#235BD2]">로그인</Button>
          </form>
          <div className="border-b my-[18px] border-[#0033A0] dark:border-[#fff]"></div>
          <Button className="text-black bg-[#FF9500]">
            <Link to={"/signup"}>회원가입</Link>
          </Button>
        </BlueBoard>
      </main>
    </>
  );
}
