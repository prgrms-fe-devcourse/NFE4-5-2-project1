import Banner from '../components/main-content/Banner';
import PopularPost from '../components/main-content/PopularPost';
import './../css/main-content/main-content.css';
import { Theme } from '../types/darkModeTypes';

export default function MainContent({ theme }: { theme: Theme }) {
  return (
    <div className='w-full h-full overflow-y-auto scroll-custom pb-[30px]'>
      <Banner />
      <PopularPost theme={theme} />
    </div>
  );
}
