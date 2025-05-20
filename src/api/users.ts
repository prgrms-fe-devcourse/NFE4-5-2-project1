// src/api/users.ts
import api from './index';

// 전체 사용자
export const getUsers = (offset?: number, limit?: number) =>
  api
    .get('/users/get-users', { params: { offset, limit } })
    .then((res) => res.data);

// 온라인 사용자
export const getOnlineUsers = () =>
  api.get('/users/online-users').then((res) => res.data);

// 특정 사용자
export const getUserById = (userId: string) =>
  api.get(`/users/${userId}`).then((res) => res.data);

// 프로필·커버 업로드 (FormData)
export const uploadPhoto = (file: File, isCover: boolean) => {
  const form = new FormData();
  form.append('image', file);
  form.append('isCover', String(isCover));

  return api
    .post('/users/upload-photo', form, {
      headers: {
        // 'Content-Type'을 명시하지 않으면
        // 브라우저가 multipart/form-data; boundary=... 를 자동 설정합니다.
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res.data);
};

// 내 정보 수정
export interface UpdateUserPayload {
  fullName: string;
  username: string; // JSON 문자열
}

export const updateUser = ({
  fullName,
  introduction,
  tags,
  email,
  github,
  velog,
  homepage,
}: {
  fullName?: string;
  introduction?: string;
  tags?: string[];
  email?: string;
  github?: string;
  velog?: string;
  homepage?: string;
}) => {
  // 1) 커스텀 데이터를 하나의 오브젝트로 묶어서
  const userMeta = { introduction, tags, email, github, velog, homepage };

  // 2) username 필드에 JSON.stringify
  return api
    .put('/settings/update-user', {
      fullName,
      username: JSON.stringify(userMeta),
    })
    .then((res) => res.data);
};

// 비밀번호 변경
export const updatePassword = (password: string) =>
  api.put('/settings/update-password', { password }).then((res) => res.data);
