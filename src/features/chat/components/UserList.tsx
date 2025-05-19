import useSearchUsers from "../hooks/useSearchUsers";
import SearchUser from "./SearchUser";

export default function UserList({
  keyword,
  clear,
}: {
  keyword: string;
  clear?: () => void;
}) {
  const { userList } = useSearchUsers(keyword);

  return (
    <>
      {userList.length === 0 ? (
        <div className="text-lg font-medium self-center">No Results</div>
      ) : (
        userList.map((user) => (
          <SearchUser
            key={user._id}
            userId={user._id}
            name={user.fullName.name}
            isOnline={user.isOnline}
            image={user.image}
            clear={clear}
          />
        ))
      )}
    </>
  );
}
