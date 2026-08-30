import type { InfiniteData } from "@tanstack/react-query";

import MessageBubble from "./MessageBubble";
import { useChatScroll } from "../hooks/useChatScroll";

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

  return (
    <main
      ref={messagesContainerRef}
      className="min-h-0 flex-1 overflow-y-auto p-6"
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
    </main>
  );
};
