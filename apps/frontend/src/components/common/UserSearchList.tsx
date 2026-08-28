import UserSearchItem from "./UserSearchItem";

interface UserSearchListProps {
  users: { id: string; username: string }[];
  handleSelect: (user: { id: string; username: string }) => void;
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
