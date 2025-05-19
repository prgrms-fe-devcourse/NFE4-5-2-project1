import AuthButton from "./AuthButton";
import Button from "../FanPage/Button";
import Input from "./AuthInput";
import BlueBoard from "./BlueBoard";
import { useState } from "react";
import { ExtendedUser } from "../../types/postType.ts";
import { useNavigate } from "react-router";
import Message from "./Message.tsx";
import Swal from "sweetalert2";
import { inputValidation } from "./inputValidation.ts";
import { SignUpValue } from "../../types/userTypes.ts";
import { login } from "../../api/auth";
import { AxiosError } from "axios";
import { getUserInfo } from "../../api/user.ts";
import { signUp } from "../../api/auth.ts";

export default function SignUp() {
  const navigate = useNavigate();

  const [value, setValue] = useState({
    nickName: "",
    name: "",
    email: "",
    password: "",
    checkPassword: "",
  });

  const [valid, setValid] = useState({
    nickName: false,
    name: false,
    email: false,
    password: false,
    checkPassword: false,
  });

  const [nickNameValid, setNickNameValid] = useState(false);
  const [nickNameApiValid, setNickNameApiValid] = useState(false);

  const submitValid = [
    ...Object.values(value),
    ...Object.values(valid),
    nickNameValid,
    !nickNameApiValid,
  ];

  //input onChnage 유효성 검사
  function handleInputValidation(
    e: React.ChangeEvent<HTMLInputElement>,
    type: string,
    value: SignUpValue
  ) {
    const isValid = inputValidation(e, type, value);

    if (type === "nickName") {
      setNickNameValid(false);
      setNickNameApiValid(false);
    } else if (type === "password") {
      if (e.target.value === value.checkPassword) {
        setValid((valid) => {
          return { ...valid, checkPassword: true };
        });
      }
    }

    setValue((value) => {
      return { ...value, [type]: e.target.value };
    });
    setValid((valid) => {
      return { ...valid, [type]: isValid };
    });
    if (value[type] === "") {
      setValid((valid) => {
        return { ...valid, [type]: false };
      });
    }
  }

  //비밀번호 체크 인풋에 포커스 들어갈 때 유효성 검사
  function handleCheckPasswordFocus() {
    if (value.checkPassword === value.password) {
      setValid((valid) => {
        return { ...valid, checkPassword: false };
      });
      return;
    }
    setValid((valid) => {
      return { ...valid, checkPassword: true };
    });
  }

  //닉네임 중복 유효성 검사
  async function handleNickNameCheck() {
    console.log("동작 합니다");
    if (value.nickName === "" || !valid.nickName) return;

    try {
      const data = await getUserInfo();
      const result = data.some(
        (el: ExtendedUser) => el.username === value.nickName
      );
      console.log(result);
      if (result) {
        setNickNameValid(false);
        setNickNameApiValid(true);
      } else {
        setNickNameValid(true);
        setNickNameApiValid(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const showValidationErrorAlert = () => {
    Swal.fire({
      icon: "error",
      title: "회원가입 실패",
      text: "유효하지 않은 닉네임 혹은 이메일, 비밀번호 입니다.",
      confirmButtonText: "닫기",
    });
  };

  //회원가입
  async function handleSignUpSubmit() {
    //input 유효성 체크
    if (!submitValid.every((vaild) => vaild)) {
      console.log(submitValid);
      console.log("실패");
      showValidationErrorAlert();
      return;
    }

    try {
      //회원가입 데이터 post
      const response = await signUp({
        email: value.email.toLocaleLowerCase().trim(),
        fullName: value.name.toLocaleLowerCase().trim(),
        username: value.nickName.toLocaleLowerCase().trim(),
        password: value.password.toLocaleLowerCase().trim(),
      });

      if (response.status === 200) {
        //로그인 기능
        const res = await login({
          email: value.email,
          password: value.password,
        });
        console.log(res);
        localStorage.setItem("saveId", value.email);
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
        showValidationErrorAlert();
      }
    }
  }

  return (
    <>
      <main>
        <BlueBoard>
          <form className="w-full">
            <div className="w-full flex gap-[20px] mb-[35px] items-center relative">
              <Input
                placeholder={"닉네임"}
                type="text"
                className="w-full mb-[0]"
                onChange={(e) => handleInputValidation(e, "nickName", value)}
                value={value.nickName}
              />
              <Button
                disabled={!valid.nickName}
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  handleNickNameCheck();
                }}
                className="bg-[rgba(0,51,160,1)] rounded-[5px] text-[16px] hover:bg-[rgba(0,51,160,1)] hover:text-[#fff] transition"
              >
                중복 확인
              </Button>
              {value.nickName && !valid.nickName && (
                <Message>공백 혹은 특수 문자는 사용할 수 없습니다</Message>
              )}
              {nickNameValid && (
                <Message className="text-green-500">
                  사용 가능한 닉네임입니다
                </Message>
              )}
              {nickNameApiValid && <Message>중복된 닉네임 입니다</Message>}
            </div>
            <div className="w-full flex gap-[20px] mb-[35px] items-center relative">
              <Input
                placeholder={"이름"}
                type="name"
                className="w-full mb-[0]"
                value={value.name}
                onChange={(e) => {
                  handleInputValidation(e, "name", value);
                }}
              />
              {value.name && !valid.name && (
                <Message>이름은 한글 2~5글자로 입력해주세요</Message>
              )}
            </div>
            <div className="w-full flex gap-[20px] mb-[35px] items-center relative">
              <Input
                placeholder={"이메일"}
                type="email"
                className="w-full mb-[0]"
                value={value.email}
                onChange={(e) => {
                  handleInputValidation(e, "email", value);
                }}
              />
              {value.email && !valid.email && (
                <Message>올바른 이메일 형식이 아닙니다</Message>
              )}
            </div>
            <div className="relative mb-[35px]">
              <Input
                placeholder={"비밀번호"}
                type="password"
                className="mb-[0]"
                value={value.password}
                onChange={(e) => handleInputValidation(e, "password", value)}
              />
              {!value.password ||
                (!valid.password && (
                  <Message>8~16자, 영문, 숫자를 사용해 주세요</Message>
                ))}
            </div>
            <div className="relative mb-[35px] ">
              <Input
                onFocus={handleCheckPasswordFocus}
                onChange={(e) =>
                  handleInputValidation(e, "checkPassword", value)
                }
                value={value.checkPassword}
                placeholder={"비밀번호 확인"}
                type="password"
                className="mb-[35px]"
              />
              {!value.checkPassword ||
                (!valid.checkPassword && (
                  <Message>비밀번호가 일치하지 않습니다</Message>
                ))}
            </div>
            <AuthButton
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                handleSignUpSubmit();
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
