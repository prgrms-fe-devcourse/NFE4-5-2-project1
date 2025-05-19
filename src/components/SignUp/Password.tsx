import { useState } from "react";
import Input from "../Auth/AuthInput.tsx";
import Message from "../Auth/Message.tsx";
import { inputValidation } from "./validation.ts";
import { SetData, CheckPasswordType } from "../../types/userTypes.ts";

export default function Password({
  setFc,
}: {
  setFc: React.Dispatch<React.SetStateAction<SetData>>;
}) {
  const [value, setValue] = useState({
    password: {
      content: "",
      valid: false,
    },
    checkPassword: {
      content: "",
      valid: false,
    },
  });

  const { password, checkPassword } = value;

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
    console.log(checkPassword.valid);
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

  //부모 컴포넌트 data 업데이트
  function handlePasswordUpdate() {
    setFc((data) => {
      return {
        ...data,
        password: {
          value: password.content,
          valid: password.valid,
        },
      };
    });
  }

  //부모 컴포넌트 data 업데이트
  function handleCheckPasswordUpdate() {
    setFc((data) => {
      return {
        ...data,
        checkPassword: {
          value: checkPassword.content,
          valid: checkPassword.valid,
        },
      };
    });
  }

  return (
    <>
      <div className="relative mb-[35px]">
        <Input
          value={password.content}
          placeholder={"비밀번호"}
          type="password"
          onBlur={(e) => {
            handlePasswordValidation(e, "password");
            handlePasswordUpdate();
          }}
          onChange={(e) => {
            handlePasswordValidation(e, "password");
          }}
          className="mb-[0]"
        />
        {password.content && !password.valid && (
          <Message>8~16자, 영문, 숫자를 사용해 주세요</Message>
        )}
      </div>
      <div className="relative mb-[35px] ">
        <Input
          value={checkPassword.content}
          placeholder={"비밀번호 확인"}
          type="password"
          onBlur={(e) => {
            handleCheckPasswordValidation(e, "checkPassword", value);
            console.log(checkPassword.valid);

            handleCheckPasswordUpdate();
          }}
          onChange={(e) => {
            handleCheckPasswordValidation(e, "checkPassword", value);
          }}
          className="mb-[35px]"
        />
        {checkPassword.content && !checkPassword.valid && (
          <Message>공백이거나 비밀번호가 일치하지 않습니다</Message>
        )}
      </div>
    </>
  );
}
