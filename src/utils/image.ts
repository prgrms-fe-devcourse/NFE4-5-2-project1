import axios from "axios";
import ReactQuill from "react-quill-new";

export async function urlToFile(contents: React.RefObject<ReactQuill | null>) {
	const url = contents.current
		?.getEditor()
		.getContents()
		.ops.filter(
			(content) => typeof content.insert === "object" && content.insert.image
		)
		.map((content) => (content.insert as { image: string }).image);
	if (url && url.length) {
		try {
			const response = await fetch(url[0]);
			const blob = await response.blob();
			return new File([blob], "uploaded-image.jpg", { type: "image/jpeg" });
		} catch (error) {
			console.error(error);
		}
	}
}

export async function fileToUrl(file: File) {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("upload_preset", "postImages");

	try {
		const { data } = await axios.post(
			"https://api.cloudinary.com/v1_1/dopw7udhj/image/upload",
			formData
		);
		return data.secure_url;
	} catch (error) {
		console.error(error);
	}
}
