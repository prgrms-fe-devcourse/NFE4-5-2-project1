import { FaUserCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getUser } from "../../api/user";

interface ProfileImageProps {
  imageUrl?: string;
  alt?: string;
  size?: number;
  authorId?: string;
}

export default function ProfileImage({
  imageUrl,
  alt = "profile",
  size,
  authorId,
}: ProfileImageProps) {
  const [fetchImg, setFetchImg] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getUserImg = async () => {
      try {
        if (authorId) {
          console.log(authorId);
          const res = await getUser(authorId);
          setFetchImg(res.image);
        }
      } catch {
        console.log("파싱실패!");
      }
    };
    getUserImg();
  }, [authorId]);

  const finalImageUrl = imageUrl || fetchImg;
  return (
    <div
      className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden"
      style={{ width: size, height: size }}
    >
      {finalImageUrl ? (
        <img
          src={finalImageUrl}
          alt={alt}
          className="object-cover w-full h-full"
        />
      ) : (
        <FaUserCircle
          size={size}
          className="w-full h-full fill-[#2F6BEB] dark:fill-[#FFFFFF]"
        />
      )}
    </div>
  );
}
