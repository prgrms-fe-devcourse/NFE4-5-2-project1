import { useEffect, useMemo, useRef, useState } from 'react';

import { dark } from '../../../utils/darkModeUtils';
import { Theme } from '../../../types/darkModeTypes';

interface PhotoUploadModalProps2 extends PhotoUploadModalProps {
  theme: Theme;
}

export default function PhotoUploadModal({
  isOpen,
  onClose,
  onSave,
  theme,
}: PhotoUploadModalProps2) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 파일 -> URL 설정
  const previewUrl = useMemo(() => {
    return selectedFile ? URL.createObjectURL(selectedFile) : null;
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // 파일 변했을 때 저장
  const handleFileChange = (file: File) => {
    setSelectedFile(file);
  };

  // 파일 드랍한 경우
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // 클릭 시 숨겨진 파일 선택창 오픈하게
  const handleButtonClick = () => inputRef.current?.click();

  // input에서 파일 선택한 경우
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    onClose();
  };

  // 파일 넘기기
  const handleSave = () => {
    if (!selectedFile) return alert('이미지 파일을 선택해주세요.');
    onSave(selectedFile);
    handleCancel();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={handleCancel}
    >
      <div className="absolute inset-0 bg-black opacity-40 backdrop-blur-none"></div>
      <div
        className={`p-6 rounded-[5px] w-96 shadow-lg relative ${
          dark(theme) ? 'bg-[#2D2D2D]' : 'bg-[#ffffff]'
        }`}
        onClick={(e) => e.stopPropagation()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <h2
          className={`text-lg font-bold mb-4 ${
            dark(theme) ? 'text-[#ffffff]' : 'text-[#111111]'
          }`}
        >
          사진 업로드
        </h2>
        <div
          className="border-2 border-dashed border-gray-300 rounded-[5px] p-4 text-center cursor-pointer"
          onClick={handleButtonClick}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="preview"
              className="w-full h-full object-cover rounded-[5px]"
            />
          ) : (
            <p
              className={` ${
                dark(theme) ? 'text-[#ffffff] opacity-50' : 'text-gray-500'
              }`}
            >
              클릭하거나 파일을 드래그하여 업로드
            </p>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={inputRef}
            onChange={handleFileInputChange}
          />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            className={`px-4 py-2   cursor-pointer ${
              dark(theme)
                ? 'text-[#ffffff] opacity-60'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={handleCancel}
          >
            취소
          </button>
          <button
            className={` px-4 py-2 rounded-[5px] cursor-pointer ${
              dark(theme)
                ? 'bg-[#ffffff] text-[#111111]'
                : 'bg-[#1E293B] text-white'
            }`}
            onClick={handleSave}
          >
            변경
          </button>
        </div>
      </div>
    </div>
  );
}
