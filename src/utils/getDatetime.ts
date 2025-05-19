import dayjs from 'dayjs';

// 작성 시간 포맷 설정
export default function getElapsedTime(createdAt: string) {
  const now = dayjs().add(9, 'hour');
  const writeTime = dayjs(createdAt).add(9, 'hour');

  const gap = now.diff(writeTime, 's');
  if (gap < 60) return `${gap}초 전`;
  if (gap < 3600) return `${Math.floor(gap / 60)}분 전`;
  if (gap < 86400) return `${Math.floor(gap / 3600)}시간 전`;

  return writeTime.format('YYYY.MM.DD');
}

// 알림 시간 포맷 설정
export function getElapsedNotificationTime(createdAt: string) {
  const now = dayjs().add(9, 'hour');
  const writeTime = dayjs(createdAt).add(9, 'hour');

  const gap = now.diff(writeTime, 's');
  if (gap < 60) return `${gap}초 전`;
  if (gap < 3600) return `${Math.floor(gap / 60)}분 전`;
  if (gap < 86400) return `${Math.floor(gap / 3600)}시간 전`;

  return `${Math.floor(gap / 86400)}일 전`;
}
