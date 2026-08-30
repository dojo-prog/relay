import ConversationItem from "./ConversationItem";
import { useConversations } from "../hooks/useConversations";
import type { ConversationType } from "@relay/shared";
import { useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import ConversationListSkeleton from "./ConversationListSkeletion";
import ConversationSkeletion from "./ConversationSkeletion";

interface ConversationListProps {
  search: string;
  type?: ConversationType;
  unread?: boolean;
}

const ConversationList = ({ search, type, unread }: ConversationListProps) => {
  const observerRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(search, 500);

  const { data, isPending, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useConversations({
      search: debouncedSearch,
      type,
      unread,
    });

  useEffect(() => {
    const element = observerRef.current;

    if (!element || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isPending) {
    return <ConversationListSkeleton />;
  }

  const conversations =
    data?.pages.flatMap((page) => page.data.conversations) ?? [];

  return (
    <div
      className="h-full overflow-y-auto"
      style={{
        scrollbarWidth: "thin",
      }}
    >
      {conversations.map((c) => (
        <ConversationItem key={c.id} conversation={c} />
      ))}

      <div ref={observerRef} className="h-1" />

      {isPending && <ConversationSkeletion />}

      {conversations.length > 0 && !hasNextPage && (
        <div className="w-full text-center h-5 my-2">
          <span className="text-xs text-primary">End of result</span>
        </div>
      )}
    </div>
  );
};

export default ConversationList;
