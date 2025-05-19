import { LuPencilLine } from "react-icons/lu";
import { FaRegTrashCan } from "react-icons/fa6";

interface myThreadsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function MyThreads({ onEdit, onDelete }: myThreadsProps) {
  return (
    <div className="flex justify-end gap-4">
      <button
        className="text-[#ababab] gap-1 font-semibold hover:cursor-pointer"
        onClick={onEdit}
      >
        <LuPencilLine className="text-[18px]" />
      </button>
      <button
        className="text-[#ababab] gap-1 font-semibold hover:cursor-pointer"
        onClick={onDelete}
      >
        <FaRegTrashCan className="text-[18px]" />
      </button>
    </div>
  );
}
