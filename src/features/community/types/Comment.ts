export type CommentType = {
  _id: string;
  author: {
    fullName: string;
    _id: string;
    image: string;
  };
  comment: string;
  createdAt: string;
};
