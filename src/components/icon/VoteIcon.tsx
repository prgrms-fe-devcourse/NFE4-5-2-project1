import voteIcon from '../../assets/images/editor/vote-icon.svg';
import voteIconWhite from '../../assets/images/editor/vote-icon-white.svg';
import { Theme } from '../../types/darkModeTypes';
import { dark } from '../../utils/darkModeUtils';

export default function VoteIcon({ theme }: { theme: Theme }) {
  return (
    <>
      <img
        src={dark(theme) ? voteIconWhite : voteIcon}
        className='w-[28px] h-[28px] inline-block cursor-pointer'
      />
    </>
  );
}
