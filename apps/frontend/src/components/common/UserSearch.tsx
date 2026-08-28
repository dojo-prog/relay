import { type ChangeEvent } from "react";
import SearchInput from "./SearchInput";
import UserSearchList from "./UserSearchList";
import { useUsers } from "@/features/users/hooks/useUsers";
import type { UserPublic } from "@relay/shared";

interface UserSearchProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSelect: (user: UserPublic) => void;
}

const UserSearch = ({ value, onChange, handleSelect }: UserSearchProps) => {
  const { data, isPending, isError } = useUsers({
    page: 1,
    limit: 20,
    search: value,
  });

  const shouldShowResults = value.trim().length >= 2;

  const users = data?.data?.users ?? [];

  return (
    <div className="relative h-max">
      <SearchInput
        placeholder="Search username..."
        value={value}
        onChange={onChange}
      />

      {shouldShowResults && (
        <div className="absolute top-full z-10 mt-2 w-full">
          {isPending && (
            <div className="rounded-md border bg-background p-3 text-sm">
              Searching...
            </div>
          )}

          {isError && (
            <div className="rounded-md border bg-background p-3 text-sm text-destructive">
              Failed to search users.
            </div>
          )}

          {!isPending && !isError && users.length > 0 && (
            <UserSearchList users={users} handleSelect={handleSelect} />
          )}

          {!isPending && !isError && users.length === 0 && (
            <div className="rounded-md border bg-background p-3 text-sm text-muted-foreground">
              No users found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserSearch;
