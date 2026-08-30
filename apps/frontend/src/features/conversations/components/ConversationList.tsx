import ConversationItem from "./ConversationItem";
import { useConversations } from "../hooks/useConversations";
import type { ConversationType } from "@relay/shared";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface ConversationListProps {
  search: string;
  type?: ConversationType;
  unread?: boolean;
}

const ConversationList = ({ search, type, unread }: ConversationListProps) => {
  const observerRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isPending,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useConversations({
    search,
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

      {isFetchingNextPage && (
        <div className="w-full flex items-center justify-center h-5 my-2">
          <Loader2 className="size-5 animate-spin" />
        </div>
      )}

      {conversations.length > 0 && !hasNextPage && (
        <div className="w-full text-center h-5 my-2">
          <span className="text-xs text-primary">End of result</span>
        </div>
      )}
    </div>
  );
};

export default ConversationList;
