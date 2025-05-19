import { ExtendedUser } from "../../types/postType";
import { useState } from "react";
import { MdSearch } from "react-icons/md";
import MessageContainer from "./MessageContainer";
import { useNavigate } from "react-router";
import { searchUsers } from "../../api/search";

export default function NewMessage() {
  const [allUsers, setAllUsers] = useState<ExtendedUser[]>([]);
  const [keyword, setKeyword] = useState("");
  const [selectedUser, setSeletedUser] = useState<ExtendedUser | null>(null);
  const navigate = useNavigate();

  if (selectedUser) {
    return <MessageContainer />;
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);

    if (!value.trim()) {
      setAllUsers([]);
      return;
    }

    try {
      const res = await searchUsers(encodeURIComponent(value.trim()));

      const keywordLower = value.trim().toLowerCase();
      const filtered = res.filter((user: ExtendedUser) =>
        (user.username ?? "").toLowerCase().includes(keywordLower)
      );
      setAllUsers(filtered);
    } catch (err) {
      console.error("유저 목록 불러오기 실패", err);
    }
  };

  return (
    <>
      <div className="w-full h-[700px] mb-[125px] mt-14 ">
        <div className="flex justify-center ">
          <div className="block">
            <p className="text-2xl mt-10">새 쪽지</p>
            <div className="w-[580px] relative">
              <button className="absolute right-4 top-2.5">
                <MdSearch className=" w-7 h-7 text-gray-400 dark:text-gray-300" />
              </button>

              <input
                type="text"
                placeholder="닉네임을 검색해주세요"
                className="block w-[580px] h-12 mt-6 border-1 border-gray-300 dark:border-gray-500 justify-center px-5 rounded-lg focus:outline-none focus:ring-0"
                value={keyword}
                onChange={handleChange}
              />
            </div>

            {allUsers.length > 0 && (
              <div className="absolute w-[580px] bg-white mt-2 border-1 border-gray-300 dark:border-gray-600 rounded-lg">
                <ul>
                  {allUsers.map((user) => (
                    <li
                      key={user._id}
                      className="my-3 pl-3 text-gray-800 cursor-pointer"
                      onClick={() => {
                        setKeyword(user.username as string);
                        setAllUsers([]);
                        setSeletedUser(user);
                        navigate(`/message/${user._id}`, {
                          state: { selectedUser: user },
                        });
                      }}
                    >
                      {user.username ? user.username : "익명의 유저"}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
