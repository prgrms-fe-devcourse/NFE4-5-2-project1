import { useRef, useState } from "react";
import { fileToUrl } from "../utils/image";

export function useImage() {
	const [showImages, setShowImages] = useState<string[]>([]);
	const imageListRef = useRef<string[]>([]);

	const initImages = (images: string[]) => {
		const merged = [...imageListRef.current, ...images];
		const unique = Array.from(new Set(merged));
		setShowImages(unique);
		imageListRef.current = unique;
	};

	const addImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const imageFiles = [...e.target.files!];
		const imageUrls: string[] = await Promise.all(
			[...imageFiles].map((img) => fileToUrl(img))
		);
		imageListRef.current = [...imageListRef.current, ...imageUrls];
		const imageList = [...imageFiles]
			.filter((file) => file.type.startsWith("image/"))
			.map((imageFile) => URL.createObjectURL(imageFile));
		if (showImages.length <= 10) {
			setShowImages((list) => {
				const result = [...list, ...imageList];
				return result.slice(0, 10);
			});
		}
	};

	const removeImage = (image: string) => {
		imageListRef.current = imageListRef.current.filter((img) => image !== img);
		setShowImages(imageListRef.current);
	};

	return { showImages, imageListRef, initImages, addImage, removeImage };
}
