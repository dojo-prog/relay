import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { usePresence } from "@/features/presence/hooks/usePresence";
import { cn } from "@/lib/utils";
import type { ConversationWithRelations } from "@relay/shared";
import { Users2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

type ConversationItemProps = {
  conversation: ConversationWithRelations;
  isActive?: boolean;
};

const ConversationItem = ({
  conversation,
  isActive,
}: ConversationItemProps) => {
  const navigate = useNavigate();

  const { data: onlineUsers } = usePresence();

  const unreadCount = conversation.unread_count;
  const isGroup = conversation.type === "group";
  const isOnline = conversation.participant
    ? onlineUsers?.includes(conversation.participant.id)
    : false;

  const conversationName = isGroup
    ? conversation.name
    : conversation.participant?.username;

  const handleClick = () => {
    navigate(`/conversations/${conversation.id}`);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg p-3 text-left",
        "hover:bg-accent",
        isActive && "bg-accent",
      )}
    >
      <div className="relative">
        <Avatar className={"size-10"}>
          <AvatarFallback>
            {conversation.type === "direct" ? (
              conversation.participant?.username[0].toUpperCase()
            ) : (
              <Users2 className="size-5" />
            )}
          </AvatarFallback>
        </Avatar>

        {isOnline && (
          <div className="absolute top-1 -right-0.5 size-2.5 bg-green-500 rounded-full" />
        )}
      </div>

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
