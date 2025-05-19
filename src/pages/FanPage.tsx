import { useState, useEffect } from "react";
import Upload from "../components/FanPage/Upload";
import Sidebar from "../components/FanPage/Sidebar";
import { useParams, useNavigate, useLocation } from "react-router";
import { userStore } from "../stores/userStore";
import NewThreadList from "../components/FanPage/NewThreadList";

export default function FanPage() {
  const { teamName } = useParams<{ teamName: string }>();
  const typeTeamName = teamName as string;
  const userId = userStore((state) => state.getUser()?._id);
  const [title, setTitle] = useState("인기글");

  const nav = useNavigate();
  const location = useLocation();

  // top 버튼 보일지 말지
  const [isVisible, setIsVisible] = useState(false);

  // 스크롤 이벤트
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 최상단으로 스크롤 이동
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="flex flex-col md:flex-row w-full max-w-[1500px] mx-auto">
        <Sidebar teamName={typeTeamName} title={title} setTitle={setTitle} />
        <div className="flex-1 px-2 md:mt-[80px] md:ml-[50px] md:mr-10 mt-[100px]">
          {userId ? (
            <Upload />
          ) : (
            <div className="border border-gray-300 dark:border-[#4c4c4c] rounded-lg p-4 mb-6 bg-white dark:bg-[#191A1E] shadow-sm text-center">
              <p className="mb-4 text-gray-700 dark:text-[#fff] font-semibold">
                로그인한 유저만 글 작성이 가능합니다.
              </p>
              <button
                onClick={() => nav("/login")}
                className="px-4 py-2 bg-[#235bd2] text-white rounded-md hover:bg-[#0033A0] transition-all cursor-pointer"
              >
                로그인하러 가기 ~ 🎵
              </button>
            </div>
          )}
          <div className="my-[50px] border-t border-[#d9d9d9] dark:border-[#4c4c4c] w-full"></div>
          {/* <ThreadsList location={location} /> */}
          <NewThreadList location={location} />
          <div className="m-[30px]"></div>
        </div>
      </div>

      {/* top버튼 */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 md:bottom-10 md:right-20 p-3 bg-[#235bd2] text-white rounded-[10px] shadow-lg hover:bg-[#0033a0] transition-all cursor-pointer"
        >
          TOP
        </button>
      )}
    </>
  );
}
