import { useState } from "react";
import Input from "../Auth/AuthInput";
import Message from "../Auth/Message";
import InputBox from "./InputBox.tsx";
import { inputValidation } from "./validation.ts";
import { SetData } from "../../types/userTypes.ts";

export default function Name({
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
        name: {
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
          placeholder={"이름"}
          type="name"
          value={value}
          onBlur={(e) => {
            handleValidation(e, "name");
            handleFormdataChange();
          }}
          onChange={(e) => {
            handleValidation(e, "name");
          }}
          className="w-full mb-[0]"
        />
        {value && !valid && (
          <Message>이름은 한글 2~5글자로 입력해주세요</Message>
        )}
      </InputBox>
    </>
  );
}
