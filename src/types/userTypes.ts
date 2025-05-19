import { BaseUser, ExtendedUser } from "./postType";

export interface UserStore {
  user: ExtendedUser | null;
  token: string;
  setUser: (user: BaseUser | ExtendedUser) => void;
  setToken: (token: string) => void;
  getToken: () => string;
  getUser: () => null | ExtendedUser;
  logout: () => void;
}

export type SignUpValue = {
  [type: string]: string;
};

export type UpdateValue = {
  [type: string]: {
    valid: boolean;
    content: string;
  };
};

export type SetData = {
  nickname: {
    value: string;
    valid: boolean;
  };
  name: {
    value: string;
    valid: boolean;
  };
  email: {
    value: string;
    valid: boolean;
  };
  password: {
    value: string;
    valid: boolean;
  };
  checkPassword: {
    value: string;
    valid: boolean;
  };
};

export type CheckPasswordType = {
  password: {
    content: string;
    valid: boolean;
  };
  checkPassword: {
    content: string;
    valid: boolean;
  };
};
