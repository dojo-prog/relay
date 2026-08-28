import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send } from "lucide-react";
import { useState } from "react";

const MessageInput = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const content = message.trim();

    if (!content) return;

    // TODO: send message
    console.log(content);

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
        disabled={!message.trim()}
        aria-label="Send message"
      >
        <Send className="size-5" />
      </Button>
    </form>
  );
};

export default MessageInput;
