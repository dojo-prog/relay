import type { InfiniteData } from "@tanstack/react-query";

import MessageBubble from "./MessageBubble";

import { useChatScroll } from "../hooks/useChatScroll";

import { useTypings } from "@/features/typing/hooks/useTypings";

type ChatMessagesProps = {
  messagesData: InfiniteData<any>;
  hasNextMessages: boolean;
  fetchNextMessages: () => Promise<unknown>;
  isFetchingNextMessages: boolean;
  currentUserId: string;
  conversationId: string;
  isGroup: boolean;
};

export const ChatMessages = ({
  messagesData,
  hasNextMessages,
  fetchNextMessages,
  isFetchingNextMessages,
  currentUserId,
  conversationId,
  isGroup,
}: ChatMessagesProps) => {
  const messages = [...messagesData.pages]
    .reverse()
    .flatMap((page) => page.data.messages);

  const { messagesContainerRef, observerRef, bottomRef } = useChatScroll({
    conversationId,
    messagesData,
    hasNextMessages,
    fetchNextMessages,
    isFetchingNextMessages,
  });

  const { data } = useTypings(conversationId);

  const typingUsers = data ?? [];

  const typingText =
    typingUsers.length === 1
      ? `${typingUsers[0]} is typing`
      : typingUsers.length === 2
        ? `${typingUsers[0]} and ${typingUsers[1]} are typing`
        : `${typingUsers[0]} and ${typingUsers.length - 1} others are typing`;

  return (
    <main
      ref={messagesContainerRef}
      className="relative min-h-0 flex-1 overflow-y-auto p-6"
    >
      <div className="flex flex-col gap-3">
        {messages.length > 0 && !hasNextMessages && (
          <div className="my-2 h-5 w-full text-center">
            <span className="text-xs text-primary">End of messages</span>
          </div>
        )}

        <div ref={observerRef} className="h-1" />

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            currentUserId={currentUserId}
            message={message}
            isGroup={isGroup}
          />
        ))}

        <div ref={bottomRef} />
      </div>

      {typingUsers.length > 0 && (
        <div className="pointer-events-none absolute bottom-3 left-6">
          <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-2 text-xs text-muted-foreground shadow-sm">
            <span>{typingText}</span>

            <span className="flex items-center gap-0.5">
              <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-current" />
            </span>
          </div>
        </div>
      )}
    </main>
  );
};
