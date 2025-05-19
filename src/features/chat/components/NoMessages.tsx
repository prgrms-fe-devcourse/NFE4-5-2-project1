import { Frown } from "lucide-react";

export default function NoMessages() {
  return (
    <>
      <div className="flex flex-col items-center text-[var(--grey-300)]">
        <Frown size={48} strokeWidth={1.5} className="mb-6" />
        <span className="text-2xl font-medium">No Messages Yet</span>
      </div>
    </>
  );
}
