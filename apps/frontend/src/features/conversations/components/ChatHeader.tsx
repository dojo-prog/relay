import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Info, Users2 } from "lucide-react";
import { usePresence } from "@/features/presence/hooks/usePresence";
import { cn } from "@/lib/utils";
import type { ConversationWithRelations } from "@relay/shared";

type ChatHeaderProps = {
  conversation: ConversationWithRelations;
};

export const ChatHeader = ({ conversation }: ChatHeaderProps) => {
  const { data: usersPresence } = usePresence();

  const isGroup = conversation.type === "group";

  const conversationName = isGroup
    ? conversation.name
    : conversation.participant?.username;

  const isOnline =
    !isGroup && conversation.participant && usersPresence
      ? usersPresence.includes(conversation.participant.id)
      : false;

  return (
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
  );
};
