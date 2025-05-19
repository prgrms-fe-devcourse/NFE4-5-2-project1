import boldIcon from '../../assets/images/editor/bold-icon.svg';
import boldIconWhite from '../../assets/images/editor/bold-icon-white.svg';
import { Theme } from '../../types/darkModeTypes';

export default function BoldIcon({ theme }: { theme: Theme }) {
  return (
    <img
      src={`${theme.name === 'Dark' ? boldIconWhite : boldIcon}`}
      className='w-[27px] h-[27px] inline-block cursor-pointer p-1'
    />
  );
}
