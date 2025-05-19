type SendButtonProps = {
  onClick: () => void;
};
export default function SendButton({ onClick }: SendButtonProps) {
  const buttonStyle =
    "justify-end bg-[#0033A0] border hover:border-1  hover:bg-[#235BD2] text-white rounded-[10px] px-7 mb-2 py-2 text-sm cursor-pointer dark:border-[#235BD2] dark:bg-[#235BD2] dark:hover:bg-[#0033A0] dark:hover:border-[#0033A0]";

  return (
    <>
      <div className="absolute right-10 mt-14">
        <button type="button" className={buttonStyle} onClick={onClick}>
          보내기
        </button>
      </div>
    </>
  );
}
