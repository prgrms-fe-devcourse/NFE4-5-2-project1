import { useState } from "react";
import { ExtendedUser } from "../../types/postType";
import { searchUsers } from "../../api/search";

type Props = {
  onSelect: (user: ExtendedUser) => void;
};
export default function UserSearchInput({ onSelect }: Props) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<ExtendedUser[]>([]);

  const searchInput = async () => {
    const res = await searchUsers(encodeURIComponent(keyword));
    setResults(res);
  };
  return (
    <>
      <input
        type="text"
        placeholder="유저 검색"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            searchInput();
          }
        }}
        className=" border p-3 border-gray-300 dark:border-gray-700 focus:ring-0 focus:outline-0"
      />

      <ul className="z-30 absolute w-50 h-auto bg-gray-100">
        {results.map((user) => {
          return (
            <li
              key={user._id}
              onClick={() => {
                setKeyword(user.username as string);
                setResults([]);
                onSelect(user);
              }}
              className="text-lg line-clamp-1 my-2 ml-3 cursor-pointer overflow-scroll"
            >
              {user.username}
            </li>
          );
        })}
      </ul>
    </>
  );
}
