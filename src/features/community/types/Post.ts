import { Like } from "./Like";
import { CommentType } from "./Comment";

export interface Post {
  _id: string;
  image: string;
  imagePublicId: string;
  title: string;
  likes: Like[];
  comments: CommentType[];
  channel: {
    authRequired: boolean;
    posts: string[];
    _id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  author: {
    role: string;
    emailVerified: boolean;
    banned: boolean;
    image: string;
    isOnline: boolean;
    posts: string[];
    likes: string[];
    comments: string[];
    followers: string[];
    following: string[];
    notifications: string[];
    messages: string[];
    _id: string;
    fullName: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}
