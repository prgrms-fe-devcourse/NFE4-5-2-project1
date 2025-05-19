import { useParams } from "react-router";
import { axiosInstance } from "../apis/axios";
import { getUserInfo } from "../apis/user";
import { useAuthStore } from "../store/authStore";
import { showToast } from "../components/commons/Toast";
import { useEffect, useState, useMemo, useCallback } from "react";
import profileCircle from "../assets/images/profileImg_circle.svg";
import ProfileView from "../components/features/profile/ProfileView";
import ProfileHeader from "../components/features/profile/ProfileHeader";
import ProfileEditModal from "../components/features/profile/ProfileEditModal";
import ProfileChannelTab from "../components/features/profile/ProfileChannelTab";

const initialProfile: Profile = {
	name: "",
	tel: "",
	nickname: "",
	gender: "",
	age: 0,
	tagList: []
};

const isValidNickname = (nickname: string) => 
	/^[가-힣a-zA-Z0-9]{2,10}$/.test(nickname);

export default function Profile() {
	const { id: paramsId } = useParams();
	const myUserId = useAuthStore((state) => state.userId);
	const viewingUserId = useMemo(
		() => paramsId || myUserId,
		[paramsId, myUserId]
	);
	const isMyPage = viewingUserId === myUserId;
	
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [image, setImage] = useState(profileCircle);
	const [profile, setProfile] = useState<Profile>(initialProfile);
	const [editProfile, setEditProfile] = useState<Profile>({ ...profile });

	const getUserData = useCallback(async () => {
		try {
			const { image, fullName } = await getUserInfo(viewingUserId!);
			const parsed = JSON.parse(fullName);
			setImage(image || profileCircle);
			setProfile(parsed);
		} catch (err) {
			console.error("유저 정보 가져오기 실패:", err);
			showToast({ type: "error", message: "유저 정보를 불러오지 못했습니다." });
		}
	}, [viewingUserId]);

	useEffect(() => {
		if (viewingUserId) getUserData();
	}, [viewingUserId, getUserData]);

	const handleEditClick = () => {
		setEditProfile(profile);
		setIsModalOpen(true);
	};

	const handleUpdate = async () => {
		if (!isValidNickname(editProfile.nickname)) {
			showToast({
				type: "error",
				message: "닉네임은 2자 이상 10자 이하의 한글, 영문, 숫자만 가능합니다."
			});
			return;
		}

		const updatedFullName = JSON.stringify({
			...profile,
			nickname: editProfile.nickname,
			tagList: editProfile.tagList
		});
		
		try {
			await axiosInstance.put("/settings/update-user", {
				fullName: updatedFullName
			});
			setProfile(editProfile);
			setIsModalOpen(false);
			showToast({ type: "success", message: "프로필이 업데이트 되었습니다!" });
		} catch (err) {
			console.error("업데이트 실패:", err);
			showToast({ type: "error", message: "프로필 업데이트 실패" });
		}
	};

	return (
		<div className="flex flex-col items-center min-h-screen pb-[70px] sm:py-[20px]">

			<div className="pt-[92px] sm:pt-0 sm:items-center sm:w-[1100px] sm:p-0 w-full px-[16px] py-[0px] sm:bg-transparent">
				<div>
					<ProfileHeader
						onEditClick={handleEditClick}
						isMyPage={isMyPage}
						userId={viewingUserId}
					/>
					<ProfileView profile={profile} image={image} />
					{isMyPage && isModalOpen && (
						<ProfileEditModal
							image={image}
							setImage={setImage}
							editProfile={editProfile}
							setEditProfile={setEditProfile}
							onUpdate={handleUpdate}
							onClose={() => setIsModalOpen(false)}
						/>
					)}
				</div>
				<div>
					{viewingUserId && (
						<ProfileChannelTab userId={viewingUserId} isMyPage={isMyPage} />
					)}
				</div>
			</div>
		</div>
	);
}
