import { useRef, useState } from "react";
import { loginUser } from "../../../apis/login/login";
import { useNavigate } from "react-router";
import { logoutUser, updateUserPassword } from "../../../apis/mypage/myPage";
import { useAuthStore } from "../../../stores/authStore";

type Props = {
  onCheckPassword: () => void;
  email: string;
};

export default function CheckPassword({ email, onCheckPassword }: Props) {
  const [step, setStep] = useState<"verify" | "change">("verify");

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPwConfirm, setNewPwConfirm] = useState("");

  const [error, setError] = useState("");

  const [newPwError, setNewPwError] = useState("");
  const [newPwConfirmError, setNewPwConfirmError] = useState("");

  const newPwRef = useRef<HTMLInputElement>(null);
  const newPwConfirmRef = useRef<HTMLInputElement>(null);
  const currentPwRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const logout = useAuthStore.getState().logout;

  const handleCheckPassword = async () => {
    if (!currentPw.trim()) {
      setError("현재 비밀번호를 입력해주세요.");
      currentPwRef.current?.focus();
      return;
    }

    try {
      const data = await loginUser(email, currentPw);
      localStorage.setItem("token", data.token);
      setError("");
      setStep("change");
    } catch (err) {
      console.error(err);
      setError("비밀번호가 일치하지 않습니다.");
      currentPwRef.current?.focus();
    }
  };

  const handleChangePassword = async () => {
    if (!newPw.trim()) {
      setNewPwError("새 비밀번호를 입력해주세요.");
      newPwRef.current?.focus();
      return;
    }

    if (!newPwConfirm.trim()) {
      setNewPwConfirmError("새 비밀번호 확인을 입력해주세요.");
      newPwConfirmRef.current?.focus();
      return;
    }

    if (newPw !== newPwConfirm) {
      setNewPwError("새 비밀번호가 서로 일치하지 않습니다.");
      newPwRef.current?.focus();
      return;
    }

    try {
      await updateUserPassword(newPw);
      await logoutUser();
      logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
      setNewPwError("비밀번호 변경에 실패했습니다.");
    }
  };

  return (
    <div className="flex flex-col gap-[48px] text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
        <div className="md:col-span-2 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label htmlFor="currentPw" className="text-[16px]">
              이메일
            </label>
          </div>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            disabled
            className="w-full px-4 py-2 rounded-[10px] border border-[color:var(--white-80)] bg-transparent text-white text-[16px] cursor-not-allowed"
          />
        </div>
      </div>

      {step === "verify" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
          <div className="md:col-span-2 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label htmlFor="currentPw" className="text-[16px]">
                현재 비밀번호
              </label>
              {error && <span className="text-xs text-[#E42F42]">{error}</span>}
            </div>
            <input
              ref={currentPwRef}
              id="currentPw"
              type="password"
              placeholder="현재 비밀번호"
              value={currentPw}
              onChange={(e) => {
                setCurrentPw(e.target.value);
                if (error) setError("");
              }}
              className={`px-4 py-2 rounded-[10px] bg-transparent text-white border ${
                error
                  ? "border-[#E42F42] focus:border-[#E42F42]"
                  : "border-[color:var(--white-80)] focus:border-[color:var(--primary-200)]"
              } focus:outline-none`}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
          <div className="md:col-span-2 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label htmlFor="newPw" className="text-[16px]">
                새 비밀번호
              </label>
              {newPwError && (
                <span className="text-xs text-[#E42F42]">{newPwError}</span>
              )}
            </div>
            <input
              ref={newPwRef}
              id="newPw"
              type="password"
              placeholder="새 비밀번호"
              value={newPw}
              onChange={(e) => {
                setNewPw(e.target.value);
                if (newPwError) setNewPwError("");
              }}
              className={`px-4 py-2 rounded-[10px] bg-transparent text-white border ${
                newPwError
                  ? "border-[#E42F42] focus:border-[#E42F42]"
                  : "border-[color:var(--white-80)] focus:border-[color:var(--primary-200)]"
              } focus:outline-none`}
            />
          </div>

          <div className="md:col-span-2 flex flex-col gap-2 mt-4">
            <div className="flex justify-between items-center">
              <label htmlFor="newPwConfirm" className="text-[16px]">
                새 비밀번호 확인
              </label>
              {newPwConfirmError && (
                <span className="text-xs text-[#E42F42]">
                  {newPwConfirmError}
                </span>
              )}
            </div>
            <input
              ref={newPwConfirmRef}
              id="newPwConfirm"
              type="password"
              placeholder="새 비밀번호 확인"
              value={newPwConfirm}
              onChange={(e) => {
                setNewPwConfirm(e.target.value);
                if (newPwConfirmError) setNewPwConfirmError("");
              }}
              className={`px-4 py-2 rounded-[10px] bg-transparent text-white border ${
                newPwConfirmError
                  ? "border-[#E42F42] focus:border-[#E42F42]"
                  : "border-[color:var(--white-80)] focus:border-[color:var(--primary-200)]"
              } focus:outline-none`}
            />
          </div>
        </div>
      )}

      <div className="flex justify-center gap-4 mb-[40px]">
        <button
          onClick={() =>
            step === "verify" ? onCheckPassword() : setStep("verify")
          }
          className="px-[48px] py-[16px] rounded-[30px] border border-[#8B8B8B] text-[#EFEFEF] text-[18px] font-bold"
        >
          취소하기
        </button>

        <button
          onClick={
            step === "verify" ? handleCheckPassword : handleChangePassword
          }
          className="px-[48px] py-[16px] rounded-[30px] bg-[#8EF3BF] text-[#1B1C1E] text-[18px] font-bold"
        >
          {step === "verify" ? "확인하기" : "변경하기"}
        </button>
      </div>
    </div>
  );
}
