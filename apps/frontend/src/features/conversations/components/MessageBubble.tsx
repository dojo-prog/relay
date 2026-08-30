import TooltipWrapper from "@/components/common/TooltipWrapper";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import type { MessageWithRelations } from "@relay/shared";

interface MessageBubbleProps {
  message: MessageWithRelations;
  currentUserId: string;
  isGroup?: boolean;
}

const MessageBubble = ({
  message,
  currentUserId,
  isGroup = false,
}: MessageBubbleProps) => {
  const isOwn = message.sender.id === currentUserId;
  const align = isOwn ? "end" : "start";
  const variant = isOwn ? undefined : "muted";

  const sentAt = new Date(message.created_at).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex items-end gap-2 ${
        isOwn ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {isGroup && !isOwn && (
        <TooltipWrapper content={message.sender.username}>
          <Avatar className="size-5 shrink-0">
            <AvatarFallback>
              <span className="text-[12px]">
                {message.sender.username[0].toUpperCase()}
              </span>
            </AvatarFallback>
          </Avatar>
        </TooltipWrapper>
      )}

      <Bubble align={align} variant={variant}>
        <BubbleContent>
          <p>{message.content}</p>
          <time className="mt-1 block text-xs opacity-60">{sentAt}</time>
        </BubbleContent>
      </Bubble>
    </div>
  );
};

export default MessageBubble;
