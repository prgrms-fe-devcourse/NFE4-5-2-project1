import { useCallback, useEffect, useState } from "react";
import { getUserInfo } from "../../../apis/user";
import { usePostStore } from "../../../store/postStore";
import ProfileImage from "../../commons/ProfileImage";

export default function MemberList() {
	const members = usePostStore((state) => state.members);
	const [userData, setUserData] = useState<UserData[]>([]);
	const fetchUsers = useCallback(async () => {
		const users = await Promise.all(
			members.map((member) => getUserInfo(member))
		);
		setUserData(users);
	}, [members]);
	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);
	return (
		<div>
			<div className="mb-4">
				<span className="post-sub-title inline">크루</span>
				<span className="sub_title_number">{members.length}</span>
			</div>
			<ul className="flex gap-[10px]">
				{userData &&
					userData.map((user) => {
						const parsed: Profile = JSON.parse(user.fullName);
						return (
							<li key={user._id} className="flex flex-col gap-1 items-center">
								<ProfileImage userId={user._id} image={user.image} />
								<span className="text-sm">{parsed.nickname}</span>
							</li>
						);
					})}
			</ul>
		</div>
	);
}
