import italicIcon from '../../assets/images/editor/italic-icon.svg';
import italicIconWhite from '../../assets/images/editor/italic-icon-white.svg';
import { Theme } from '../../types/darkModeTypes';
import { dark } from '../../utils/darkModeUtils';

export default function ItalicIcon({ theme }: { theme: Theme }) {
  return (
    <>
      <img
        src={dark(theme) ? italicIconWhite : italicIcon}
        className='w-[25px] h-[25px] inline-block cursor-pointer'
      />
    </>
  );
}
