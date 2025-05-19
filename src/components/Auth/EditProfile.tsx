import Logo from "./Logo";
import ProfileImage from "./ProfileImage";
import AuthInput from "./AuthInput";
import { Link, useNavigate } from "react-router";
import BlueBoard from "./BlueBoard";
import Button from "../FanPage/Button";
import { useState } from "react";
import { editValidation } from "./inputValidation.ts";
import { UpdateValue } from "../../types/userTypes.ts";
import Message from "./Message.tsx";
import { logout } from "../../api/auth";
import { userStore } from "../../stores/userStore";
import { ExtendedUser } from "../../types/postType.ts";
import SelectClub from "./SelectClub.tsx";
import watermark2 from "../../assets/images/watermark2.png";
import EditIcons from "./EditIcons.tsx";
import Swal from "sweetalert2";
import {
  updateUserInfo,
  updateUserPassword,
  getUserInfo,
} from "../../api/user.ts";

export default function EditProfile() {
  const navigate = useNavigate();
  const [nickNameApiValid, setNickNameApiValid] = useState(false);
  const [value, setValue] = useState({
    nickName: {
      valid: false,
      content: "",
    },
    password: {
      valid: false,
      content: "",
    },
    checkPassword: {
      valid: false,
      content: "",
    },
  });
  const { nickName, password, checkPassword } = value;
  const user = userStore.getState().getUser() as ExtendedUser;
  const myName = user.username;

  type FieldType = "nickName" | "checkPassword";

  //유저 정보 업데이트
  const handleUpdate = async (
    data: { valid: boolean; content: string },
    type: FieldType
  ) => {
    //input validation
    for (const keys in data) {
      if (
        data[keys as keyof typeof data] == false ||
        nickName.content === myName
      ) {
        Swal.fire({
          icon: "error",
          title: "변경 사항을 확인 해주세요.",
          confirmButtonText: "닫기",
        });
        return;
      }
    }

    try {
      let response;
      if (type === "nickName") {
        await handleNickNameCheck();
        response = await updateUserInfo(user.fullName, data.content);
      } else {
        response = await updateUserPassword(data.content);
      }
      if (response?.status !== 200) throw new Error();

      Swal.fire({
        icon: "success",
        title: "수정이 완료 됐습니다.",
        confirmButtonText: "닫기",
      });
      if (type === "checkPassword") {
        await logout();
        navigate("/login");
        return;
      }
      userStore.getState().setUser(response?.data);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "수정을 실패 했습니다.",
        confirmButtonText: "닫기",
      });
      console.log(err);
    }

    setValue((value) => {
      return {
        ...value,
        nickName: {
          valid: false,
          content: "",
        },
        password: {
          valid: false,
          content: "",
        },
        checkPassword: {
          valid: false,
          content: "",
        },
      };
    });
  };

  //input onChnage 유효성 검사
  function handleValidation(
    e: React.ChangeEvent<HTMLInputElement>,
    type: "nickName" | "email" | "password" | "checkPassword",
    value: UpdateValue
  ) {
    setNickNameApiValid(false);
    const isValid = editValidation(e, type, value);
    // type이 부분 나중에 value key 값으로 대처하기
    if (type === "password") {
      if (e.target.value === checkPassword.content) {
        setValue((value) => {
          return {
            ...value,
            checkPassword: {
              valid: true,
              content: checkPassword.content,
            },
          };
        });
      }
    }

    setValue((value) => {
      return {
        ...value,
        [type]: {
          valid: isValid,
          content: e.target.value,
        },
      };
    });
  }

  //중복 유효성
  async function handleNickNameCheck() {
    if (nickName.content === "" || !nickName.valid) return;

    const data = await getUserInfo();
    const result = data.some(
      (el: ExtendedUser) => el.username === nickName.content
    );

    if (result) {
      setNickNameApiValid(true);
      throw new Error("중복된 닉네임 입니다");
    } else {
      setNickNameApiValid(false);
    }
  }

  return (
    <>
      <div className="flex h-screen">
        <div className=" min-w-[420px] h-screen w-[39%] flex justify-end shadow-[4px_0_10px_rgba(0,0,0,0.15)] dark:bg-[#262626] ">
          <aside className="h-full w-[420px] border-x border-x-[#E4E4E4] px-[63px] py-[30px] flex flex-col items-center dark:bg-[#434343] dark:border-[#4F4F4F] dark:border-left">
            <Logo className="w-[156px] mb-[30px]" />
            <ProfileImage className="mb-[12px]" />
            <p className="text-[24px] font-bold cursor-default dark:text-[#fff]">
              {user.username}
            </p>
            <p className="text-[14px] text-[#7C7B7B] font-regular mb-[42px] cursor-default dark:text-[#7C7B7B]">
              {user.email}
            </p>
            <div className="w-full py-[50px] border-y border-[#E4E4E4] flex flex-col gap-[35px] font-sans dark:border-[#4F4F4F] dark:border-y">
              <div className="w-full flex justify-between">
                <div className="dark:text-[#DCDCDC] w-content-fit h-[32px] text-[20px] font-semibold text-[#797979] cursor-pointer hover:text-[#FF9500] hover:border-b">
                  <Link to={`/profile/${user._id}/posts`}>내 프로필</Link>
                </div>
              </div>
              <div className="w-full flex justify-between">
                <div className="dark:text-[#DCDCDC] w-content-fit h-[32px] text-[20px] font-semibold text-[#797979] cursor-default">
                  내 팔로워
                </div>
                <div className="dark:text-[#DCDCDC] w-[50%] text-[20px] text-[#5A5A5A]">
                  {user.followers.length}
                </div>
              </div>
              <div className="w-full flex justify-between">
                <div className="dark:text-[#DCDCDC] w-content-fit h-[32px] text-[20px] font-semibold text-[#797979] cursor-default">
                  내 팔로잉
                </div>
                <div className="dark:text-[#DCDCDC] w-[50%] text-[20px] text-[#5A5A5A]">
                  {user.following.length}
                </div>
              </div>
            </div>
            <div className="py-[30px] w-full">
              <p className="text-[#7F7F7F] text-[16px] cursor-pointer mb-[14px] hover:text-[#FF9500] dark:text-[#646464]">
                <Link to={`/message`}>내 쪽지함</Link>
              </p>
              <p
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="text-[#7F7F7F] text-[16px] cursor-pointer hover:text-[#FF9500] dark:text-[#646464]"
              >
                로그 아웃
              </p>
            </div>
          </aside>
        </div>
        <div
          className="bg-[rgba(0,51,160,0.1)] flex flex-col justify-between h-full w-[61%] min-w-[650px] px-[105px] py-[20px] font-sans bg-no-repeat bg-right-bottom dark:bg-[#262626]"
          style={{ backgroundImage: `url(${watermark2})` }}
        >
          <div className="flex justify-end max-w-[650px]">
            <EditIcons />
          </div>
          <BlueBoard className="py-[25px] px-[23px] h-[25%] flex flex-col justify-between w-full max-w-[650px] bg-white">
            <div>
              <h2 className="text-[16px] text-[#464646] mb-[7px] dark:text-white">
                닉네임 변경
              </h2>
              <p className="text-[14px] text-[#6D6D6D] font-medium dark:text-[#BABABA]">
                닉네임은 공백을 제외한 1~8 내외의 소문자 영문, 한글, 숫자만
                사용할 수 있습니다
              </p>
            </div>
            <div className="flex gap-[44px] justify-between relative">
              <AuthInput
                placeholder="새 닉네임"
                type="text"
                value={nickName.content}
                onChange={(e) => handleValidation(e, "nickName", value)}
                className="h-[40px] mb-[0] max-w-[475px]"
              />
              <Button
                onClick={() => handleUpdate(nickName, "nickName")}
                className="w-[80px] h-[40px] text-[14px] rounded-[5px]"
              >
                변경하기
              </Button>
              {nickName.content && !nickName.valid && (
                <Message>
                  공백 혹은 특수 문자, 영문 대문자는 넣으실 수 없습니다
                </Message>
              )}
              {nickNameApiValid && <Message>중복된 닉네임 입니다</Message>}
            </div>
          </BlueBoard>
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
              <div className="relative mb-[35px]">
                <AuthInput
                  placeholder={"새 비밀번호"}
                  type="password"
                  value={password.content}
                  onChange={(e) => handleValidation(e, "password", value)}
                  className="h-[40px] mb-[0] max-w-[475px]"
                />
                {password.content && !password.valid && (
                  <Message>8~16자, 영문, 숫자 조합 입니다</Message>
                )}
              </div>
              <div className="flex gap-[44px] justify-between relative">
                <AuthInput
                  placeholder="새 비밀번호 확인"
                  type="password"
                  value={checkPassword.content}
                  onChange={(e) => handleValidation(e, "checkPassword", value)}
                  className="h-[40px] mb-[0] max-w-[475px]"
                />
                <Button
                  onClick={() => handleUpdate(checkPassword, "checkPassword")}
                  className="w-[80px] h-[40px] text-[14px] rounded-[5px]"
                >
                  변경하기
                </Button>
                {checkPassword.content && !checkPassword.valid && (
                  <Message>비밀번호가 일치하지 않습니다</Message>
                )}
              </div>
            </div>
          </BlueBoard>
          <SelectClub />
        </div>
      </div>
    </>
  );
}
