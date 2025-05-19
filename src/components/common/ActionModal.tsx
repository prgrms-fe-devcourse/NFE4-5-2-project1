import {CircleAlert} from "lucide-react";

type ActionModalProps = {
  modalMessage: string;
  onCancel: () => void;
  onConfirmAction: () => void;
  confirmButtonText: string;
};

export default function ActionModal({
  modalMessage,
  onCancel,
  onConfirmAction,
  confirmButtonText,
}: ActionModalProps) {
  return (
    <>
      <div className='fixed inset-0 bg-black/50 z-50 flex justify-center items-center'>
        <div className='bg-[color:var(--bg-color)] p-10 rounded-3xl shadow-lg text-center w-[320px] flex flex-col items-center gap-2'>
          <CircleAlert className='text-[color:var(--red)] mb-4 w-8 h-8' />
          <p className='mb-4 text-lg font-regular whitespace-pre-line'>{modalMessage}</p>
          <div className='flex gap-4 w-full'>
            <button
              className='flex-1 px-6 py-2 border-1 border-[color:var(--primary-200)] text-[color:var(--white)] rounded-3xl cursor-pointer text-sm'
              onClick={onCancel}
            >
              취소
            </button>
            <button
              className='flex-1 px-6 py-2 bg-[color:var(--primary-200)] text-[color:var(--bg-color)] rounded-3xl cursor-pointer text-sm '
              onClick={onConfirmAction}
            >
              {confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
