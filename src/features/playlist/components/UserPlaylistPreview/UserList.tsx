import { parseUser } from "../../../../utils/userParser";
import UserListItem from "./UserListItem";
interface UserListProps {
  users: UserType[];
  isLoading: boolean;
  setSelectedUserId: (id: string) => void;
  inputValue: string;
}

export default function UserList({
  users,
  setSelectedUserId,
  inputValue,
}: UserListProps) {
  const parsedUsers = users.map((user) => parseUser(user));
  const filteredUsers = inputValue.trim()
    ? parsedUsers.filter((user) =>
        user.fullName.toLowerCase().includes(inputValue.toLowerCase())
      )
    : parsedUsers;

  if (filteredUsers.length === 0) {
    return (
      <div className="flex items-center mt-40 md:mt-0 justify-center h-[60%] text-gray-400">
        No results found.
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-auto scrollbar-hide w-full pb-4 ">
      {filteredUsers.map((parsedUser) => (
        <UserListItem
          key={parsedUser.id}
          id={parsedUser.id}
          fullName={parsedUser.fullName}
          isOnline={parsedUser.isOnline}
          favoriteArtist={parsedUser.favoriteArtist}
          setSelectedUserId={setSelectedUserId}
        />
      ))}
    </div>
  );
}
