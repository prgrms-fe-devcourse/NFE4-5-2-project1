import { useEffect, useRef } from 'react';
import { Theme } from '../../../types/darkModeTypes';
import { dark } from '../../../utils/darkModeUtils';

interface EditMenuProps2 extends EditMenuProps {
  theme: Theme;
}

export default function EditMenu({
  onEdit,
  onDelete,
  onClose,
  theme,
}: EditMenuProps2) {
  const menuRef = useRef<HTMLDivElement>(null);

  //외부 클릭하면 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className={`absolute top-8 right-0 w-[120px] rounded-[5px] shadow-md z-50 ${
        dark(theme)
          ? 'bg-[#2d2d2d] border border-white/40'
          : 'bg-[#ffffff] border'
      }`}
    >
      <div
        className={`py-2 px-3 cursor-pointer  text-sm rounded-[5px]  ${
          dark(theme)
            ? 'text-[#ffffff]/70 hover:bg-neutral-500'
            : 'text-black hover:bg-gray-100'
        }`}
        onClick={onEdit}
      >
        이미지 변경
      </div>
      <div
        className='py-2 px-3 cursor-pointer hover:bg-red-100 text-sm rounded-[5px] text-red-500'
        onClick={onDelete}
      >
        삭제하기
      </div>
    </div>
  );
}
