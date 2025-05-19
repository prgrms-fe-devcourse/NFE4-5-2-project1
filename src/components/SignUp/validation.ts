type CheckPasswordType = {
  password: {
    content: string;
    valid: boolean;
  };
  checkPassword: {
    content: string;
    valid: boolean;
  };
};

export function inputValidation(
  e: React.ChangeEvent<HTMLInputElement>,
  type: string,
  value?: CheckPasswordType
) {
  let isValid: boolean = false;

  switch (type) {
    case "nickname":
      isValid = /^[a-z0-9가-힣ㄱ-ㅎㅏ-ㅣ]{1,8}$/.test(e.target.value);
      break;
    case "name":
      isValid = /^[가-힣]{2,5}$/.test(e.target.value);
      break;
    case "email":
      isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value);
      break;
    case "password":
      isValid = /^(?=.*[a-z])(?=.*\d)[a-z\d]{8,16}$/.test(e.target.value);
      break;
    case "checkPassword":
      isValid = e.target.value === value!.password.content;
      break;
  }

  return isValid;
}
