import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Info, Users2 } from "lucide-react";
import MessageInput from "./MessageInput";
import { useParams } from "react-router-dom";
import { useConversation } from "../hooks/useConversation";
import { useMessages } from "@/features/messages/hooks/useMessages";
import ChatEmptyState from "./ChatEmptyState";

const ChatContainer = () => {
  const { conversationId } = useParams();

  console.log(conversationId);

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

  if (!conversationId) return <ChatEmptyState />;

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

            <span className="text-sm text-green-500">Online</span>
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
            <div key={message.id}>{message.content}</div>
          ))}
        </div>
      </main>

      {/* Input */}
      <footer className="shrink-0 border-t p-4">
        <MessageInput />
      </footer>
    </Card>
  );
};

export default ChatContainer;
