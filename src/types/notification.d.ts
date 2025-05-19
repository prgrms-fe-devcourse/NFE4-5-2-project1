type NotificationType = {
  seen: boolean;
  _id: string;
  author: User;
  user: User | string;
  post: Nullable<string>; // 포스트 id
  like: Nullable<string>;
  follow: Optional<string>; // 사용자 id
  comment: Optional<Comment>;
  message: Optional<string>; // 메시지 id
  createdAt: string;
  updatedAt: string;
};
