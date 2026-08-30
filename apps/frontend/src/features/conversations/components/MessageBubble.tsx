import { Bubble, BubbleContent } from "@/components/ui/bubble";
import type { MessageWithRelations } from "@relay/shared";

interface MessageBubbleProps {
  message: MessageWithRelations;
  currentUserId: string;
}

const MessageBubble = ({ message, currentUserId }: MessageBubbleProps) => {
  const isOwn = message.sender.id === currentUserId;

  const align = isOwn ? "end" : "start";
  const variant = isOwn ? undefined : "muted";

  const sentAt = new Date(message.created_at).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Bubble align={align} variant={variant}>
      <BubbleContent>
        <p>{message.content}</p>

        <time className="mt-1 block text-xs opacity-60">{sentAt}</time>
      </BubbleContent>
    </Bubble>
  );
};

export default MessageBubble;
