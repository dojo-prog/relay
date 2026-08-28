import type { UserPublic } from "@relay/shared";
import UserSearchItem from "./UserSearchItem";

interface UserSearchListProps {
  users: UserPublic[];
  handleSelect: (user: UserPublic) => void;
}

const UserSearchList = ({ users, handleSelect }: UserSearchListProps) => {
  return (
    <div className="w-full rounded-md bg-secondary">
      <div className="flex flex-col gap-1">
        {users.map((user) => (
          <UserSearchItem user={user} handleSelect={handleSelect} />
        ))}
      </div>
    </div>
  );
};

export default UserSearchList;
