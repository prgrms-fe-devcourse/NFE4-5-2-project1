import { SignUpValue, UpdateValue } from "../../types/userTypes";

export function inputValidation(
  e: React.ChangeEvent<HTMLInputElement>,
  type: string,
  value: SignUpValue | UpdateValue
) {
  let isValid: boolean = false;

  switch (type) {
    case "nickName":
      isValid = /^[a-z0-9가-힣ㄱ-ㅎㅏ-ㅣ]{1,8}$/.test(e.target.value);
      break;
    case "name":
      isValid = /^[가-힣]{2,5}$/.test(e.target.value);
      break;
    case "email":
      isValid = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
        e.target.value
      );
      break;
    case "password":
      isValid = /^(?=.*[a-z])(?=.*\d)[a-z\d]{8,16}$/.test(e.target.value);
      break;
    case "checkPassword":
      isValid = e.target.value === value.password;
      break;
  }

  return isValid;
}

export function editValidation(
  e: React.ChangeEvent<HTMLInputElement>,
  type: string,
  value: UpdateValue
) {
  let isValid: boolean = false;
  if (value[type]!.content === "") return;

  switch (type) {
    case "nickName":
      isValid = /^[a-z0-9가-힣ㄱ-ㅎㅏ-ㅣ]{1,8}$/.test(e.target.value);
      break;
    case "password":
      isValid = /^(?=.*[a-z])(?=.*\d)[a-z\d]{8,16}$/.test(e.target.value);
      break;
    case "checkPassword":
      isValid = e.target.value === value.password?.content;
      break;
  }

  return isValid;
}
