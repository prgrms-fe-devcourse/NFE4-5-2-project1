import axios from "axios";
import ImageResize from "quill-image-resize-module-plus";
import { useFormContext } from "react-hook-form";
import ReactQuill, { Quill } from "react-quill-new";
import { CHANNELS } from "../../../constants/posts";

const Size = Quill.import("formats/size") as { whitelist: string[] };
Size.whitelist = ["small", "normal", "large", "huge"];
Quill.register("formats/size", Size, true);
Quill.register("modules/imageResize", ImageResize);

export default function Contents({
	contentsRef,
	isConfirmed
}: {
	contentsRef: React.RefObject<ReactQuill | null>;
	isConfirmed: number;
}) {
	const { watch } = useFormContext();

	const watchedChannel = watch("channel");
	const showImageBtn = watchedChannel === CHANNELS.REVIEW;

	const ImageHandler = async () => {
		if (!contentsRef.current) return;

		const quillInstance = contentsRef.current.getEditor();
		const input = document.createElement("input");
		input.setAttribute("type", "file");
		input.setAttribute("accept", "image/*");
		input.click();

		input.onchange = async () => {
			const file = input.files?.[0] as File;
			const formData = new FormData();
			formData.append("file", file);
			formData.append("upload_preset", "postImages");

			try {
				const { data } = await axios.post(
					"https://api.cloudinary.com/v1_1/dopw7udhj/image/upload",
					formData
				);
				const range = quillInstance.getSelection(true);
				quillInstance.insertEmbed(range.index, "image", data.secure_url);
				quillInstance.setSelection(range.index + 1);
			} catch (error) {
				console.error(error);
			}
		};
	};

	return (
		<div>
			<label htmlFor="contents" className="post-input-title">
				내용
			</label>
			<ReactQuill
				key={isConfirmed}
				ref={contentsRef}
				theme="snow"
				placeholder="내용을 입력해 주세요 (1000자 이내)"
				className="sm:h-125 h-60 overflow-y mb-[30px] font-noto sm:mt-0 mt-[10px]"
				modules={{
					toolbar: {
						container: [
							[{ size: ["small", false, "large", "huge"] }],
							["bold", "italic", "underline", "strike", "link"],
							[{ list: "ordered" }, { list: "bullet" }],
							[{ align: [] }],
							showImageBtn ? ["image"] : []
						],
						handlers: {
							image: ImageHandler
						}
					},
					imageResize: {
						modules: ["Resize", "DisplaySize", "Toolbar"],
						displayStyles: {
							backgroundColor: "black",
							border: "none",
							color: "white"
						},
						handleStyles: {
							border: "1px solid #fff"
						}
					}
				}}
			/>
		</div>
	);
}
