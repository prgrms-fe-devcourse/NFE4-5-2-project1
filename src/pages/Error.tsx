import Button from '../components/common/Button';
import error from '../assets/images/error/404.svg';
import errorDark from '../assets/images/error/404-dark.svg';
import { useNavigate } from 'react-router-dom';
import { Theme } from '../types/darkModeTypes';
import { dark } from '../utils/darkModeUtils';

export default function Error({ theme }: { theme: Theme }) {
  const navigate = useNavigate();
  return (
    <>
      <div className="w-full min-h-dvh flex justify-center items-center flex-col">
        <img className="h-[500px]" src={dark(theme) ? errorDark : error}></img>
        <Button
          className={`button-style1 mt-10 ${
            dark(theme)
              ? 'w-[500px] h-[86px] text-[#ffffff] bg-[#2d2d2d] text-[23px] rounded-[10px] cursor-pointer'
              : ''
          }`}
          value="Go back home"
          onClick={() => navigate('/')}
        ></Button>
      </div>
    </>
  );
}
