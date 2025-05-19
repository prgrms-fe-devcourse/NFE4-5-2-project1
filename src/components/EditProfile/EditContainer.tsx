import Logo from "../Auth/Logo.tsx";
import ProfileImage from "./ProfileImage.tsx";
import { Link, useNavigate } from "react-router";
import { logout } from "../../api/auth.ts";
import { userStore } from "../../stores/userStore.ts";
import { ExtendedUser } from "../../types/postType.ts";
import SelectClub from "./ChangeClub.tsx";
import watermark2 from "../../assets/images/watermark2.png";
import EditIcons from "./EditIcons.tsx";
import ChangeNickname from "./ChangeNickname.tsx";
import ChangePassword from "./ChangePassword.tsx";
import { useEffect } from "react";

export default function EditProfile() {
  const navigate = useNavigate();
  const user = userStore((state) => state.user) as ExtendedUser;

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  if (!user) return null;

  return (
    <>
      <main className="flex h-screen">
        <div className=" min-w-[300px] h-screen w-[39%] flex justify-end shadow-[4px_0_10px_rgba(0,0,0,0.15)] dark:bg-[#262626] ">
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
                <div className="dark:text-[#DCDCDC] w-content-fit h-[32px] text-[16px] lg:text-[20px] font-semibold text-[#797979] cursor-pointer hover:text-[#FF9500] hover:border-b">
                  <Link
                    aria-label="사용자 프로필 페이지로 이동"
                    to={`/profile/${user._id}/posts`}
                  >
                    내 프로필
                  </Link>
                </div>
              </div>
              <div className="w-full flex justify-between">
                <div className="dark:text-[#DCDCDC] w-content-fit h-[32px] text-[16px] lg:text-[20px] font-semibold text-[#797979] cursor-default">
                  내 팔로워
                </div>
                <div className="dark:text-[#DCDCDC] w-[50%] text-[16px] lg:text-[20px] text-[#5A5A5A]">
                  {user.followers.length}
                </div>
              </div>
              <div className="w-full flex justify-between">
                <div className="dark:text-[#DCDCDC] w-content-fit h-[32px] text-[16px] lg:text-[20px] font-semibold text-[#797979] cursor-default">
                  내 팔로잉
                </div>
                <div className="dark:text-[#DCDCDC] w-[50%] text-[16px] lg:text-[20px] text-[#5A5A5A]">
                  {user.following.length}
                </div>
              </div>
            </div>
            <div className="py-[30px] w-full">
              <p className="text-[#7F7F7F] text-[16px] cursor-pointer mb-[14px] hover:text-[#FF9500] dark:text-[#646464]">
                <Link aria-label="메시지 함으로 이동" to={`/message`}>
                  내 쪽지함
                </Link>
              </p>
              <p
                aria-label="로그 아웃 후 홈 페이지로 이동"
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
          className="bg-[rgba(0,51,160,0.1)] flex flex-col justify-around h-full w-[61%] min-w-[500px] px-[30px] lg:px-[105px] py-[20px] font-sans bg-no-repeat bg-right-bottom dark:bg-[#262626]"
          style={{ backgroundImage: `url(${watermark2})` }}
        >
          <div className="flex justify-end max-w-[650px] min-w-[500px]">
            <EditIcons />
          </div>
          <ChangeNickname />
          <ChangePassword />
          <SelectClub />
        </div>
      </main>
    </>
  );
}
