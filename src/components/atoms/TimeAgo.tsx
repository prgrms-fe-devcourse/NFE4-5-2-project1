interface TimeAgoProps {
  timestamp: string | number | Date;
  fontSize?: number; // 폰트 크기를 props로 받습니다. (단위: px)
}

// 사용법: <TimeAgo timestamp={post.createdAt} /> props로 api를 통해 받은 createdAt을 넘겨준다
// api 예시 createdAt: "2021-10-15T20:48:19.816Z",
export default function TimeAgo({
  timestamp, // api가 들어오는 것을 받음
  fontSize = 12, // 기본값 12px
}: TimeAgoProps) {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

  const style = { fontSize };
  const className = 'nanum-gothic-regular text-[#ababab] dark:text-dark-text'; // 기본 폰트 클래스

  if (diffInSeconds < 60) {
    return <span style={style}>{`${diffInSeconds}초 전`}</span>;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return (
      <span className={className} style={style}>{`${diffInMinutes}분 전`}</span>
    );
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return (
      <span className={className} style={style}>{`${diffInHours}시간 전`}</span>
    );
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return (
      <span className={className} style={style}>{`${diffInDays}일 전`}</span>
    );
  }

  // 7일 이상일 때는 년월일 출력
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const day = time.getDate();

  return (
    <span
      className={className}
      style={style}
    >{`${year}년 ${month}월 ${day}일`}</span>
  );
}
