import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserSearchItemProps {
  user: { id: string; username: string };
  handleSelect: (user: { id: string; username: string }) => void;
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
