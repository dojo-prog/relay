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
import { useEffect } from "react";
import { useMarkAsRead } from "../hooks/useMarkAsRead";
import { usePresence } from "@/features/presence/hooks/usePresence";
import { cn } from "@/lib/utils";

const ChatContainer = () => {
  const { user } = useAuthStore();
  const { conversationId } = useParams();

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

  // Now conditional returns are okay
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

  const messages = messagesData.pages.flatMap((page) => page.data.messages);

  const isGroup = conversation.type === "group";

  const conversationName = isGroup
    ? conversation.name
    : conversation.participant?.username;

  const isOnline =
    !isGroup && conversation.participant && usersPresence
      ? usersPresence.includes(conversation.participant.id)
      : false;

  console.log(isOnline);
  return (
    <Card className="flex h-full w-full flex-col gap-0 overflow-hidden p-0">
      {/* Header */}
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
                "text-sm ",
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

      {/* Messages */}
      <main className="min-h-0 flex-1 overflow-y-auto p-6">
        <div className="flex flex-col gap-3">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              currentUserId={user!.id}
              message={message}
            />
          ))}
        </div>
      </main>

      {/* Input */}
      <footer className="shrink-0 border-t p-4">
        <MessageInput conversationId={conversationId} />
      </footer>
    </Card>
  );
};

export default ChatContainer;
