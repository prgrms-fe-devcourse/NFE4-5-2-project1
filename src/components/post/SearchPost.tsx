import { Search } from 'lucide-react';
import { useState } from 'react';
import { Theme } from '../../types/darkModeTypes';
import { dark } from '../../utils/darkModeUtils';

export default function SearchPost({ theme }: { theme: Theme }) {
  const [input, setInput] = useState('');
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  console.log(theme);

  return (
    <>
      <div
        className={`w-[205px] h-[31px] flex items-center rounded-[5px] px-2.5 py-2 transition-colors duration-300
        ${dark(theme) ? 'bg-[#2d2d2d]' : 'bg-white'}`}
      >
        <input
          type="text"
          value={input}
          onChange={changeHandler}
          placeholder="검색"
          className={`flex-grow text-[11px] outline-none bg-transparent transition-colors duration-300
          ${
            dark(theme)
              ? 'text-white placeholder-[#bbbbbb]'
              : 'text-[#111111] placeholder-[#989898]'
          }`}
        />
        <Search
          className={`w-[19.94px] h-[19.94px] transition-colors duration-300
          ${dark(theme) ? 'text-[#dddddd]' : 'text-[#86879C]'}`}
        />
      </div>
    </>
  );
}
