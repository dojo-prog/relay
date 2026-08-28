import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import MessageInput from "./MessageInput";

const dummyMessages = [
  {
    id: "1",
    sender: "jordan",
    content: "Hey! How's it going?",
    createdAt: "10:28 AM",
    isOwn: false,
  },
  {
    id: "2",
    sender: "me",
    content: "Hey! I'm doing great. How about you?",
    createdAt: "10:29 AM",
    isOwn: true,
  },
  {
    id: "3",
    sender: "jordan",
    content: "I'm good too!",
    createdAt: "10:30 AM",
    isOwn: false,
  },
  {
    id: "4",
    sender: "jordan",
    content: "Are we still meeting later?",
    createdAt: "10:30 AM",
    isOwn: false,
  },
  {
    id: "5",
    sender: "me",
    content: "Yeah, definitely. I'll be there around 6.",
    createdAt: "10:31 AM",
    isOwn: true,
  },
  {
    id: "6",
    sender: "jordan",
    content: "Perfect 👍",
    createdAt: "10:32 AM",
    isOwn: false,
  },
];

const ChatContainer = () => {
  return (
    <Card className="flex h-full w-full flex-col gap-0 overflow-hidden p-0">
      {/* Header */}
      <header className="flex h-20 shrink-0 items-center justify-between border-b px-8">
        <div className="flex items-center gap-x-3">
          <Avatar className="size-14">
            <AvatarFallback>J</AvatarFallback>
          </Avatar>

          <div>
            <h2 className="text-lg font-bold">jordan</h2>
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
          {dummyMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isOwn ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  message.isOwn
                    ? "rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm bg-muted"
                }`}
              >
                <p className="text-sm">{message.content}</p>

                <span
                  className={`mt-1 block text-xs ${
                    message.isOwn
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {message.createdAt}
                </span>
              </div>
            </div>
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
