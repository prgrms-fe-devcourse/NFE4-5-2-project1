import api from './index';

// 댓글 생성 인터페이스
export interface Comment {
  _id: string;
  comment: string;
  author: {
    fullName: string;
    image?: string;
    _id: string;
  };
  createdAt: string;
  updatedAt: string;
  // post, __v 등은 필요 없으면 생략해도 됩니다
}

// 생성
export const createComment = (postId: string, comment: string) =>
  api
    .post<Comment>('/comments/create', { postId, comment })
    .then((res) => res.data);

// 삭제
export const deleteComment = (id: string) =>
  api
    .delete<Comment>('/comments/delete', { data: { id } })
    .then((res) => res.data);
