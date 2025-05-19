import { useEffect, useRef } from "react";
import ReactQuill from "react-quill-new";
import { useLocation, useNavigate } from "react-router";
import { updatePost } from "../apis/post";
import { showToast } from "../components/commons/Toast";
import PostForm from "../components/features/post/PostForm";
import { CHANNELS } from "../constants/posts";
import { useImage } from "../hooks/useImage";
import { usePostForm } from "../hooks/usePostForm";
import { formErrorHandler } from "../utils/errorhandle";

export default function PostEdit() {
	const navigate = useNavigate();
	const location = useLocation();
	const { imageListRef, initImages, ...imageProps } = useImage();
	const contentsRef = useRef<ReactQuill | null>(null);

	const { postData }: { postData: PostData } = location.state;
	const postInfo: PostDetail = JSON.parse(postData.title);

	const methods = usePostForm({
		channel: postData.channel._id,
		member: postInfo.memberLimit.toString(),
		location: postInfo.location,
		dateRange: postInfo.dateRange.map((date) => new Date(date)),
		title: postInfo.title,
		condition: {
			gender: postInfo.recruitCondition.gender,
			ageRange: postInfo.recruitCondition.ageRange
		},
		images: postInfo.images,
		url: postInfo.url
	});

	const submitHandler = async (data: FormValues) => {
		try {
			if (!data.condition) return;
			if (!postInfo) return;

			const editor = contentsRef.current?.getEditor();
			if (data.channel === CHANNELS.REVIEW) {
				const images = editor
					?.getContents()
					.ops.filter(
						(op) => typeof op.insert === "object" && "image" in op.insert
					)
					.map((op) => (op.insert as { image: string }).image);
				if (images) imageListRef.current = images;
			}
			const detailData: PostDetail = {
				...postInfo,
				title: data.title,
				memberLimit: Number(data.member),
				location: data.location,
				dateRange: data.dateRange,
				recruitCondition: data.condition,
				description: editor?.getText() as string,
				contents: editor?.getContents(),
				images: imageListRef.current,
				url: data.url
			};

			const fullText = editor?.getText().replace(/\n/g, "").trim();
			if ((fullText && fullText.length < 5) || !fullText) {
				showToast({ type: "error", message: "내용을 5자 이상 입력해 주세요" });
				return;
			} else if (fullText && fullText.length > 1000) {
				showToast({
					type: "error",
					message: "내용은 1000자까지만 입력할 수 있습니다"
				});
				return;
			}

			const formData = new FormData();
			formData.append("title", JSON.stringify(detailData));
			formData.append("channelId", data.channel);
			formData.append("postId", postData._id);

			await updatePost(formData);
			navigate(`/post/detail/${postData._id}`);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (!postInfo.images) return;
		initImages(postInfo.images);
	}, []);

	useEffect(() => {
		if (contentsRef.current) {
			const editor = contentsRef.current.getEditor();
			editor.setContents(postInfo.contents);
		}
	}, []);

	return (
		<PostForm
			submitHandler={submitHandler}
			errorHandler={formErrorHandler}
			contentsRef={contentsRef}
			imageProps={imageProps}
			initImages={initImages}
			methods={methods}
			type="edit"
		/>
	);
}
