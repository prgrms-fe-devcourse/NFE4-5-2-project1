import Swal from "sweetalert2";
import "animate.css";

export const sendButtonHandler = (content: string) => {
  if (!content) {
    Swal.fire({
      title: "내용을 입력해주세요",
      icon: "warning",
      toast: true,
      position: "bottom",
      timer: 1500,
      showConfirmButton: false,
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `,
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `,
      },
    });
  } else {
    Swal.fire({
      title: "쪽지가 전송되었습니다!",
      icon: "success",
      toast: true,
      position: "bottom",
      timer: 1500,
      showConfirmButton: false,
      showClass: {
        popup: `
        animate__animated
        animate__fadeInUp
        animate__faster
      `,
      },
      hideClass: {
        popup: `
        animate__animated
        animate__fadeOutDown
        animate__faster
      `,
      },
    });
  }
};
