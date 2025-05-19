import { NotificationRes } from "../types/NotificationRes";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import profile from "../../../assets/images/default-profile-logo.svg";
import { axiosInstance } from "../../../apis/axiosInstance";

type Props = {
  noti: NotificationRes;
  updateNotifications: (notiId: string) => void;
  closeNotifications: () => void;
};
interface Post {
  _id: string;
  channel: string;
}

function isPost(obj: unknown): obj is Post {
  return (
    obj !== null &&
    obj !== undefined &&
    typeof obj === "object" &&
    "_id" in obj &&
    "channel" in obj
  );
}
export default function NotificationItem({ noti, closeNotifications }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { author, comment, like, follow, message } = noti;

  const [authorImage, setAuthorImage] = useState(profile);

  useEffect(() => {
    const fetchAuthorImage = async () => {
      try {
        const res = await axiosInstance.get(`/users/${author._id}`);
        const user = await res.data;
        if (user.image) setAuthorImage(user.image);
      } catch (err) {
        console.warn("유저 이미지 불러오기 실패", err);
      }
    };

    fetchAuthorImage();
  }, [author._id]);

  let authorName = "알 수 없음";

  try {
    const parsedFullName = JSON.parse(author.fullName);
    authorName = parsedFullName?.name?.trim() || "알 수 없음";
  } catch {
    console.warn("fullName 파싱 실패", author.fullName);
  }

  let notificationMessage = "";

  if (follow) {
    notificationMessage = `${authorName} 님이 나를 팔로우 했습니다.`;
  } else if (comment) {
    notificationMessage = `${authorName} 님이 내 게시물에 댓글을 남겼습니다.`;
  } else if (like) {
    notificationMessage = `${authorName} 님이 내 게시물을 좋아합니다.`;
  } else if (message) {
    notificationMessage = `${authorName} 님이 내게 메시지를 보냈습니다.`;
  } else {
    notificationMessage = `${authorName} 님의 알림입니다.`;
  }

  const clickHandler = (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    e.stopPropagation();

    let postId: string | undefined;
    let channelId: string | undefined;

    if (comment?.post) {
      if (isPost(comment.post)) {
        postId = comment.post._id;
        channelId = comment.post.channel;
      } else if (typeof comment.post === "string") {
        postId = comment.post;
      }
    } else if (like?.post) {
      if (isPost(like.post)) {
        postId = like.post._id;
        channelId = like.post.channel;
      } else if (typeof like.post === "string") {
        postId = like.post;
      }
    }

    if (channelId && postId) {
      if (channelId === "681e2fbc7380bb759ecc6367") {
        navigate("/community/bops-community");
      } else {
        const channelPath =
          channelId === "681e2fdd7380bb759ecc636d"
            ? "concert-community"
            : "open-community";
        navigate(
          `/community/${channelPath}/post/${encodeURIComponent(postId)}`
        );
      }
    } else if (postId) {
      navigate(`/community/open-community/post/${encodeURIComponent(postId)}`);
    } else if (message) {
      navigate(`/chat/${author._id}`, { state: { from: location.pathname } });
    }

    closeNotifications();
  };

  return (
    <li
      className="group text-[12px] w-[288px] p-2 rounded-lg flex items-center cursor-pointer hover:bg-[color:var(--grey-500)]"
      onClick={clickHandler}
    >
      <img
        src={authorImage}
        className="w-6 h-6 rounded-4xl"
        alt="프로필 이미지"
      />
      <p className="pl-3 w-[247px] h-auto">{notificationMessage}</p>
    </li>
  );
}
