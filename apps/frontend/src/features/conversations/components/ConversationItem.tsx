import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ConversationWithRelations } from "@relay/shared";

type ConversationItemProps = {
  conversation: ConversationWithRelations;
  isActive?: boolean;
};

const ConversationItem = ({
  conversation,
  isActive,
}: ConversationItemProps) => {
  // TODO fetch unread_count per convo
  const unreadCount = 2;

  const isGroup = conversation.type === "group";

  const conversationName = isGroup
    ? conversation.name
    : conversation.participant?.username;

  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 rounded-lg p-3 text-left",
        "hover:bg-accent",
        isActive && "bg-accent",
      )}
    >
      <Avatar className={"h-10 w-10"}>{/* ... */}</Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className="truncate font-medium">{conversationName}</span>
        </div>

        <div className="flex items-center">
          <p
            className={cn(
              "flex-1 truncate text-xs text-muted-foreground",
              unreadCount > 0 && "text-bold",
            )}
          >
            {conversation.last_message?.content}
          </p>
        </div>
      </div>

      {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
    </button>
  );
};

export default ConversationItem;
