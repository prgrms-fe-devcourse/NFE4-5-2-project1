// components/atoms/SearchBar.tsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import searchIcon from '../../assets/images/searchIcon.png';

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
}

export default function SearchBar({ placeholder }: { placeholder?: string }) {
  const width = useWindowWidth();
  placeholder = width < 640 ? '' : '검색어를 입력해주세요';
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    let path = '';

    if (location.pathname.includes('/community')) {
      path = `/search/${input}/community`;
    } else if (location.pathname.includes('/question')) {
      path = `/search/${input}/question`;
    } else if (location.pathname.includes('/users')) {
      path = `/search/${input}/user`;
    } else {
      path = `/search/${input}`;
    }

    navigate(path);
    console.log(location.pathname);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="dark:border-dark-border relative max-w-[350px] border-b border-[#ababab]"
    >
      <input
        type="text"
        placeholder={placeholder}
        className="dark:text-dark-text dark:placeholder-dark-border w-full py-2 pl-2 text-[12px] placeholder-[#ababab] focus:outline-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit">
        <img
          src={searchIcon}
          alt="검색 아이콘"
          className="absolute top-1/2 right-0 mr-2 h-5 w-5 -translate-y-1/2"
        />
      </button>
    </form>
  );
}
