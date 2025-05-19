import { ImagePlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ImageUploaderProps {
  onImageChange: (file: File | null) => void;
  initialImageUrl?: string;
  onImageDelete?: () => void;
}

export default function ImageUploader({
  onImageChange,
  initialImageUrl,
  onImageDelete,
}: ImageUploaderProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialImageUrl) {
      setImagePreview(initialImageUrl);
    }
  }, [initialImageUrl]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      onImageChange(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    onImageChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (onImageDelete) onImageDelete();
  };
  return (
    <>
      <div className="flex flex-col gap-4">
        <label className="font-medium">이미지 업로드 (선택)</label>
        {!imagePreview ? (
          <div
            className="w-60 h-60 border border-dashed border-[color:var(--grey-400)] rounded-lg flex items-center justify-center cursor-pointer hover:bg-[color:var(--white-80)] transition"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-full flex flex-col justify-center items-center gap-2">
              <ImagePlus />
              <span>클릭하여 이미지 업로드</span>
            </div>
          </div>
        ) : (
          <div className="relative w-60">
            <img
              src={imagePreview}
              alt="preview"
              className="w-60 h-60 object-cover rounded-lg"
            />
            <button
              onClick={removeImage}
              type="button"
              className="absolute top-1 right-1 bg-[color:var(--bg-color)] bg-opacity-50 rounded-full p-1"
            >
              <X className="w-4 h-4 cursor-pointer" />
            </button>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
          className="hidden"
        />
      </div>
    </>
  );
}
