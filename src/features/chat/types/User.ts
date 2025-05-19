export interface User {
  role: string;
  emailVerified: false;
  banned: false;
  isOnline: false;
  posts: string[];
  likes: [];
  comments: [];
  followers: [];
  following: [];
  notifications: [];
  messages: string[];
  _id: string;
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  image: string;
}
