import { useState } from "react";
import BlueBoard from "./BlueBoard";
import Button from "../FanPage/Button";
import { userStore } from "../../stores/userStore";
import Message from "./Message.tsx";
import Swal from "sweetalert2";
import { ExtendedUser } from "../../types/postType.ts";
import { useNavigate } from "react-router";
import axios from "axios";
import { updateUserImage } from "../../api/user.ts";

export default function SelectClub() {
  const [selectedValue, setSelectedValue] = useState("");
  const user = userStore.getState().getUser() as ExtendedUser;
  const navigate = useNavigate();

  const imageOptions = [
    { label: "구단 선택", value: "구단 선택", imageUrl: "" },
    {
      label: "KIA 타이거즈",
      value: "KIA 타이거즈",
      imageUrl: "/images/kia.png",
    },
    {
      label: "삼성 라이온즈",
      value: "삼성 라이온즈",
      imageUrl: "/images/samsung.png",
    },
    {
      label: "LG 트윈스",
      value: "LG 트윈스",
      imageUrl: "/images/lg.png",
    },
    {
      label: "두산 베어스",
      value: "두산 베어스",
      imageUrl: "/images/doosan.png",
    },
    { label: "KT wiz", value: "KT wiz", imageUrl: "/images/kt.png" },
    {
      label: "SSG 랜더스",
      value: "SSG 랜더스",
      imageUrl: "/images/ssg.png",
    },
    {
      label: "롯데 자이언츠",
      value: "롯데 자이언츠",
      imageUrl: "/images/lotte.png",
    },
    {
      label: "한화 이글스",
      value: "한화 이글스",
      imageUrl: "/images/hanwha.png",
    },
    {
      label: "NC 다이노스",
      value: "NC 다이노스",
      imageUrl: "/images/nc.png",
    },
    {
      label: "키움 히어로즈",
      value: "키움 히어로즈",
      imageUrl: "/images/kium.png",
    },
  ];

  type SelectdOption = {
    label: string;
    value: string;
    imageUrl: string;
  };

  const handleSubmit = async () => {
    if (!selectedValue) return;

    const selected = imageOptions.find(
      (option) => option.value === selectedValue
    ) as SelectdOption;

    if (selected.imageUrl === "") return;

    try {
      const selectedImage = await fetch(selected.imageUrl);
      const blob = await selectedImage.blob();

      const fileName = selected.imageUrl.split("/").pop() as string;
      const file = new File([blob], fileName, { type: blob.type });

      const formData = new FormData();
      formData.append("isCover", "true");
      formData.append("image", file);
      const data = await updateUserImage(formData);
      Swal.fire({
        icon: "success",
        title: "구단을 변경 했습니다.",
        confirmButtonText: "닫기",
      });
      navigate(`/profile/${user._id}/posts`);
      userStore.getState().setUser(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("서버 응답 상태코드:", error.response?.status);
        console.log("서버 응답 메시지:", error.response?.data);
      }
      console.log(error);
    }
  };
  return (
    <>
      <BlueBoard className="py-[25px] px-[23px] w-full h-[25%] flex flex-col justify-between max-w-[650px] bg-white relative">
        <div>
          <h2 className="dark:text-white text-[16px] text-[#464646] mb-[7px]">
            구단 변경
          </h2>
          <p className="dark:text-[#BABABA] text-[14px] text-[#6D6D6D] font-medium">
            응원하는 구단을 선택해 주세요
          </p>
        </div>
        <div className="flex gap-[44px] justify-between">
          <select
            onChange={(e) => {
              console.log(e.target.value);
              setSelectedValue(e.target.value);
            }}
            value={selectedValue}
            className="text-gray-400 px-[4px] border-b border-[#0033A0] font-semibold dark:text-white dark:bg-[#434343] h-[40px] mb-[0] w-[475px] dark:border-[#fff]"
          >
            {imageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Button
            onClick={handleSubmit}
            className="w-[80px] h-[40px] text-[14px] rounded-[5px]"
          >
            변경하기
          </Button>
        </div>
        {selectedValue === "구단 선택" && (
          <Message className="bottom-[3px] top-auto left-[22px]">
            구단을 선택해 주세요
          </Message>
        )}
      </BlueBoard>
    </>
  );
}
