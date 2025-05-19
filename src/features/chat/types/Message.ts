export interface Message {
  _id: "string";
  message: "string";
  sender: {
    _id: "string";
    fullName: "string";
    email: "string";
    coverImage: "string";
    image: "string";
    role: "string";
    emailVerified: true;
    banned: true;
    isOnline: true;
    posts: [
      {
        likes: [
          {
            _id: "string";
            user: "string";
            post: "string";
            createdAt: "string";
            updatedAt: "string";
          }
        ];
        comments: [
          {
            _id: "string";
            comment: "string";
            author: "string";
            post: "string";
            createdAt: "string";
            updatedAt: "string";
          }
        ];
        _id: "string";
        image: "string";
        imagePublicId: "string";
        title: "string";
        channel: {
          authRequired: true;
          posts: ["string"];
          _id: "string";
          name: "string";
          description: "string";
          createdAt: "string";
          updatedAt: "string";
        };
        author: "string";
        createdAt: "string";
        updatedAt: "string";
      }
    ];
    likes: [
      {
        _id: "string";
        user: "string";
        post: "string";
        createdAt: "string";
        updatedAt: "string";
      }
    ];
    comments: ["string"];
    followers: [
      {
        _id: "string";
        user: "string";
        follower: "string";
        createdAt: "string";
        updatedAt: "string";
      }
    ];
    following: [
      {
        _id: "string";
        user: "string";
        follower: "string";
        createdAt: "string";
        updatedAt: "string";
      }
    ];
    notifications: [
      {
        seen: true;
        _id: "string";
        author: "string";
        user: "string";
        post: "string";
        follow: "string";
        comment: {
          _id: "string";
          comment: "string";
          author: "string";
          post: "string";
          createdAt: "string";
          updatedAt: "string";
        };
        message: "string";
        createdAt: "string";
        updatedAt: "string";
      }
    ];
    messages: ["string"];
    createdAt: "string";
    updatedAt: "string";
  };
  receiver: {
    _id: "string";
    fullName: "string";
    email: "string";
    coverImage: "string";
    image: "string";
    role: "string";
    emailVerified: true;
    banned: true;
    isOnline: true;
    posts: [
      {
        likes: [
          {
            _id: "string";
            user: "string";
            post: "string";
            createdAt: "string";
            updatedAt: "string";
          }
        ];
        comments: [
          {
            _id: "string";
            comment: "string";
            author: "string";
            post: "string";
            createdAt: "string";
            updatedAt: "string";
          }
        ];
        _id: "string";
        image: "string";
        imagePublicId: "string";
        title: "string";
        channel: {
          authRequired: true;
          posts: ["string"];
          _id: "string";
          name: "string";
          description: "string";
          createdAt: "string";
          updatedAt: "string";
        };
        author: "string";
        createdAt: "string";
        updatedAt: "string";
      }
    ];
    likes: [
      {
        _id: "string";
        user: "string";
        post: "string";
        createdAt: "string";
        updatedAt: "string";
      }
    ];
    comments: ["string"];
    followers: [
      {
        _id: "string";
        user: "string";
        follower: "string";
        createdAt: "string";
        updatedAt: "string";
      }
    ];
    following: [
      {
        _id: "string";
        user: "string";
        follower: "string";
        createdAt: "string";
        updatedAt: "string";
      }
    ];
    notifications: [
      {
        seen: true;
        _id: "string";
        author: "string";
        user: "string";
        post: "string";
        follow: "string";
        comment: {
          _id: "string";
          comment: "string";
          author: "string";
          post: "string";
          createdAt: "string";
          updatedAt: "string";
        };
        message: "string";
        createdAt: "string";
        updatedAt: "string";
      }
    ];
    messages: ["string"];
    createdAt: "string";
    updatedAt: "string";
  };
  seen: true;
  createdAt: "string";
  updatedAt: "string";
}
