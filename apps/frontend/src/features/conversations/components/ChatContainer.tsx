import { Card } from "@/components/ui/card";
import MessageInput from "./MessageInput";
import { useParams } from "react-router-dom";
import { useConversation } from "../hooks/useConversation";
import { useMessages } from "@/features/messages/hooks/useMessages";
import ChatEmptyState from "./ChatEmptyState";
import useAuthStore from "@/stores/auth.store";
import { useEffect } from "react";
import { useMarkAsRead } from "../hooks/useMarkAsRead";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";

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
    hasNextPage: hasNextMessages,
    fetchNextPage: fetchNextMessages,
    isFetchingNextPage: isFetchingNextMessages,
  } = useMessages(conversationId);

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

  return (
    <Card className="flex h-full w-full flex-col gap-0 overflow-hidden p-0">
      <ChatHeader conversation={conversation} />

      <ChatMessages
        messagesData={messagesData}
        hasNextMessages={hasNextMessages}
        fetchNextMessages={fetchNextMessages}
        isFetchingNextMessages={isFetchingNextMessages}
        currentUserId={user!.id}
        conversationId={conversationId}
      />

      <footer className="shrink-0 border-t p-4">
        <MessageInput conversationId={conversationId} />
      </footer>
    </Card>
  );
};

export default ChatContainer;
