import Empty_img from "../../assets/images/Empty_img.png";

export interface EmptyMessageProps {
  message?: string;
}

const textStyle = "flex items-center justify-center whitespace-pre-line text-center";
export default function EmptyMessage({
  message = "야구팬들과 쪽지를 주고받으며 \n경기의 재미를 나눠보세요",
}: EmptyMessageProps) {
  return (
    <>
      <div className="block justify-center h-[400px] text-lg mt-40 text-gray-400">
        <div className="flex items-center justify-center">
          <img src={Empty_img} className="mb-6" />
        </div>
        <p className={textStyle}>{message}</p>
      </div>
    </>
  );
}
