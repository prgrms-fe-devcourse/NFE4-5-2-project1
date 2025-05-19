export interface ParsedUser {
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
  fullName: { name: string; favoriteGenre: string; favoriteArtist: string };
  email: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  image: string;
}
