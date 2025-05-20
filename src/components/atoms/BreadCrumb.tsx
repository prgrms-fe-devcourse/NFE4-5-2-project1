import { Link, useLocation } from 'react-router-dom';

interface BreadCrumbProps {
  communityTitle: string;
}

export default function BreadCrumb({ communityTitle }: BreadCrumbProps) {
  const { pathname } = useLocation();
  return (
    <>
      <div className="dark:text-dark-text">
        <span className="nanum-gothic-regular">
          <Link to="/">홈 {'>'}</Link>
        </span>
        <span className="nanum-gothic-regular">
          <Link to="/community">커뮤니티 {'>'}</Link>
        </span>
        {/* 
      communityTitle은 해당 페이지 props 로 받기
       pathname는 Route에서  받기 
      Route path='/community/velog' element={<CommunityVelogPage/>}
      */}
        <span className="nanum-gothic-regular">
          <Link to={pathname}>{communityTitle}</Link>
        </span>
      </div>
    </>
  );
}
