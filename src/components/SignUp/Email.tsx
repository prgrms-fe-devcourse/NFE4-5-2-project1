import { useState } from "react";
import Input from "../Auth/AuthInput";
import Message from "../Auth/Message";
import InputBox from "./InputBox.tsx";
import { inputValidation } from "./validation.ts";
import { SetData } from "../../types/userTypes.ts";

export default function Email({
  setFc,
}: {
  setFc: React.Dispatch<React.SetStateAction<SetData>>;
}) {
  const [value, setValue] = useState("");
  const [valid, setValid] = useState(false);

  function handleValidation(
    e: React.ChangeEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>,
    type: string
  ) {
    const isValid = inputValidation(e, type);
    setValue(e.target.value);
    setValid(isValid);
  }

  function handleFormdataChange() {
    setFc((data) => {
      return {
        ...data,
        email: {
          value: value,
          valid: valid,
        },
      };
    });
  }

  return (
    <>
      <InputBox>
        <Input
          placeholder={"이메일"}
          type="email"
          value={value}
          onBlur={(e) => {
            handleValidation(e, "email");
            handleFormdataChange();
          }}
          onChange={(e) => {
            handleValidation(e, "email");
          }}
          className="w-full mb-[0]"
        />
        {value && !valid && <Message>올바른 이메일 형식이 아닙니다</Message>}
      </InputBox>
    </>
  );
}
