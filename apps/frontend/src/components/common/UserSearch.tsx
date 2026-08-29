import { useEffect, useRef, type ChangeEvent } from "react";

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
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUsers(value);

  const shouldShowResults = value.trim().length >= 2;

  const users = data?.pages.flatMap((page) => page.data.users) ?? [];

  useEffect(() => {
    const element = loadMoreRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.5,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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
            <div className="max-h-64 overflow-y-auto rounded-md border bg-background">
              <UserSearchList users={users} handleSelect={handleSelect} />

              {/* IntersectionObserver watches this */}
              <div ref={loadMoreRef} className="h-1" />

              {isFetchingNextPage && (
                <div className="p-2 text-center text-sm text-muted-foreground">
                  Loading more...
                </div>
              )}

              {!hasNextPage && (
                <div className="p-2 text-center text-sm text-muted-foreground">
                  End of result...
                </div>
              )}
            </div>
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
