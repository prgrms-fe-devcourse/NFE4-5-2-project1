import { useState } from "react";
import Input from "../Auth/AuthInput.tsx";
import Message from "../Auth/Message.tsx";
import BlueBoard from "../Auth/BlueBoard.tsx";
import Button from "../FanPage/Button.tsx";
import { inputValidation } from "../SignUp/validation.ts";
import { CheckPasswordType } from "../../types/userTypes.ts";
import useUpdateHandler from "./useUpdateHandler.ts";
import Swal from "sweetalert2";

export default function ChangePassword() {
  const [value, setValue] = useState({
    password: {
      valid: false,
      content: "",
    },
    checkPassword: {
      valid: false,
      content: "",
    },
  });
  const updateHandler = useUpdateHandler();

  const { password, checkPassword } = value;

  const validCheck = [
    ...Object.values(password),
    ...Object.values(checkPassword),
  ].every((vaild) => vaild);

  function handlePasswordValidation(
    e: React.ChangeEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>,
    type: string
  ) {
    const isValid = inputValidation(e, type);
    setValue((value) => {
      return {
        ...value,
        password: {
          content: e.target.value,
          valid: isValid,
        },
      };
    });

    //비밀번호가 변경 되면 checkPassword 재검사
    if (e.target.value !== checkPassword.content) {
      setValue((value) => {
        return {
          ...value,
          checkPassword: {
            content: checkPassword.content,
            valid: false,
          },
        };
      });
    } else if (e.target.value === checkPassword.content) {
      setValue((value) => {
        return {
          ...value,
          checkPassword: {
            content: checkPassword.content,
            valid: true,
          },
        };
      });
    }
  }

  function handleCheckPasswordValidation(
    e: React.ChangeEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>,
    type: string,
    value: CheckPasswordType
  ) {
    const isValid = inputValidation(e, type, value);
    setValue((value) => {
      return {
        ...value,
        checkPassword: {
          content: e.target.value,
          valid: isValid,
        },
      };
    });
  }
  return (
    <>
      <BlueBoard className="py-[25px] px-[23px] w-full h-[34%] flex flex-col justify-between max-w-[650px] bg-white">
        <div>
          <h2 className="text-[16px] text-[#464646] mb-[7px] dark:text-white">
            비밀번호 변경
          </h2>
          <p className="text-[14px] text-[#6D6D6D] font-medium dark:text-[#BABABA]">
            영어와 숫자를 조합해 8자 이상 16자 이하로 입력해 주세요
          </p>
        </div>
        <div>
          <div className="relative mb-[35px] flex gap-[44px] justify-between">
            <Input
              placeholder={"새 비밀번호"}
              type="password"
              value={password.content}
              onBlur={(e) => {
                handlePasswordValidation(e, "password");
              }}
              onChange={(e) => {
                handlePasswordValidation(e, "password");
              }}
              className="h-[40px] mb-[0] max-w-[475px]"
            />
            {password.content && !password.valid && (
              <Message>8~16자, 영문, 숫자 조합 입니다</Message>
            )}
            <div className="w-[80px] h-[40px]"></div>
          </div>
          <div className="flex gap-[44px] justify-between relative">
            <Input
              placeholder="새 비밀번호 확인"
              type="password"
              value={checkPassword.content}
              onBlur={(e) => {
                handleCheckPasswordValidation(e, "checkPassword", value);
              }}
              onChange={(e) => {
                handleCheckPasswordValidation(e, "checkPassword", value);
              }}
              className="h-[40px] mb-[0] max-w-[475px]"
            />
            <Button
              onClick={() => {
                if (!validCheck) {
                  Swal.fire({
                    icon: "error",
                    title: "비밀번호를 확인해 주세요.",
                    confirmButtonText: "닫기",
                  });
                  return;
                }
                updateHandler(checkPassword, "checkpassword");
              }}
              className="w-[80px] h-[40px] text-[14px] rounded-[5px]"
            >
              변경하기
            </Button>
            {checkPassword.content && !checkPassword.valid && (
              <Message>공백이거나 비밀번호가 일치하지 않습니다</Message>
            )}
          </div>
        </div>
      </BlueBoard>
    </>
  );
}
