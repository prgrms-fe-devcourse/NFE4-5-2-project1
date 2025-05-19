import { Theme } from '../../types/darkModeTypes';
import { dark } from '../../utils/darkModeUtils';
import userDefaultImg from '../../assets/images/profile/default-profile-img.jpg';
import followImg from '../../assets/images/follow/follow.svg';
import followImgWhite from '../../assets/images/follow/follow-white.svg';

interface AvatarProps {
  name: string;
  email: string;
  image: string;
  isOnline?: boolean;
  theme: Theme;
  follow?: boolean;
}

export default function Avatar({
  name,
  email,
  image,
  isOnline,
  theme,
  follow,
}: AvatarProps) {
  return (
    <div className="avartar-box flex items-center gap-x-4 gap-y-1 p-4">
      <div className="relative shrink-0">
        <img
          src={image || userDefaultImg}
          alt="사용자"
          className="w-[50px] h-[50px] rounded-[50%] border border-[#ddd]"
        />
        {isOnline && (
          <span className="w-3 h-3 rounded-md bg-[#5FE3A4] absolute right-0 top-1"></span>
        )}
      </div>
      <div className="flex flex-col w-full pr-5 box-content">
        <div className="flex items-center">
          <span
            className={`text-sm font-semibold line-clamp-1 break-all ${
              dark(theme) ? 'text-[#ffffff]' : 'text-[#111111]'
            }`}
          >
            {name ? name : '탈퇴한 회원'}
          </span>
          {follow && (
            <img
              className="w-2 h-2 ml-1 -mb-[2px] opacity-50"
              src={dark(theme) ? followImgWhite : followImg}
            />
          )}
        </div>
        <span
          className={`text-xs opacity-60 break-all leading-[17px] line-clamp-2 ${
            dark(theme) ? 'text-[#ffffff]' : 'text-[#111111]'
          }`}
        >
          {email}
        </span>
      </div>
    </div>
  );
}
