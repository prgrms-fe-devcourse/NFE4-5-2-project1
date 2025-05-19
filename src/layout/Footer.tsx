import logo from "../assets/images/logo.png";

export default function Footer() {
  return (
    <>
      <footer className="bg-[#0D1B2A] dark:bg-[#16171B]">
        <div className="container px-4 md:px-0 flex justify-start items-center mx-auto h-[200px] text-white gap-10">
          <div className="hidden md:flex items-center">
            <img src={logo} alt="로고" className="mt-[6%] ml-4 h-10 w-fit" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="cursor-pointer hover:text-[#FF9500]">
                <a
                  href="https://github.com/FE5-2-7team/TouchBase"
                  target="_blank"
                >
                  GitHub
                </a>
              </div>
            </div>
            <div>
              프로그래머스 부트캠프 5기 7팀 터치베이스 - 박상윤, 김보민, 이준호,
              정지유, 최연서
              <br />
              Copyrightⓒ 2025 TouchBase, All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
