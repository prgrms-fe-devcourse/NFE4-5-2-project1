import { Send } from "lucide-react";
import useSendMessage from "../hooks/useSendMessage";
import { useMsgVersionStore } from "../stores/msgVersionStore";

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  placeholder?: string;
  className?: string;
  userId: string;
}

export default function TextBox({
  value,
  onChange,
  onClear,
  placeholder = "메세지를 작성해주세요",
  className = "",
  userId,
}: SearchBarProps) {
  const sendMessage = useSendMessage();
  const updateCVersion = useMsgVersionStore((state) => state.c_increment);
  const updateMVersion = useMsgVersionStore((state) => state.m_increment);

  const sendMsgHandler = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();

    if (!value.trim()) return;

    await sendMessage({ message: value, userId });

    updateCVersion();
    updateMVersion();

    onClear();
  };

  return (
    <>
      <form onSubmit={sendMsgHandler} className={`relative ${className}`}>
        <input
          type="text"
          className="w-full border border-[color:var(--white-80)] md:pl-8 pl-6 md:pr-17 pr-12 rounded-xl md:text-lg md:h-15 h-12 focus:outline-none focus:border-[color:var(--primary-200)] bg-transparent text-white"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <Send
          className="absolute md:right-8 right-5 top-1/2 transform -translate-y-1/2 text-[color:var(--white-80)] cursor-pointer md:size-6 size-5"
          onClick={sendMsgHandler}
        />
      </form>
    </>
  );
}
