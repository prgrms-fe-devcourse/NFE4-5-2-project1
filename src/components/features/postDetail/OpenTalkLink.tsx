import { usePostStore } from "../../../store/postStore";

export default function OpenTalkLink() {
	const postInfo = usePostStore((state) => state.postInfo);
	if (!postInfo || !postInfo.url) return;
	return (
		<button
			className="cursor-pointer hover:text-[#06B796] underline font-bold self-center"
			onClick={() => {
				window.open(postInfo.url);
			}}
		>
			오픈 카톡 주소
		</button>
	);
}
