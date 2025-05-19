import { useRef } from "react";
import { uploadPhoto } from "../../../apis/user";
import profileCircle from "../../../assets/images/profileImg_circle.svg";
import { useAuthStore } from "../../../store/authStore";
import Button from "../../commons/Button";
import { showToast } from "../../commons/Toast";

interface Props {
	editProfile: Profile;
	setEditProfile: React.Dispatch<React.SetStateAction<Profile>>;
	image: string;
	setImage: (url: string) => void;
	onClose: () => void;
	onUpdate: () => void;
}

export default function ProfileEditModal({
	editProfile,
	setEditProfile,
	image,
	setImage,
	onClose,
	onUpdate
}: Props) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const { setImage: setGlobalImage, setNickname: setGlobalNickname } =
		useAuthStore();

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			const result = await uploadPhoto(file);
			if (!result?.image) throw new Error("서버 응답에 image 없음");
			setImage(result.image);
			setEditProfile((prev) => ({ ...prev, image: result.image }));
			setGlobalImage(result.image);
		} catch (err) {
			console.error("사진 업로드 실패:", err);
			showToast({ type: "error", message: "프로필 사진 업로드 실패" });
		}
	};

	const handleResetToDefaultImage = async () => {
		try {
			const response = await fetch(profileCircle);
			const blob = await response.blob();
			const defaultImageFile = new File([blob], "default-profile.svg", {
				type: blob.type
			});

			const result = await uploadPhoto(defaultImageFile);
			if (!result?.image) throw new Error("기본 이미지 업로드 실패");

			setImage(result.image);
			setEditProfile((prev) => ({ ...prev, image: result.image }));
			setGlobalImage(result.image);
		} catch (err) {
			console.error("기본 이미지 변경 실패:", err);
			showToast({ type: "error", message: "기본 이미지로 변경 실패" });
		}
	};

	const handleInputTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== "Enter" || e.nativeEvent.isComposing) return;
		const value = e.currentTarget.value.trim();
		if (!value) return;
		if (editProfile.tagList?.includes(value)) {
			showToast({ type: "warning", message: "이미 추가된 태그입니다." });
			e.currentTarget.value = "";
			return;
		}
		setEditProfile((prev) => ({
			...prev,
			tagList: [...(prev.tagList ?? []), value]
		}));
		e.currentTarget.value = "";
	};

	const handleRemoveTag = (index: number) => {
		setEditProfile((prev) => ({
			...prev,
			tagList: prev.tagList.filter((_, i) => i !== index)
		}));
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
			<div className="w-full h-full sm:w-[524px] sm:h-auto sm:rounded-[15px] bg-[#ffffff] pt-[100px] sm:pt-[30px] pb-[24px] shadow-lg z-50 dark:bg-[#313131]">
				<h2 className="flex justify-center text-[20px] sm:text-[24px] font-medium">
					프로필 편집
				</h2>
				<div className="pt-[30px] sm:pt-[20px]">
					<img
						src={image}
						alt="프로필 이미지"
						className="select-none w-[150px] h-[150px] sm:w-[160px] sm:h-[160px] rounded-full mx-auto object-cover"
					/>
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						onChange={handleImageUpload}
						className="hidden"
					/>
					<div className="flex justify-center gap-2 mt-[15px]">
						<Button
							onClick={() => fileInputRef.current?.click()}
							reverse
							className="select-none w-auto h-[40px] sm:h-[44px] rounded-[8px] px-4 py-2 font-medium sm:font-normal text-[14px] sm:text-[16px] border dark:bg-transparent dark:hover:bg-[#434343]"
						>
							프로필 이미지 변경
						</Button>
						<Button
							onClick={handleResetToDefaultImage}
							reverse
							className="select-none h-[40px] sm:h-[44px] rounded-[8px] px-4 py-2 font-medium sm:font-normal text-[14px] sm:text-[16px] border dark:bg-transparent dark:hover:bg-[#434343]"
						>
							기본 이미지로 변경
						</Button>
					</div>
				</div>

				<div className="flex flex-col items-center pt-[20px] pb-[10px] gap-3 sm:gap-4">
					{/* 닉네임 수정 */}	
					<div>
						<label className="select-none block text-[14px] sm:text-[16px]">닉네임</label>
						<input
							type="text"
							value={editProfile.nickname}
							onChange={(e) =>
								setEditProfile({ ...editProfile, nickname: e.target.value })
							}
							className="text-[14px] sm:text-[16px] rounded-[10px] w-[300px] h-[45px] sm:w-[340px] sm:h-[49px] px-[13px] py-[15px] mt-[5px] sm:mt-[10px] border border-[#616161]"
						/>
						<p className="text-[10px] sm:text-[11px] mt-[5px]">
							*2자 이상 10자 이내의 한글, 영문, 숫자 입력 가능
						</p>
					</div>
					{/* 태그 입력 */}
					<div>
						<label className="select-none block text-[14px] sm:text-[16px]">자기소개 키워드</label>
						<input
							type="text"
							onKeyDown={handleInputTag}
							placeholder="입력 후 Enter"
							className="select-none text-[14px] sm:text-[16px] rounded-[10px] w-[300px] h-[45px] sm:w-[340px] sm:h-[49px] px-[13px] mt-[5px] sm:mt-[10px] border border-[#616161]"
						/>
					</div>
					<div className="flex flex-wrap justify-center gap-[10px] mt-[10px] w-[300px] sm:w-[340px]">
						{editProfile.tagList?.map((tag, i) => (
							<div
								key={i}
								className="flex justify-between items-center gap-1 px-3 py-1 bg-[#F3F4F6] text-[14px] sm:text-[16px] text-[#06b796] rounded-[8px] dark:bg-transparent dark:border dark:border-[#06b796]"
							>
								{tag}
								<button
									onClick={() => handleRemoveTag(i)}
									className="text-[14px] sm:text-sm text-[#06b796] hover:text-red-500 cursor-pointer"
								>
									✕
								</button>
							</div>
						))}
					</div>
				</div>

				{/* 버튼 */}
				<div className="flex justify-center gap-[20px] mt-3">
					<Button
						onClick={() => {
							onUpdate();
							setGlobalImage(image);
							setGlobalNickname(editProfile.nickname);
						}}
						className="select-none w-[140px] h-[46px] sm:w-[160px] sm:h-[46px] px-[55px] py-[12px] sm:px-[60px] sm:py-[12px] rounded-[10px] text-[14px] sm:text-[16px]"
					>
						저장
					</Button>

					<Button
						onClick={onClose}
						reverse
						className="select-none w-[140px] h-[46px] sm:w-[160px] sm:h-[46px] px-[55px] py-[12px] sm:px-[60px] sm:py-[12px] rounded-[10px] text-[14px] sm:text-[16px] border dark:bg-transparent dark:hover:bg-[#434343]"
					>
						취소
					</Button>
				</div>
			</div>
		</div>
	);
}
