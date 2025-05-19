import { useState } from "react";
import Swal from "sweetalert2";
import Input from "../Auth/AuthInput.tsx";
import Button from "../FanPage/Button.tsx";
import Message from "../Auth/Message.tsx";
import BlueBoard from "../Auth/BlueBoard.tsx";
import { inputValidation } from "../SignUp/validation.ts";
import { ExtendedUser } from "../../types/postType.ts";
import useUpdateHandler from "./useUpdateHandler.ts";
import { getUserInfo } from "../../api/user.ts";

export default function ChangeNickname() {
  const [value, setValue] = useState({ valid: false, content: "" });
  const { valid, content } = value;
  const updateHandler = useUpdateHandler();

  //닉네임 유효성 검사
  function handleValidation(
    e: React.ChangeEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>,
    type: string
  ) {
    const isValid = inputValidation(e, type);
    setValue((value) => {
      return {
        ...value,
        valid: isValid,
        content: e.target.value,
      };
    });
  }

  //중복 닉네임 검사
  async function handleDuplicateCheck() {
    if (content === "" || !valid) return;

    try {
      const data = await getUserInfo();
      const result = data.some((el: ExtendedUser) => el.username === content);
      if (result) {
        //중복있음
        Swal.fire({
          icon: "error",
          title: "이미 사용 중인 닉네임 입니다.",
          confirmButtonText: "닫기",
        });
        setValue((value) => {
          return {
            ...value,
            valid: false,
            content: "",
          };
        });
        return true;
      } else {
        //중복 없음
        setValue((value) => {
          return {
            ...value,
            valid: true,
            content: content,
          };
        });
        return false;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }

  //submit
  async function handleNicknameUpdate(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const isAvailable = await handleDuplicateCheck();
    if (isAvailable) return;
    await updateHandler(value, "nickname");
    setValue((value) => {
      return {
        ...value,
        valid: false,
        content: "",
      };
    });
  }

  return (
    <>
      <BlueBoard className="py-[25px] px-[23px] h-[25%] flex flex-col justify-between w-full max-w-[650px] bg-white">
        <div>
          <h2 className="text-[16px] text-[#464646] mb-[7px] dark:text-white">
            닉네임 변경
          </h2>
          <p className="text-[14px] text-[#6D6D6D] font-medium dark:text-[#BABABA]">
            닉네임은 공백을 제외한 1~8 내외의 소문자 영문, 한글, 숫자만 사용할
            수 있습니다
          </p>
        </div>
        <div className="flex gap-[44px] justify-between relative">
          <Input
            placeholder="새 닉네임"
            type="text"
            value={content}
            onChange={(e) => {
              handleValidation(e, "nickname");
            }}
            className="h-[40px] mb-[0] max-w-[475px]"
          />
          <Button
            onClick={async (e) => handleNicknameUpdate(e)}
            className="w-[80px] h-[40px] text-[14px] rounded-[5px]"
          >
            변경하기
          </Button>
          {content && !valid && (
            <Message>
              1~8자 초과, 공백 혹은 특수 문자는 사용할 수 없습니다
            </Message>
          )}
        </div>
      </BlueBoard>
    </>
  );
}
