import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSendMessage } from "@/features/messages/hooks/useSendMessage";
import { useTypingStart } from "@/features/typing/hooks/useTypingStart";
import { useTypingStop } from "@/features/typing/hooks/useTypingStop";
import { Loader2, Paperclip, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface MessageInputProps {
  conversationId: string;
}

const MessageInput = ({ conversationId }: MessageInputProps) => {
  const [message, setMessage] = useState("");

  const { mutateAsync, isPending } = useSendMessage();

  const { mutate: typingStart } = useTypingStart();
  const { mutate: typingStop } = useTypingStop();

  useEffect(() => {
    if (message === "") {
      typingStop(conversationId);
    } else {
      typingStart(conversationId);
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const content = message.trim();

    if (!content) return;

    try {
      await mutateAsync({ content: message, conversationId });
    } catch (error) {
      toast.error("Failed to send message");
      console.error(error);
    }

    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      {/* Attachment */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0"
        aria-label="Attach file"
      >
        <Paperclip className="size-5" />
      </Button>

      {/* Message */}
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write a message..."
        rows={1}
        className="min-h-10 resize-none"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            e.currentTarget.form?.requestSubmit();
          }
        }}
      />

      {/* Send */}
      <Button
        type="submit"
        size="icon"
        className="shrink-0"
        disabled={!message.trim() || isPending}
        aria-label="Send message"
      >
        {!isPending ? (
          <Send className="size-5" />
        ) : (
          <Loader2 className="size-5 animate-spin" />
        )}
      </Button>
    </form>
  );
};

export default MessageInput;
