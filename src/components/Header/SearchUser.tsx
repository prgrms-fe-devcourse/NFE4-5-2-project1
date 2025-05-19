import { FaUser } from "react-icons/fa";
import { Link } from "react-router";
import { ExtendedUser } from "../../types/postType";
import { userStore } from "../../stores/userStore";
export default function SearchUser({
  keyword,
  results,
  onClose,
}: {
  keyword: string;
  results: ExtendedUser[];
  onClose: () => void;
}) {
  const user = userStore.getState().getUser();
  const isLoggedin = !!user && !!user._id;
  const filterUsers = results.filter((user: ExtendedUser) => {
    const trimkeyword = keyword?.trim().toLowerCase();

    const username = (user.username ?? "").trim().toLowerCase() || "";

    return username.includes(trimkeyword) && user.role !== "SuperAdmin";
  });

  return (
    <>
      <div className="dark:text-white block p-1 max-h-[400px] overflow-y-auto">
        {keyword ? (
          filterUsers.length > 0 ? (
            filterUsers.map((user) => {
              console.log(user._id);
              return (
                <div key={user._id} className="user-card flex my-3 mx-6" onClick={() => {}}>
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.username}
                      className="w-10 h-10 mr-3 rounded-3xl border-1"
                    />
                  ) : (
                    <div className="w-10 h-10 mr-3 bg-gray-200 dark:white rounded-2xl ">
                      <FaUser className="w-6 h-6 ml-2 items-center justify-center mt-2 dark:text-gray-700 text-[#2F6BEB] " />
                    </div>
                  )}

                  <Link
                    to={isLoggedin ? `/profile/${user._id}/posts` : "/login"}
                    onClick={onClose}
                    className="mt-2 text-md cursor-pointer whitespace-nowrap dark:text-white"
                  >
                    {user.username ? user.username : "익명의 유저"}
                  </Link>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-400 dark:text-gray-500 mt-20 pb-20">
              일치하는 계정이 없습니다.
            </div>
          )
        ) : null}
      </div>
    </>
  );
}
