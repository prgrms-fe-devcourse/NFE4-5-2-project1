//  user name, imgUrl, tag-기술스택, 한줄 소개, 소셜정보, 팔로우, 팔로워 정보, 팔로우 버튼
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import Tag from '../atoms/Tag';
import UserAvatar from '../atoms/UserAvatar';
import UserName from '../atoms/UserName';

interface UserProps {
  name: string;
  followCount?: number;
  followerCount?: number;
  imgUrl?: string;
  techStack?: string[];
  introduction?: string;
  email?: string;
  github?: string;
  velog?: string;
  homepage?: string;
  isMe?: boolean;
  isFollowing?: boolean;
  isLogin?: boolean;
  followHandler?: () => void;
}

export default function User({
  name = '',
  followCount = 0,
  followerCount = 0,
  imgUrl = '',
  techStack = [],
  introduction = '',
  email = '',
  github = '',
  velog = '',
  homepage = '',
  isMe = false,
  isFollowing = false,
  isLogin = false,
  followHandler,
}: UserProps) {
  const ensureProtocol = (url: string) =>
    url.match(/^https?:\/\//i) ? url : `https://${url}`;

  return (
    <>
      <div className="dark:border-dark-border dark:text-dark-text flex min-h-[184px] w-[1128px] items-center justify-between border-b-[1px] border-b-[#ababab] px-[30px] py-[10px]">
        <div className="flex items-center justify-center">
          <UserAvatar size={150} imageUrl={imgUrl} />
          <div className="ml-8 flex flex-col gap-1">
            <UserName
              name={name}
              className="nanum-gothic-bold pl-[1px] text-[28px]"
            />
            {/* tags 배열로 정보 받아와서 맵핑 */}
            {techStack.length === 0 ? (
              <span className="pl-[1px] text-[#d9d9d9]">
                기술 스택을 입력하지 않았습니다.
              </span>
            ) : (
              <ul className="flex w-[580px] flex-wrap gap-1 leading-none">
                {techStack.map(
                  (t) =>
                    // Tag value 값이 없을 경우 렌더링 하지 않음
                    t.trim() !== '' && (
                      <li key={t.trim().toUpperCase()}>
                        <Tag>{t.trim().toUpperCase()}</Tag>
                      </li>
                    ),
                )}
              </ul>
            )}

            <p className="min-h-[24px] pl-[1px] text-[16px]">
              {introduction !== '' ? (
                introduction
              ) : (
                <span className="text-[#d9d9d9]">자기소개가 없습니다.</span>
              )}
            </p>
            <div className="flex items-center justify-start gap-3">
              <span className="flex justify-center gap-1 leading-5 tracking-wide text-[#767676]">
                <Icon name="mailStrokeIcon" />
                {email}
              </span>
              {/* github, velog 주소값 여부에 따라 아이콘 렌더링 */}
              {github !== '' && (
                <span className="dark:contrast-50 dark:invert">
                  <a
                    href={ensureProtocol(github)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name="githubIcon" size={18} />
                  </a>
                </span>
              )}
              {velog !== '' && (
                <span className="dark:contrast-50 dark:invert">
                  <a
                    href={ensureProtocol(velog)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name="velogIcon" size={18} />
                  </a>
                </span>
              )}
              {homepage !== '' && (
                <span className="dark:contrast-50 dark:invert">
                  <a
                    href={ensureProtocol(homepage)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name="homepageIcon" size={18} />
                  </a>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 팔로우 기능 */}
        <div className="nanum-gothic-regular mb-1 flex flex-col items-end gap-1 self-end text-[12px]">
          {isLogin && !isMe && (
            <Button
              full={!isFollowing}
              size="s"
              onClick={() => followHandler?.()}
            >
              {isFollowing ? '언팔로우' : '팔로우'}
            </Button>
          )}

          {/* <Button full size="s" onClick={() => followHandler?.()}>
            팔로우
          </Button> */}
          <div className="flex gap-4">
            <span>팔로우 {followCount}</span>
            <span>팔로워 {followerCount}</span>
          </div>
        </div>
      </div>
    </>
  );
}
