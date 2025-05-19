export type NotificationRes = {
  seen: boolean;
  _id: string;
  author: {
    _id: string;
    fullName: string;
    email: string;
  };
  user: {
    fullName: string;
    email: string;
  };
  post: string | null;
  like?: {
    _id: string;
    user: string;
    post: string;
  };
  comment?: {
    _id: string;
    comment: string;
    author: string;
    post: string;
  };
  follow?: {
    _id: string;
  };
  message?: string;
  createdAt: string;
  updatedAt: string;
};
