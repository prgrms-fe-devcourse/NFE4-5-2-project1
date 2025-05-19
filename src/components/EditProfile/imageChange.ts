import Swal from "sweetalert2";
import { userStore } from "../../stores/userStore.ts";
import { ExtendedUser } from "../../types/postType.ts";
import { getUser, deleteUserImage, updateUserImage } from "../../api/user.ts";

export const handleimageChange = async (
  e: React.ChangeEvent<HTMLInputElement>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const file = e.target.files?.[0];

  if (!file) {
    console.log("파일이 없습니다.");
    return;
  }

  const formData = new FormData();

  formData.append("isCover", "false");
  formData.append("image", file);

  try {
    setLoading(true);
    const data = await updateUserImage(formData);

    Swal.fire({
      icon: "success",
      title: "이미지가 변경 됐습니다.",
      confirmButtonText: "닫기",
    });
    userStore.getState().setUser(data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

export const handleimageRemove = async (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const user = userStore.getState().getUser() as ExtendedUser;
  const formData = new FormData();

  formData.append("isCover", "false");

  try {
    setLoading(false);
    await deleteUserImage(formData);
    const data = await getUser(user._id);

    Swal.fire({
      icon: "success",
      title: "이미지 삭제 됐습니다.",
      confirmButtonText: "닫기",
    });
    userStore.getState().setUser(data);
  } catch (err) {
    console.error(err);
  }
};

export const handlePreviewImage = (
  e: React.ChangeEvent<HTMLInputElement>,
  setPreview: React.Dispatch<React.SetStateAction<string>>
) => {
  const file = e.target.files![0];
  if (!file) return;

  const imageUrl = URL.createObjectURL(file);
  setPreview(imageUrl);

  return () => URL.revokeObjectURL(imageUrl);
};
