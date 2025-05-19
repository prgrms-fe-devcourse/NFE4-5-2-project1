import Swal from "sweetalert2";
import { ExtendedUser } from "../../types/postType.ts";
import { userStore } from "../../stores/userStore.ts";
import { logout } from "../../api/auth.ts";
import { useNavigate } from "react-router";
import { useCallback } from "react";
import { updateUserInfo, updateUserPassword } from "../../api/user.ts";

type FieldType = "nickname" | "checkpassword";

interface UpdateData {
  valid: boolean;
  content: string;
}

export function useUpdateHandler() {
  const navigate = useNavigate();

  const handleUpdate = useCallback(
    async (data: UpdateData, type: FieldType) => {
      const user = userStore.getState().getUser() as ExtendedUser;

      if (user.username === data.content) {
        Swal.fire({
          icon: "error",
          title: "이미 사용중인 닉네임 입니다.",
          confirmButtonText: "닫기",
        });
        return;
      }
      if (!data.valid) {
        Swal.fire({
          icon: "error",
          title: "변경 사항을 확인 해주세요.",
          confirmButtonText: "닫기",
        });
        return;
      }

      try {
        let response;
        if (type === "nickname") {
          response = await updateUserInfo(user.fullName, data.content);
        } else {
          response = await updateUserPassword(data.content);
        }

        if (response!.status !== 200) throw new Error();

        Swal.fire({
          icon: "success",
          title: "수정이 완료 됐습니다.",
          confirmButtonText: "닫기",
        });

        if (type === "checkpassword") {
          await logout();
          navigate("/login");
          return;
        }

        userStore.getState().setUser(response!.data);
        console.log(userStore.getState().getUser());
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "수정을 실패 했습니다.",
          confirmButtonText: "닫기",
        });
        console.error(err);
      }
    },
    [navigate]
  );

  return handleUpdate;
}
export default useUpdateHandler;
