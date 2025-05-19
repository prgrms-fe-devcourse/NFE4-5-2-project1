interface Channel {
  authRequired: boolean;
  posts: string[];
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Like {
  _id: string;
  user: string;
  post: string;
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  _id: string;
  comment: string;
  author: User;
  post: string;
  createdAt: string;
  updatedAt: string;
}
interface Post {
  likes: Like[];
  comments: Comment[];
  _id: string;
  image?: string;
  imagePublicId?: string;
  title: string;
  channel: Channel;
  author: User;
  createdAt: string;
  updatedAt: string;
  myCommentCount?: number;
}

interface Follow {
  _id: string;
  user: string;
  follower: string;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  _id: string;
  message: string;
  sender: User;
  receiver: User;
  seen: boolean;
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  fullName: string;
  email: string;
  coverImage: string;
  image: string;
  role: 'Admin' | 'Regular' | string;
  isOnline: boolean;
  posts?: Post[];
  likes?: Like[];
  notifications?: Notification[];
  comments?: Comment[];
  followers: Follow[];
  following: Follow[];
  messages?: Message[];
  createdAt?: string;
  updatedAt?: string;
}

type UserInfo = {
  userData: User | null;
  userId?: string;
  refetchUserData: () => void;
};

type UserPostInfo = {
  userData: User | null;
};

interface Conversation {
  _id: string[];
  message: string;
  sender: User;
  receiver: User;
  seen: boolean;
  createdAt: string;
}

type EnteredValues = {
  myName: string;
  password: string;
  confirmPassword: string;
};

interface EditMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

type PhotoUploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (file: File) => void;
};

type EnteredErrorValues = {
  myNameError: string;
  passwordError: string;
  confirmPasswordError: string;
};

declare module 'react-js-pagination' {
  import * as React from 'react';

  export interface PaginationProps {
    activePage: number;
    itemsCountPerPage: number;
    totalItemsCount: number;
    pageRangeDisplayed: number;
    onChange(pageNumber: number): void;
    innerClass?: string;
    itemClass?: string;
    activeClass?: string;
    linkClass?: string;
    disabledClass?: string;
    prevPageText?: React.ReactNode;
    nextPageText?: React.ReactNode;
    firstPageText?: React.ReactNode;
    lastPageText?: React.ReactNode;
  }

  export default class Pagination extends React.Component<PaginationProps> {}
}

type ChatTargetUser = {
  id: string;
  name: string;
};
