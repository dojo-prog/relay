import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { UserPublic } from "@relay/shared";

interface UserSearchItemProps {
  user: UserPublic;
  handleSelect: (user: UserPublic) => void;
}

const UserSearchItem = ({ user, handleSelect }: UserSearchItemProps) => {
  return (
    <button
      key={user.id}
      type="button"
      onClick={() => handleSelect(user)}
      className="flex items-center gap-3 rounded-md p-2 text-left hover:bg-accent"
    >
      <Avatar className="size-9">
        <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
      </Avatar>

      <span>{user.username}</span>
    </button>
  );
};

export default UserSearchItem;
