import { Link } from "react-router";
import profileCircle from "../../assets/images/profileImg_circle.svg";

export default function ProfileImage({
	userId,
	image
}: {
	userId: string;
	image: string;
}) {
	return (
		<Link to={`/profile/${userId}`}>
			<img
				className="w-[50px] h-[50px] object-cover rounded-full active:brightness-75 transition"
				src={image || profileCircle}
				alt="프로필 이미지"
			/>
		</Link>
	);
}
