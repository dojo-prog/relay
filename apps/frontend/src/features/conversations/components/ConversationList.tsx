import ConversationItem from "./ConversationItem";
import { useConversations } from "../hooks/useConversations";
import type { ConversationType } from "@relay/shared";
import { useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import ConversationListSkeleton from "./ConversationListSkeletion";
import ConversationSkeletion from "./ConversationSkeletion";
import CreateConversationButton from "./CreateConversationButton";
import { MessageCircle } from "lucide-react";

interface ConversationListProps {
  search: string;
  type?: ConversationType;
  unread?: boolean;
}

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

const ConversationEmptyState = ({
  title,
  description,
  action,
}: EmptyStateProps) => {
  return (
    <div className="flex h-full items-center justify-center px-6">
      <div className="flex max-w-xs flex-col items-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <MessageCircle className="size-7 text-primary" />
        </div>

        <h2 className="text-lg font-semibold">{title}</h2>

        <p className="mt-1 text-sm text-muted-foreground">{description}</p>

        {action && <div className="mt-5">{action}</div>}
      </div>
    </div>
  );
};

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
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isPending) {
    return <ConversationListSkeleton />;
  }

  const conversations =
    data?.pages.flatMap((page) => page.data.conversations) ?? [];

  if (conversations.length === 0) {
    if (unread) {
      return (
        <ConversationEmptyState
          title="No unread conversations"
          description="You are all caught up!"
        />
      );
    }

    return (
      <ConversationEmptyState
        title="No conversations yet"
        description="Start a conversation with someone to see your chats here."
        action={<CreateConversationButton />}
      />
    );
  }

  return (
    <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
      {conversations.map((conversation) => (
        <ConversationItem key={conversation.id} conversation={conversation} />
      ))}

      <div ref={observerRef} className="h-1" />

      {isFetchingNextPage && <ConversationSkeletion />}

      {!hasNextPage && (
        <div className="my-2 h-5 w-full text-center">
          <span className="text-xs text-primary">End of results</span>
        </div>
      )}
    </div>
  );
};

export default ConversationList;
