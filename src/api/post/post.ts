import { axiosInstance } from '../axios';

// 채널의 게시글 목록 불러오기
export const getPostList = (channelId: string) => {
  return axiosInstance.get(`/posts/channel/${channelId}`);
};

// 좋아요 누르기
export const postLikes = (postId: string) => {
  return axiosInstance.post('/likes/create', {
    postId,
  });
};

// 좋아요 삭제하기
export const deleteLikes = (likeId: string) => {
  return axiosInstance.delete('/likes/delete', {
    data: { id: likeId },
  });
};

// 게시글 목록에서 검색한 결과 불러오기
export const getSearchPostList = (value: string) => {
  return axiosInstance.get(`/search/all/${value}`);
};

// 댓글 작성하기
export const postComments = (postId: string, comment: string) => {
  return axiosInstance.post('/comments/create', {
    postId,
    // comment,
    comment: JSON.stringify({
      content: comment,
      image: null,
    }),
  });
};

// 투표하기
export const voteComments = (
  postId: string,
  selectedOptionId: string,
  userId: string
) => {
  return axiosInstance.post('/comments/create', {
    postId,
    comment: JSON.stringify({
      type: 'vote',
      selectedOptionId: selectedOptionId,
      userId,
    }),
  });
};

// 댓글 삭제하기
export const deleteComments = (commentId: string) => {
  return axiosInstance.delete('/comments/delete', {
    data: { id: commentId },
  });
};

// 게시글 수정하기
export const updatePost = (formData: FormData) => {
  return axiosInstance.put(`/posts/update`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 게시글 삭제하기
export const deletePosts = (postId: string) => {
  return axiosInstance.delete('/posts/delete', {
    data: { id: postId },
  });
};

// 사용자가 작성한 게시글 목록 불러오기
export const getAuthorPostData = (userId: string) => {
  return axiosInstance.get<Post[]>(`/posts/author/${userId}`);
};

// 게시글 상세 보기
export const getPostData = (postId: string) => {
  return axiosInstance.get<Post>(`/posts/${postId}`);
};

// 채널의 인기 게시글 불러오기
export const getPopularPostData = async (channelId: string) => {
  const response = await axiosInstance.get(`/posts/channel/${channelId}`);
  const sortPost = response.data.sort((a: Post, b: Post) => {
    if (b.likes.length - a.likes.length !== 0)
      return b.likes.length - a.likes.length;
    else return b.comments.length - a.comments.length;
  });

  return sortPost;
};

// 알림 전송하기
export const postNotifications = (
  notificationType: string,
  notificationTypeId: string,
  userId: string,
  postId: string | null
) => {
  return axiosInstance.post('/notifications/create', {
    notificationType,
    notificationTypeId,
    userId,
    postId,
  });
};
