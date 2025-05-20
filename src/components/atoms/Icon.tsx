import HeartIcon from '../../assets/images/heart_icon.svg';
import HeartFillIcon from '../../assets/images/heart_fill_icon.svg';
import CommentIcon from '../../assets/images/comment_icon.svg';
import AddIcon from '../../assets/images/add_icon.svg';
import ArrowRightIcon from '../../assets/images/arrow_right_icon.svg';
import ArrowLeftIcon from '../../assets/images/arrow_left_icon.svg';
import alarmIcon from '../../assets/images/alarmIcon.svg';
import chatIcon from '../../assets/images/chatIcon.svg';
import darkModeIcon from '../../assets/images/solar_moon-line-duotone.svg';
import menuIcon from '../../assets/images/line-md_menu.svg';
import mailStrokeIcon from '../../assets/images/mailStroke.svg';

import mailIcon from '../../assets/images/mailIcon.png';
import githubIcon from '../../assets/images/githubIcon.png';
import velogIcon from '../../assets/images/velogIcon.png';
import homepageIcon from '../../assets/images/homepageIcon.png';
import completeIcon from '../../assets/images/completeIcon.png';
import completeNotIcon from '../../assets/images/completeNotIcon.png';

export default function Icon({
  name,
  onClick,
  size = 24, // 기본 24
  color = 'black',
}: {
  name: string;
  onClick?: () => void;
  size?: number;
  color?: 'black' | 'white' | 'red' | 'gray';
}) {
  const src =
    name === 'mailStrokeIcon'
      ? mailStrokeIcon
      : name === 'leftIcon'
        ? ArrowLeftIcon
        : name === 'rightIcon'
          ? ArrowRightIcon
          : name === 'plusIcon'
            ? AddIcon
            : name === 'alarmIcon'
              ? alarmIcon
              : name === 'chatIcon'
                ? chatIcon
                : name === 'mailIcon'
                  ? mailIcon
                  : name === 'githubIcon'
                    ? githubIcon
                    : name === 'velogIcon'
                      ? velogIcon
                      : name === 'homepageIcon'
                        ? homepageIcon
                        : name === 'completeIcon'
                          ? completeIcon
                          : name === 'completeNotIcon'
                            ? completeNotIcon
                            : name === 'commentIcon'
                              ? CommentIcon
                              : name === 'likeIcon'
                                ? HeartFillIcon
                                : name === 'darkModeIcon'
                                  ? darkModeIcon
                                  : name === 'menuIcon'
                                    ? menuIcon
                                    : HeartIcon;

  return (
    <>
      <div onClick={onClick}>
        <img
          src={src}
          alt={name}
          style={{
            width: size,
            height: size,
            filter:
              color === 'red'
                ? 'invert(19%) sepia(97%) saturate(3200%) hue-rotate(-1deg) brightness(96%)'
                : color === 'white'
                  ? 'invert(1)'
                  : color === 'gray'
                    ? 'invert(1) brightness(0.9) contrast(100%)'
                    : '',
          }}
        />
      </div>
    </>
  );
}
