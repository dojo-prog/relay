import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Info, Users2 } from "lucide-react";
import MessageInput from "./MessageInput";
import { useParams } from "react-router-dom";
import { useConversation } from "../hooks/useConversation";
import { useMessages } from "@/features/messages/hooks/useMessages";
import ChatEmptyState from "./ChatEmptyState";
import MessageBubble from "./MessageBubble";
import useAuthStore from "@/stores/auth.store";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useMarkAsRead } from "../hooks/useMarkAsRead";
import { usePresence } from "@/features/presence/hooks/usePresence";
import { cn } from "@/lib/utils";

const ChatContainer = () => {
  const { user } = useAuthStore();
  const { conversationId } = useParams();

  const observerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLElement>(null);

  const initialScrollConversationRef = useRef<string | null>(null);
  const previousScrollHeightRef = useRef<number | null>(null);
  const previousScrollTopRef = useRef<number | null>(null);

  const { mutateAsync: markAsRead } = useMarkAsRead();

  const {
    data: conversationData,
    isPending: isConversationPending,
    isError: isConversationError,
  } = useConversation(conversationId);

  const {
    data: messagesData,
    isPending: isMessagesPending,
    isError: isMessagesError,
    hasNextPage: hasNextMessages,
    fetchNextPage: fetchNextMessages,
    isFetchingNextPage: isFetchingNextMessages,
  } = useMessages(conversationId);

  const { data: usersPresence } = usePresence();

  useEffect(() => {
    if (!conversationId) return;
    if (isConversationPending || isMessagesPending) return;
    if (isConversationError || isMessagesError) return;

    markAsRead(conversationId);
  }, [
    conversationId,
    isConversationPending,
    isMessagesPending,
    isConversationError,
    isMessagesError,
    markAsRead,
  ]);

  useEffect(() => {
    const element = observerRef.current;
    const container = messagesContainerRef.current;

    if (!element || !container || !hasNextMessages) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (!entries[0].isIntersecting || isFetchingNextMessages) return;

        previousScrollHeightRef.current = container.scrollHeight;
        previousScrollTopRef.current = container.scrollTop;

        await fetchNextMessages();
      },
      {
        threshold: 0.1,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [fetchNextMessages, hasNextMessages, isFetchingNextMessages]);

  useLayoutEffect(() => {
    const container = messagesContainerRef.current;

    const previousScrollHeight = previousScrollHeightRef.current;
    const previousScrollTop = previousScrollTopRef.current;

    if (
      !container ||
      previousScrollHeight === null ||
      previousScrollTop === null
    ) {
      return;
    }

    const heightDifference = container.scrollHeight - previousScrollHeight;

    container.scrollTop = previousScrollTop + heightDifference;

    previousScrollHeightRef.current = null;
    previousScrollTopRef.current = null;
  }, [messagesData]);

  useLayoutEffect(() => {
    if (!conversationId || !messagesData) return;

    if (initialScrollConversationRef.current === conversationId) {
      return;
    }

    initialScrollConversationRef.current = conversationId;

    bottomRef.current?.scrollIntoView({
      behavior: "instant",
    });
  }, [conversationId, messagesData]);

  if (!conversationId) {
    return <ChatEmptyState />;
  }

  if (isConversationPending || isMessagesPending) {
    return (
      <Card className="flex h-full w-full items-center justify-center">
        Loading...
      </Card>
    );
  }

  if (isConversationError || isMessagesError) {
    return (
      <Card className="flex h-full w-full items-center justify-center">
        Failed to load conversation.
      </Card>
    );
  }

  const conversation = conversationData.data.conversation;

  const messages = [...messagesData.pages]
    .reverse()
    .flatMap((page) => page.data.messages);

  const isGroup = conversation.type === "group";

  const conversationName = isGroup
    ? conversation.name
    : conversation.participant?.username;

  const isOnline =
    !isGroup && conversation.participant && usersPresence
      ? usersPresence.includes(conversation.participant.id)
      : false;

  return (
    <Card className="flex h-full w-full flex-col gap-0 overflow-hidden p-0">
      <header className="flex h-20 shrink-0 items-center justify-between border-b px-8">
        <div className="flex items-center gap-x-3">
          <Avatar className="size-14">
            <AvatarFallback>
              {isGroup ? (
                <Users2 className="size-6" />
              ) : (
                conversation.participant?.username?.[0]?.toUpperCase()
              )}
            </AvatarFallback>
          </Avatar>

          <div>
            <h2 className="text-lg font-bold">{conversationName}</h2>

            <span
              className={cn(
                "text-sm",
                isGroup && "hidden",
                isOnline ? "text-green-500" : "text-secondary",
              )}
            >
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="size-10"
          aria-label="Conversation information"
        >
          <Info className="size-6" />
        </Button>
      </header>

      <main
        ref={messagesContainerRef}
        className="min-h-0 flex-1 overflow-y-auto p-6"
      >
        <div className="flex flex-col gap-3">
          {messages.length > 0 && !hasNextMessages && (
            <div className="my-2 h-5 w-full text-center">
              <span className="text-xs text-primary">End of result</span>
            </div>
          )}

          <div ref={observerRef} className="h-1" />

          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              currentUserId={user!.id}
              message={message}
            />
          ))}

          <div ref={bottomRef} />
        </div>
      </main>

      <footer className="shrink-0 border-t p-4">
        <MessageInput conversationId={conversationId} />
      </footer>
    </Card>
  );
};

export default ChatContainer;
