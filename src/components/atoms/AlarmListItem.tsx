import { Link } from 'react-router-dom';
import TimeAgo from './TimeAgo';

export default function AlarmListItem({ alarm }: { alarm: Notification }) {
  return (
    <>
      <div className="dark:bg-dark-bg dark:text-dark-text py-[10px]">
        <p className="nanum-gothic-regular dark:bg-dark-bg line-clamp-2 w-[100%] text-sm hover:underline">
          <Link to={`/${alarm.author._id}`}>
            <span className="nanum-gothic-bold">{alarm.author.fullName}</span>님
          </Link>
          {alarm.comment && (
            <Link to={`/post/${alarm.post}`}>
              이 "{JSON.parse((alarm.comment.post as Post).title).title}"
              게시글에 답글을 남겼습니다.
            </Link>
          )}
          {alarm.like && (
            <Link to={`/post/${alarm.post}`}>
              이 "{JSON.parse((alarm.like.post as Post).title).title}" 게시글을
              좋아합니다.
            </Link>
          )}
          {alarm.follow && (
            <Link to={`/${alarm.author._id}`}>이 나를 팔로우합니다.</Link>
          )}
        </p>
        <p className="nanum-gothic-regular dark:text-dark-text mt-[5px] cursor-default text-[12px] text-[#ababab]">
          <TimeAgo timestamp={alarm.createdAt} />
        </p>
      </div>
    </>
  );
}
