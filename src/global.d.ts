declare global {
  /* 사용자 */
  interface User {
    _id: string; // 사용자 ID
    fullName: string; // 사용자 이름
    username: string; // 사용자 기타 정보 (한 줄 소개, 기술스택, 소셜 정보)
    email: string; // 사용자 이메일
    coverImage: string; // 커버 이미지 (한 줄 설명, 기술스택 태그)
    image: string; // 프로필 이미지
    role: string; // 사용자 역할
    emailVerified: boolean; // 사용자 이메일 인증 여부 (사용되지 않음)
    banned: boolean; // 사용자 차단 여부 (사용되지 않음)
    isOnline: boolean; // 사용자 온라인 여부
    posts: Post[]; // 사용자가 작성한 게시물
    likes: Like[]; // 사용자가 좋아요한 게시물
    comments: string[]; // 사용자가 작성한 댓글
    followers: Follow[]; // 사용자를 팔로우하는 사용자
    following: Follow[]; // 사용자가 팔로우하는 사용자
    notifications: Notification[]; // 사용자에게 온 알림
    messages: Message[]; // 사용자에게 온 메세지
    createdAt: string; // 사용자 생성일
    updatedAt: string; // 사용자 수정일
  }

  /* 채널 */
  interface Channel {
    authRequired: boolean; // (사용되지 않음)
    posts: string[]; // 채널에 속한 게시물 ID
    _id: string; // 채널 ID
    name: string; // 채널 이름
    description: string; // 채널 설명
    createdAt: string; // 채널 생성일
    updatedAt: string; // 채널 수정일
  }

  /* 게시글 */
  interface Post {
    likes: Like[]; // 게시글에 달린 좋아요
    comments: Comment[]; // 게시글에 달린 댓글
    _id: string; // 게시글 ID
    image: string | undefined; // 게시글 이미지
    imagePublicId: string | undefined; // 게시글 이미지 공개 ID
    title: string; // 게시글 제목 (제목, 내용, 태그)
    channel: Channel; // 게시글이 속한 채널
    author: User | string; // 게시글 작성자
    createdAt: string; // 게시글 생성일
    updatedAt: string; // 게시글 수정일
  }

  /* 좋아요 */
  interface Like {
    _id: string; // 좋아요 ID
    user: string; // 좋아요를 누른 사용자 ID
    post: string | Post; // 좋아요가 눌린 게시글 ID
    createdAt: string; // 좋아요 생성일
    updatedAt: string; // 좋아요 수정일
  }

  /* 댓글 */
  interface Comment {
    _id: string; // 댓글 ID
    comment: string; // 댓글 내용
    author: User; // 댓글 작성자
    post: string | Post; // 댓글이 달린 게시글 ID
    createdAt: string; // 댓글 생성일
    updatedAt: string; // 댓글 수정일
  }

  /* 알림 */
  interface Notification {
    seen: boolean; // 사용자가 알림을 확인했는지 여부
    _id: string; // 알림 ID
    author: User; // 알림 작성자
    user: User | string; // 알림 대상 사용자
    post: string; // 알림이 달린 게시글 ID
    follow: string | null; // 알림이 달린 팔로우 ID
    comment: Comment; // 알림이 달린 댓글
    like: Like; // 알림이 달린 좋아요
    message: string | null; // 알림이 달린 메시지
    createdAt: string; // 알림 생성일
    updatedAt: string; // 알림 수정일
  }

  /* 팔로우 */
  interface Follow {
    _id: string; // 팔로우 ID
    user: string; // 팔로우를 하는 사용자 ID
    follower: string; // 팔로우를 받는 사용자 ID
    createdAt: string; // 팔로우 생성일
    updatedAt: string; // 팔로우 수정일
  }

  /* 메세지함 */
  interface Conversation {
    _id: string; // 메시지 ID
    message: string; // 메시지 내용
    sender: User; // 메시지를 보낸 사용자
    receiver: User; // 메시지를 받은 사용자
    seen: boolean; // 메시지 확인 여부
    createdAt: string; // 메시지 생성일
  }

  /* 메세지 */
  interface Message {
    _id: string; // 메시지 ID
    message: string; // 메시지 내용
    sender: User; // 메시지를 보낸 사용자
    receiver: User; // 메시지를 받은 사용자
    seen: boolean; // 메시지 확인 여부
    createdAt: string; // 메시지 생성일
    updatedAt: string; // 메시지 수정일
  }
}

export {};
