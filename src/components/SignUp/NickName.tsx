import { useState } from "react";
import Input from "../Auth/AuthInput";
import Button from "../FanPage/Button";
import Message from "../Auth/Message";
import InputBox from "./InputBox.tsx";
import { inputValidation } from "./validation.ts";
import { ExtendedUser } from "../../types/postType.ts";
import { SetData } from "../../types/userTypes.ts";
import { getUserInfo } from "../../api/user.ts";

export default function NickName({
  setFc,
}: {
  setFc: React.Dispatch<React.SetStateAction<SetData>>;
}) {
  const [value, setValue] = useState("");
  const [valid, setValid] = useState(false);
  const [DuplicateCheck, setDuplicateCheck] = useState<null | boolean>(null);

  //닉네임 유효성 검사
  function handleValidation(
    e: React.ChangeEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>,
    type: string
  ) {
    const isValid = inputValidation(e, type);
    setValue(e.target.value);
    setDuplicateCheck(null);
    setValid(isValid);
  }

  function handleFormdataChange() {
    setFc((data) => {
      return {
        ...data,
        nickname: {
          value: value,
          valid: valid,
        },
      };
    });
  }

  //중복 닉네임 검사
  async function handleDuplicateCheck() {
    if (value === "" || !valid) return;

    try {
      const data = await getUserInfo();
      const result = data.some((el: ExtendedUser) => el.username === value);
      if (result) {
        setValid(true);
        setDuplicateCheck(false);
      } else {
        setDuplicateCheck(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <InputBox>
        <Input
          placeholder={"닉네임"}
          type="text"
          value={value}
          onBlur={(e) => {
            handleValidation(e, "nickname");
            handleFormdataChange();
          }}
          onChange={(e) => {
            handleValidation(e, "nickname");
          }}
          className="w-full mb-[0px]"
        />
        <Button
          disabled={!valid}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            handleDuplicateCheck();
          }}
          className="bg-[rgba(0,51,160,1)] rounded-[5px] text-[16px] hover:bg-[rgba(0,51,160,1)] hover:text-[#fff] transition"
        >
          중복 확인
        </Button>
        {value && !valid && (
          <Message>
            1~8자 초과, 공백 혹은 특수 문자는 사용할 수 없습니다
          </Message>
        )}
        {DuplicateCheck !== null &&
          (DuplicateCheck !== null && DuplicateCheck ? (
            <Message className="text-green-500">
              사용 가능한 닉네임입니다
            </Message>
          ) : (
            <Message>중복된 닉네임 입니다</Message>
          ))}
      </InputBox>
    </>
  );
}
