import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { UserPublic } from "@relay/shared";
import { XIcon } from "lucide-react";

interface SelectedUserProps {
  user: UserPublic;
  handleRemove: (userId: string) => void;
}

const SelectedUser = ({ user, handleRemove }: SelectedUserProps) => {
  return (
    <div className="flex items-center justify-between rounded-md p-2 text-left bg-accent/50">
      <div className="flex items-center gap-3">
        <Avatar className="size-9">
          <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>

        <span>{user.username}</span>
      </div>

      <Button variant={"ghost"} onClick={() => handleRemove(user.id)}>
        <XIcon />
      </Button>
    </div>
  );
};

export default SelectedUser;
