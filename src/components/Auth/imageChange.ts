import Swal from "sweetalert2";
import { userStore } from "../../stores/userStore.ts";
import { ExtendedUser } from "../../types/postType.ts";
import { getUser, deleteUserImage, updateUserImage } from "../../api/user.ts";

export const handleimageChange = async (
  e: React.ChangeEvent<HTMLInputElement>
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
    const data = await updateUserImage(formData);

    Swal.fire({
      icon: "success",
      title: "이미지가 변경 됐습니다.",
      confirmButtonText: "닫기",
    });
    userStore.getState().setUser(data);
  } catch (err) {
    console.error(err);
  }
};

export const handleimageRemove = async () => {
  const user = userStore.getState().getUser() as ExtendedUser;
  const formData = new FormData();

  formData.append("isCover", "false");

  try {
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
