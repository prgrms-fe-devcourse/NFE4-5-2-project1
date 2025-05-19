import { useState } from "react";
import NickName from "./NickName";
import Password from "./Password";
import BlueBoard from "../Auth/BlueBoard";
import Name from "./Name";
import Email from "./Email";
import AuthButton from "../Auth/AuthButton";
import Swal from "sweetalert2";
import { login } from "../../api/auth";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import { signUp } from "../../api/auth.ts";

export default function SubmitForm() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    nickname: {
      value: "",
      valid: false,
    },
    name: {
      value: "",
      valid: false,
    },
    email: {
      value: "",
      valid: false,
    },
    password: {
      value: "",
      valid: false,
    },
    checkPassword: {
      value: "",
      valid: false,
    },
  });

  const { nickname, name, email, password, checkPassword } = data;

  const valids = [
    nickname.valid,
    name.valid,
    email.valid,
    password.valid,
    checkPassword.valid,
  ];

  async function handleSubmit() {
    console.log(valids);
    if (!valids.every((vaild) => vaild)) {
      Swal.fire({
        icon: "error",
        title: "회원가입 실패",
        text: "유효하지 않은 닉네임 혹은 이메일, 비밀번호 입니다.",
        confirmButtonText: "닫기",
      });
      return;
    }

    try {
      const response = await signUp({
        email: email.value.toLocaleLowerCase().trim(),
        fullName: name.value.toLocaleLowerCase().trim(),
        username: nickname.value.toLocaleLowerCase().trim(),
        password: password.value.toLocaleLowerCase().trim(),
      });

      if (response.status === 200) {
        await login({
          email: email.value,
          password: password.value,
        });
        localStorage.setItem("saveId", email.value);
        navigate("/");
      }
    } catch (error) {
      const axiosError = error as AxiosError<string>;

      if (
        axiosError.response?.data === "The email address is already being used."
      ) {
        Swal.fire({
          icon: "error",
          title: "회원가입 실패",
          text: "중복된 이메일 입니다.",
          confirmButtonText: "닫기",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "회원가입 실패",
          text: "유효하지 않은 닉네임 혹은 이메일, 비밀번호 입니다.",
          confirmButtonText: "닫기",
        });
      }
    }
  }

  return (
    <>
      <main>
        <BlueBoard>
          <form className="w-full">
            <NickName setFc={setData} />
            <Name setFc={setData} />
            <Email setFc={setData} />
            <Password setFc={setData} />
            <AuthButton
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="text-black bg-[rgba(255,149,0,0.8)]"
            >
              회원가입
            </AuthButton>
          </form>
        </BlueBoard>
      </main>
    </>
  );
}
